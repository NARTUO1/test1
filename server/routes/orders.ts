import { RequestHandler } from "express";
import { DatabaseService } from "../database/db";
import { sendOrderConfirmation } from "../services/email";

const dbService = DatabaseService.getInstance();

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// Create order (supports both authenticated users and guests)
export const createOrder: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId; // May be undefined for guest orders
    const {
      guestInfo, // { email, name, phone } for guest orders
      items, // [{ productId, quantity }]
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes,
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    // For guest orders, validate guest info
    if (!userId && (!guestInfo || !guestInfo.email || !guestInfo.name)) {
      return res.status(400).json({
        success: false,
        message: "Guest email and name are required for guest orders",
      });
    }

    const db = await dbService.getDb();

    // Validate and calculate order total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await db.get(
        `
        SELECT p.*, v.id as vendor_id, v.commission_rate
        FROM products p
        JOIN vendors v ON p.vendor_id = v.id
        WHERE p.id = ? AND p.is_active = 1 AND p.stock_quantity >= ?
      `,
        [item.productId, item.quantity],
      );

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ID ${item.productId} is not available or insufficient stock`,
        });
      }

      const unitPrice = product.discount_price || product.price;
      const itemTotal = unitPrice * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product.id,
        vendorId: product.vendor_id,
        quantity: item.quantity,
        unitPrice,
      });
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order
    const orderId = await dbService.createOrder({
      userId: userId || undefined,
      guestEmail: guestInfo?.email,
      guestName: guestInfo?.name,
      guestPhone: guestInfo?.phone,
      orderNumber,
      totalAmount,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes,
      items: orderItems,
    });

    // Send order confirmation email
    const customerEmail =
      guestInfo?.email ||
      (userId ? (await dbService.getUserById(userId))?.email : undefined);
    if (customerEmail) {
      await sendOrderConfirmation(
        customerEmail,
        orderNumber,
        items,
        totalAmount,
      );
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        orderId,
        orderNumber,
        totalAmount,
        status: "pending",
      },
    });
  } catch (error: any) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get order by ID or order number
export const getOrder: RequestHandler = async (req, res) => {
  try {
    const { orderIdentifier } = req.params; // Can be ID or order number
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;

    const db = await dbService.getDb();

    // Build query based on user role and identifier type
    let query = `
      SELECT o.*, 
             GROUP_CONCAT(
               JSON_OBJECT(
                 'id', oi.id,
                 'productId', oi.product_id,
                 'productName', p.name,
                 'vendorName', v.business_name,
                 'quantity', oi.quantity,
                 'unitPrice', oi.unit_price,
                 'totalPrice', oi.total_price
               )
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN vendors v ON oi.vendor_id = v.id
      WHERE (o.id = ? OR o.order_number = ?)
    `;

    const params = [orderIdentifier, orderIdentifier];

    // Add user-specific filtering for non-admin users
    if (userRole !== "admin") {
      if (userId) {
        query += " AND o.user_id = ?";
        params.push(userId);
      } else {
        // For guest access, we'd need additional validation (email verification, etc.)
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
    }

    query += " GROUP BY o.id";

    const order = await db.get(query, params);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Parse items JSON
    order.items = order.items
      ? order.items.split(",").map((item: string) => JSON.parse(item))
      : [];

    res.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get user's orders
export const getUserOrders: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { page = 1, limit = 10, status } = req.query;

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const db = await dbService.getDb();

    let query = `
      SELECT o.id, o.order_number, o.total_amount, o.status, o.payment_status, 
             o.created_at, COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
    `;
    const params = [userId];

    if (status) {
      query += " AND o.status = ?";
      params.push(status as string);
    }

    query += " GROUP BY o.id ORDER BY o.created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit as string), offset);

    const orders = await db.all(query, params);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        hasMore: orders.length === parseInt(limit as string),
      },
    });
  } catch (error: any) {
    console.error("Get user orders error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all orders (admin only)
export const getAllOrders: RequestHandler = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const db = await dbService.getDb();

    let query = `
      SELECT o.id, o.order_number, o.total_amount, o.status, o.payment_status,
             o.created_at, o.user_id, o.guest_name, o.guest_email,
             u.username, u.full_name,
             COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      query += " AND o.status = ?";
      params.push(status);
    }

    if (startDate) {
      query += " AND o.created_at >= ?";
      params.push(startDate);
    }

    if (endDate) {
      query += " AND o.created_at <= ?";
      params.push(endDate);
    }

    query += " GROUP BY o.id ORDER BY o.created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit as string), offset);

    const orders = await db.all(query, params);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        hasMore: orders.length === parseInt(limit as string),
      },
    });
  } catch (error: any) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update order status (admin/vendor)
