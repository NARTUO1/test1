import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { DatabaseService } from "../database/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const dbService = DatabaseService.getInstance();

// Register new user
export const registerUser: RequestHandler = async (req, res) => {
  try {
    const { username, email, password, fullName, phone, address, role } =
      req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await dbService.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create user
    const userId = await dbService.createUser({
      username,
      email,
      password,
      fullName,
      phone,
      address,
      role: role || "customer",
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId, email, role: role || "customer" },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        userId,
        username,
        email,
        fullName,
        role: role || "customer",
        token,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Login user
export const loginUser: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Get user by email
    const user = await dbService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Verify password
    const isValidPassword = await dbService.verifyPassword(
      password,
      user.password_hash,
    );
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    // Get vendor info if user is a vendor
    let vendorInfo = null;
    if (user.role === "vendor") {
      vendorInfo = await dbService.getVendorByUserId(user.id);
    }

    res.json({
      success: true,
      message: "Login successful",
      data: {
        userId: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        vendorInfo,
        token,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get current user profile
export const getUserProfile: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const user = await dbService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get vendor info if user is a vendor
    let vendorInfo = null;
    if (user.role === "vendor") {
      vendorInfo = await dbService.getVendorByUserId(user.id);
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        phone: user.phone,
        address: user.address,
        role: user.role,
        vendorInfo,
        createdAt: user.created_at,
      },
    });
  } catch (error: any) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Middleware to verify JWT token
export const authenticateToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    (req as any).userId = decoded.userId;
    (req as any).userEmail = decoded.email;
    (req as any).userRole = decoded.role;
    next();
  });
};

// Middleware to check if user is admin
export const requireAdmin: RequestHandler = (req, res, next) => {
  const userRole = (req as any).userRole;

  if (userRole !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};

// Middleware to check if user is vendor or admin
export const requireVendorOrAdmin: RequestHandler = (req, res, next) => {
  const userRole = (req as any).userRole;

  if (userRole !== "vendor" && userRole !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Vendor or admin access required",
    });
  }

  next();
};
