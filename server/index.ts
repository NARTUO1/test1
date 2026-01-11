import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { initializeDatabase } from "./database/db";

// Import all route handlers
import {
  registerUser,
  loginUser,
  getUserProfile,
  authenticateToken,
  requireAdmin,
  requireVendorOrAdmin,
} from "./routes/auth";

import {
  registerVendor,
  getVendorProfile,
  getAllVendors,
  updateVendorVerification,
  updateVendorProfile,
  getVendorStats,
} from "./routes/vendors";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getCategories,
  addProductReview,
  getVendorProducts,
} from "./routes/products";

import {
  createOrder,
  getOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getVendorOrders,
  cancelOrder,
} from "./routes/orders";

import {
  startChatSession,
  sendMessage,
  getChatHistory,
  getProductRecommendations,
  handleProductInquiry,
  getChatAnalytics,
} from "./routes/chatbot";

import {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getSystemSettings,
  updateSystemSetting,
  getSalesReports,
  createCategory,
  updateCategory,
  exportData,
} from "./routes/admin";

import {
  createPaymentIntent,
  confirmPayment,
  handleWebhook,
  getPublishableKey,
} from "./routes/payments";

export function createServer() {
  const app = express();

  // Initialize database on server start
  initializeDatabase().catch(console.error);

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "pong";
    res.json({ message: ping, timestamp: new Date().toISOString() });
  });

  // Legacy demo route
  app.get("/api/demo", handleDemo);

  // ========================================
  // AUTHENTICATION ROUTES
  // ========================================
  app.post("/api/auth/register", registerUser);
  app.post("/api/auth/login", loginUser);
  app.get("/api/auth/profile", authenticateToken, getUserProfile);

  // ========================================
  // VENDOR ROUTES
  // ========================================
  app.post("/api/vendors/register", authenticateToken, registerVendor);
  app.get(
    "/api/vendors/profile",
    authenticateToken,
    requireVendorOrAdmin,
    getVendorProfile,
  );
  app.put(
    "/api/vendors/profile",
    authenticateToken,
    requireVendorOrAdmin,
    updateVendorProfile,
  );
  app.get(
    "/api/vendors/stats",
    authenticateToken,
    requireVendorOrAdmin,
    getVendorStats,
  );
  app.get("/api/vendors", authenticateToken, requireAdmin, getAllVendors);
  app.put(
    "/api/vendors/:vendorId/verification",
    authenticateToken,
    requireAdmin,
    updateVendorVerification,
  );

  // ========================================
  // PRODUCT ROUTES
  // ========================================
  app.get("/api/products", getProducts);
  app.get("/api/products/:productId", getProductById);
  app.post(
    "/api/products",
    authenticateToken,
    requireVendorOrAdmin,
    createProduct,
  );
  app.put(
    "/api/products/:productId",
    authenticateToken,
    requireVendorOrAdmin,
    updateProduct,
  );
  app.delete(
    "/api/products/:productId",
    authenticateToken,
    requireVendorOrAdmin,
    deleteProduct,
  );
  app.get("/api/categories", getCategories);
  app.post(
    "/api/products/:productId/reviews",
    authenticateToken,
    addProductReview,
  );
  app.get(
    "/api/vendor/products",
    authenticateToken,
    requireVendorOrAdmin,
    getVendorProducts,
  );

  // ========================================
  // ORDER ROUTES
  // ========================================
  app.post("/api/orders", createOrder); // Supports both authenticated and guest orders
  app.get("/api/orders/:orderIdentifier", authenticateToken, getOrder);
  app.get("/api/orders", authenticateToken, getUserOrders);
  app.put("/api/orders/:orderId/cancel", authenticateToken, cancelOrder);
  app.get(
    "/api/vendor/orders",
    authenticateToken,
    requireVendorOrAdmin,
    getVendorOrders,
  );

  // Admin order routes
  app.get("/api/admin/orders", authenticateToken, requireAdmin, getAllOrders);
  app.put(
    "/api/admin/orders/:orderId/status",
    authenticateToken,
    requireVendorOrAdmin,
    updateOrderStatus,
  );

  // ========================================
  // CHATBOT ROUTES
  // ========================================
  app.post("/api/chat/start", startChatSession); // No auth required for guests
  app.post("/api/chat/:sessionId/message", sendMessage);
  app.get("/api/chat/:sessionId/history", getChatHistory);
  app.get("/api/chat/recommendations", getProductRecommendations);
  app.post("/api/chat/:sessionId/product-inquiry", handleProductInquiry);
  app.get(
    "/api/admin/chat/analytics",
    authenticateToken,
    requireAdmin,
    getChatAnalytics,
  );

  // ========================================
  // ADMIN ROUTES
  // ========================================
  app.get(
    "/api/admin/dashboard",
    authenticateToken,
    requireAdmin,
    getDashboardStats,
  );
  app.get("/api/admin/users", authenticateToken, requireAdmin, getAllUsers);
  app.put(
    "/api/admin/users/:userId/status",
    authenticateToken,
    requireAdmin,
    updateUserStatus,
  );
  app.get(
    "/api/admin/settings",
    authenticateToken,
    requireAdmin,
    getSystemSettings,
  );
  app.put(
    "/api/admin/settings",
    authenticateToken,
    requireAdmin,
    updateSystemSetting,
  );
  app.get(
    "/api/admin/reports/sales",
    authenticateToken,
    requireAdmin,
    getSalesReports,
  );
  app.post(
    "/api/admin/categories",
    authenticateToken,
    requireAdmin,
    createCategory,
  );
  app.put(
    "/api/admin/categories/:categoryId",
    authenticateToken,
    requireAdmin,
    updateCategory,
  );
  app.get("/api/admin/export", authenticateToken, requireAdmin, exportData);

  // ========================================
  // ERROR HANDLING
  // ========================================
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      console.error("Server error:", err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development"
            ? err.message
            : "Something went wrong",
      });
    },
  );

  // 404 handler
  app.use("/api/*", (req, res) => {
    res.status(404).json({
      success: false,
      message: "API endpoint not found",
    });
  });

  return app;
}