export const updateOrderStatus: RequestHandler = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, paymentStatus } = req.body;
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;

    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ];
    const validPaymentStatuses = ["pending", "completed", "failed", "refunded"];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    const db = await dbService.getDb();

    // Check if order exists and user has permission
    let order;
    if (userRole === "admin") {
      order = await db.get("SELECT * FROM orders WHERE id = ?", [orderId]);
    } else if (userRole === "vendor") {
      // Vendors can only update orders that contain their products
      order = await db.get(
        `
        SELECT DISTINCT o.*
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN vendors v ON oi.vendor_id = v.id
        WHERE o.id = ? AND v.user_id = ?
      `,
        [orderId, userId],
      );
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or access denied",
      });
    }

    // Update order
    const updates: string[] = [];
    const params: any[] = [];

    if (status) {
      updates.push("status = ?");
      params.push(status);
    }

    if (paymentStatus) {
      updates.push("payment_status = ?");
      params.push(paymentStatus);
    }

    if (updates.length > 0) {
      updates.push("updated_at = CURRENT_TIMESTAMP");
      params.push(orderId);

      await db.run(
        `
        UPDATE orders SET ${updates.join(", ")} WHERE id = ?
      `,
        params,
      );
    }

    res.json({
      success: true,
      message: "Order updated successfully",
    });
  } catch (error: any) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get vendor orders
export const getVendorOrders: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { page = 1, limit = 20, status } = req.query;

    const vendor = await dbService.getVendorByUserId(userId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const db = await dbService.getDb();

    let query = `
      SELECT DISTINCT o.id, o.order_number, o.total_amount, o.status, o.payment_status,
             o.created_at, o.user_id, o.guest_name, o.guest_email,
             u.username, u.full_name,
             SUM(oi.total_price) as vendor_total
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON o.id = oi.order_id
      WHERE oi.vendor_id = ?
    `;
    const params = [vendor.id];

    if (status) {
      query += " AND o.status = ?";
      params.push(status);
    }

    query += " GROUP BY o.id ORDER BY o.created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit as string), offset);

    const orders = await db.all(query, params);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        hasMore: orders.length === parseInt(limit as string),
      },
    });
  } catch (error: any) {
    console.error("Get vendor orders error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Cancel order
export const cancelOrder: RequestHandler = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;

    const db = await dbService.getDb();

    // Check if order exists and user has permission
    let order;
    if (userRole === "admin") {
      order = await db.get("SELECT * FROM orders WHERE id = ?", [orderId]);
    } else {
      order = await db.get(
        "SELECT * FROM orders WHERE id = ? AND user_id = ?",
        [orderId, userId],
      );
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or access denied",
      });
    }

    // Check if order can be cancelled
    if (!["pending", "confirmed"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled in current status",
      });
    }

    // Update order status and restore stock
    await db.run("BEGIN TRANSACTION");

    try {
      await db.run(
        "UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        ["cancelled", orderId],
      );

      // Restore product stock
      const orderItems = await db.all(
        "SELECT product_id, quantity FROM order_items WHERE order_id = ?",
        [orderId],
      );
      for (const item of orderItems) {
        await db.run(
          "UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?",
          [item.quantity, item.product_id],
        );
      }

      await db.run("COMMIT");
    } catch (error) {
      await db.run("ROLLBACK");
      throw error;
    }

    res.json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error: any) {
    console.error("Cancel order error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
