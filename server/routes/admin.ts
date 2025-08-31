import { RequestHandler } from "express";
import { DatabaseService } from "../database/db";

const dbService = DatabaseService.getInstance();

// Get dashboard statistics
export const getDashboardStats: RequestHandler = async (req, res) => {
  try {
    const db = await dbService.getDb();

    // Get user statistics
    const userStats = await db.all(`
      SELECT role, COUNT(*) as count 
      FROM users 
      WHERE is_active = 1 
      GROUP BY role
    `);

    // Get order statistics
    const orderStats = await db.get(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
        SUM(total_amount) as total_revenue
      FROM orders
    `);

    // Get product statistics
    const productStats = await db.get(`
      SELECT 
        COUNT(*) as total_products,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_products,
        SUM(CASE WHEN featured = 1 THEN 1 ELSE 0 END) as featured_products
      FROM products
    `);

    // Get vendor statistics
    const vendorStats = await db.get(`
      SELECT 
        COUNT(*) as total_vendors,
        SUM(CASE WHEN is_verified = 1 THEN 1 ELSE 0 END) as verified_vendors
      FROM vendors
    `);

    // Get recent activity
    const recentOrders = await db.all(`
      SELECT o.id, o.order_number, o.total_amount, o.status, o.created_at,
             COALESCE(u.full_name, o.guest_name) as customer_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    const recentUsers = await db.all(`
      SELECT id, username, email, full_name, role, created_at
      FROM users
      WHERE is_active = 1
      ORDER BY created_at DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        userStats,
        orderStats,
        productStats,
        vendorStats,
        recentActivity: {
          orders: recentOrders,
          users: recentUsers,
        },
      },
    });
  } catch (error: any) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all users
export const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const db = await dbService.getDb();

    let query = `
      SELECT u.id, u.username, u.email, u.full_name, u.phone, u.role, 
             u.is_active, u.created_at,
             v.id as vendor_id, v.business_name, v.is_verified as vendor_verified
      FROM users u
      LEFT JOIN vendors v ON u.id = v.user_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (role) {
      query += " AND u.role = ?";
      params.push(role);
    }

    if (search) {
      query +=
        " AND (u.username LIKE ? OR u.email LIKE ? OR u.full_name LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += " ORDER BY u.created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit as string), offset);

    const users = await db.all(query, params);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        hasMore: users.length === parseInt(limit as string),
      },
    });
  } catch (error: any) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update user status
export const updateUserStatus: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const db = await dbService.getDb();
    await db.run("UPDATE users SET is_active = ? WHERE id = ?", [
      isActive ? 1 : 0,
      userId,
    ]);

    res.json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
    });
  } catch (error: any) {
    console.error("Update user status error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get system settings
export const getSystemSettings: RequestHandler = async (req, res) => {
  try {
    const settings = await dbService.getAdminSettings();

    res.json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    console.error("Get system settings error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update system setting
export const updateSystemSetting: RequestHandler = async (req, res) => {
  try {
    const { key, value } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({
        success: false,
        message: "Key and value are required",
      });
    }

    await dbService.updateAdminSetting(key, value);

    res.json({
      success: true,
      message: "Setting updated successfully",
    });
  } catch (error: any) {
    console.error("Update system setting error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get sales reports
export const getSalesReports: RequestHandler = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = "day" } = req.query;

    const db = await dbService.getDb();

    let dateFormat = "%Y-%m-%d";
    if (groupBy === "month") {
      dateFormat = "%Y-%m";
    } else if (groupBy === "year") {
      dateFormat = "%Y";
    }

    let query = `
      SELECT 
        strftime('${dateFormat}', created_at) as period,
        COUNT(*) as order_count,
        SUM(total_amount) as total_sales,
        AVG(total_amount) as average_order_value
      FROM orders
      WHERE status != 'cancelled'
    `;
    const params: any[] = [];

    if (startDate) {
      query += " AND created_at >= ?";
      params.push(startDate);
    }

    if (endDate) {
      query += " AND created_at <= ?";
      params.push(endDate);
    }

    query += " GROUP BY period ORDER BY period DESC";

    const salesData = await db.all(query, params);

    // Get top selling products
    const topProducts = await db.all(
      `
      SELECT p.name, p.price, SUM(oi.quantity) as total_sold, SUM(oi.total_price) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled'
      ${startDate ? "AND o.created_at >= ?" : ""}
      ${endDate ? "AND o.created_at <= ?" : ""}
      GROUP BY oi.product_id
      ORDER BY total_sold DESC
      LIMIT 10
    `,
      [startDate, endDate].filter(Boolean),
    );

    // Get top vendors
    const topVendors = await db.all(
      `
      SELECT v.business_name, COUNT(DISTINCT oi.order_id) as order_count, 
             SUM(oi.total_price) as revenue
      FROM order_items oi
      JOIN vendors v ON oi.vendor_id = v.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status != 'cancelled'
      ${startDate ? "AND o.created_at >= ?" : ""}
      ${endDate ? "AND o.created_at <= ?" : ""}
      GROUP BY oi.vendor_id
      ORDER BY revenue DESC
      LIMIT 10
    `,
      [startDate, endDate].filter(Boolean),
    );

    res.json({
      success: true,
      data: {
        salesData,
        topProducts,
        topVendors,
      },
    });
  } catch (error: any) {
    console.error("Get sales reports error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Manage categories
export const createCategory: RequestHandler = async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const db = await dbService.getDb();
    const result = await db.run(
      `
      INSERT INTO categories (name, description, image_url)
      VALUES (?, ?, ?)
    `,
      [name, description || null, imageUrl || null],
    );

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: { categoryId: result.lastID },
    });
  } catch (error: any) {
    console.error("Create category error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateCategory: RequestHandler = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description, imageUrl, isActive } = req.body;

    const db = await dbService.getDb();
    await db.run(
      `
      UPDATE categories 
      SET name = ?, description = ?, image_url = ?, is_active = ?
      WHERE id = ?
    `,
      [name, description, imageUrl, isActive ? 1 : 0, categoryId],
    );

    res.json({
      success: true,
      message: "Category updated successfully",
    });
  } catch (error: any) {
    console.error("Update category error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Export data
export const exportData: RequestHandler = async (req, res) => {
  try {
    const { type, format = "json" } = req.query;

    const db = await dbService.getDb();
    let data;

    switch (type) {
      case "users":
        data = await db.all("SELECT * FROM users WHERE is_active = 1");
        break;
      case "orders":
        data = await db.all("SELECT * FROM orders ORDER BY created_at DESC");
        break;
      case "products":
        data = await db.all("SELECT * FROM products WHERE is_active = 1");
        break;
      case "vendors":
        data = await db.all(`
          SELECT v.*, u.username, u.email 
          FROM vendors v 
          JOIN users u ON v.user_id = u.id
        `);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid export type",
        });
    }

    if (format === "csv") {
      // Simple CSV conversion (you might want to use a proper CSV library)
      if (data.length > 0) {
        const headers = Object.keys(data[0]).join(",");
        const rows = data.map((row) => Object.values(row).join(",")).join("\n");
        const csv = `${headers}\n${rows}`;

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${type}.csv"`,
        );
        res.send(csv);
      } else {
        res.setHeader("Content-Type", "text/csv");
        res.send("No data available");
      }
    } else {
      res.json({
        success: true,
        data,
      });
    }
  } catch (error: any) {
    console.error("Export data error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
