import { RequestHandler } from "express";
import { DatabaseService } from "../database/db";

const dbService = DatabaseService.getInstance();

// Register as vendor (upgrade existing user account)
export const registerVendor: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const {
      businessName,
      businessDescription,
      businessAddress,
      taxId,
      bankAccount,
    } = req.body;

    if (!businessName) {
      return res.status(400).json({
        success: false,
        message: "Business name is required",
      });
    }

    // Check if user is already a vendor
    const existingVendor = await dbService.getVendorByUserId(userId);
    if (existingVendor) {
      return res.status(409).json({
        success: false,
        message: "User is already registered as a vendor",
      });
    }

    // Create vendor profile
    const vendorId = await dbService.createVendor({
      userId,
      businessName,
      businessDescription,
      businessAddress,
      taxId,
      bankAccount,
    });

    // Update user role to vendor
    const db = await dbService.getDb();
    await db.run("UPDATE users SET role = ? WHERE id = ?", ["vendor", userId]);

    res.status(201).json({
      success: true,
      message: "Vendor registration successful",
      data: {
        vendorId,
        businessName,
        isVerified: false,
      },
    });
  } catch (error: any) {
    console.error("Vendor registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get vendor profile
export const getVendorProfile: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const vendor = await dbService.getVendorByUserId(userId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    res.json({
      success: true,
      data: vendor,
    });
  } catch (error: any) {
    console.error("Get vendor profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all vendors (admin only)
export const getAllVendors: RequestHandler = async (req, res) => {
  try {
    const db = await dbService.getDb();
    const vendors = await db.all(`
      SELECT v.*, u.username, u.email, u.full_name, u.created_at as user_created_at
      FROM vendors v
      JOIN users u ON v.user_id = u.id
      ORDER BY v.created_at DESC
    `);

    res.json({
      success: true,
      data: vendors,
    });
  } catch (error: any) {
    console.error("Get all vendors error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Verify/unverify vendor (admin only)
export const updateVendorVerification: RequestHandler = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { isVerified } = req.body;

    const db = await dbService.getDb();
    await db.run("UPDATE vendors SET is_verified = ? WHERE id = ?", [
      isVerified ? 1 : 0,
      vendorId,
    ]);

    res.json({
      success: true,
      message: `Vendor ${isVerified ? "verified" : "unverified"} successfully`,
    });
  } catch (error: any) {
    console.error("Update vendor verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update vendor profile
export const updateVendorProfile: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const {
      businessName,
      businessDescription,
      businessAddress,
      taxId,
      bankAccount,
    } = req.body;

    const db = await dbService.getDb();

    // Check if vendor exists
    const vendor = await dbService.getVendorByUserId(userId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    // Update vendor profile
    await db.run(
      `
      UPDATE vendors 
      SET business_name = ?, business_description = ?, business_address = ?, 
          tax_id = ?, bank_account = ?
      WHERE user_id = ?
    `,
      [
        businessName,
        businessDescription,
        businessAddress,
        taxId,
        bankAccount,
        userId,
      ],
    );

    res.json({
      success: true,
      message: "Vendor profile updated successfully",
    });
  } catch (error: any) {
    console.error("Update vendor profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get vendor statistics
export const getVendorStats: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const vendor = await dbService.getVendorByUserId(userId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    const db = await dbService.getDb();

    // Get product count
    const productCount = await db.get(
      "SELECT COUNT(*) as count FROM products WHERE vendor_id = ?",
      [vendor.id],
    );

    // Get order count and total sales
    const salesStats = await db.get(
      `
      SELECT COUNT(DISTINCT o.id) as order_count, 
             COALESCE(SUM(oi.total_price), 0) as total_sales
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE oi.vendor_id = ?
    `,
      [vendor.id],
    );

    // Get recent orders
    const recentOrders = await db.all(
      `
      SELECT o.id, o.order_number, o.total_amount, o.status, o.created_at,
             oi.quantity, oi.unit_price, oi.total_price,
             p.name as product_name
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE oi.vendor_id = ?
      ORDER BY o.created_at DESC
      LIMIT 10
    `,
      [vendor.id],
    );

    res.json({
      success: true,
      data: {
        productCount: productCount.count,
        orderCount: salesStats.order_count,
        totalSales: salesStats.total_sales,
        recentOrders,
      },
    });
  } catch (error: any) {
    console.error("Get vendor stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
