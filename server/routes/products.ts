import { RequestHandler } from "express";
import { DatabaseService } from "../database/db";

const dbService = DatabaseService.getInstance();

// Create new product (vendor only)
export const createProduct: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const {
      categoryId,
      name,
      description,
      price,
      discountPrice,
      sku,
      stockQuantity,
      imageUrl,
      images,
      specifications,
    } = req.body;

    if (!categoryId || !name || !price) {
      return res.status(400).json({
        success: false,
        message: "Category ID, name, and price are required",
      });
    }

    // Get vendor ID for the user
    const vendor = await dbService.getVendorByUserId(userId);
    if (!vendor) {
      return res.status(403).json({
        success: false,
        message: "Only verified vendors can create products",
      });
    }

    // Create product
    const productId = await dbService.createProduct({
      vendorId: vendor.id,
      categoryId,
      name,
      description,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
      sku,
      stockQuantity: stockQuantity ? parseInt(stockQuantity) : 0,
      imageUrl,
      images: images || [],
      specifications: specifications || {},
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { productId },
    });
  } catch (error: any) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all products with filtering
export const getProducts: RequestHandler = async (req, res) => {
  try {
    const {
      categoryId,
      vendorId,
      search,
      featured,
      page = 1,
      limit = 20,
      sortBy = "created_at",
      sortOrder = "DESC",
    } = req.query;

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const products = await dbService.getProducts({
      categoryId: categoryId ? parseInt(categoryId as string) : undefined,
      vendorId: vendorId ? parseInt(vendorId as string) : undefined,
      search: search as string,
      isActive: true,
      featured: featured === "true" ? true : undefined,
      limit: parseInt(limit as string),
      offset,
    });

    // Parse JSON fields
    const processedProducts = products.map((product) => ({
      ...product,
      images: JSON.parse(product.images || "[]"),
      specifications: JSON.parse(product.specifications || "{}"),
    }));

    res.json({
      success: true,
      data: processedProducts,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        hasMore: products.length === parseInt(limit as string),
      },
    });
  } catch (error: any) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get product by ID
export const getProductById: RequestHandler = async (req, res) => {
  try {
    const { productId } = req.params;

    const db = await dbService.getDb();
    const product = await db.get(
      `
      SELECT p.*, c.name as category_name, v.business_name as vendor_name,
             u.username as vendor_username, v.is_verified as vendor_verified
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN vendors v ON p.vendor_id = v.id
      JOIN users u ON v.user_id = u.id
      WHERE p.id = ? AND p.is_active = 1
    `,
      [productId],
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Parse JSON fields
    product.images = JSON.parse(product.images || "[]");
    product.specifications = JSON.parse(product.specifications || "{}");

    // Get product reviews
    const reviews = await db.all(
      `
      SELECT r.*, u.username, u.full_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `,
      [productId],
    );

    // Calculate average rating
    const ratingStats = await db.get(
      `
      SELECT AVG(rating) as average_rating, COUNT(*) as review_count
      FROM reviews 
      WHERE product_id = ?
    `,
      [productId],
    );

    res.json({
      success: true,
      data: {
        ...product,
        reviews,
        averageRating: ratingStats.average_rating || 0,
        reviewCount: ratingStats.review_count || 0,
      },
    });
  } catch (error: any) {
    console.error("Get product by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update product (vendor/admin only)
export const updateProduct: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;
    const { productId } = req.params;
    const {
      categoryId,
      name,
      description,
      price,
      discountPrice,
      sku,
      stockQuantity,
      imageUrl,
      images,
      specifications,
      isActive,
      featured,
    } = req.body;

    const db = await dbService.getDb();

    // Check if product exists and user has permission
    let product;
    if (userRole === "admin") {
      product = await db.get("SELECT * FROM products WHERE id = ?", [
        productId,
      ]);
    } else {
      const vendor = await dbService.getVendorByUserId(userId);
      if (!vendor) {
        return res.status(403).json({
          success: false,
          message: "Vendor profile required",
        });
      }
      product = await db.get(
        "SELECT * FROM products WHERE id = ? AND vendor_id = ?",
        [productId, vendor.id],
      );
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or access denied",
      });
    }

    // Update product
    await db.run(
      `
      UPDATE products 
      SET category_id = ?, name = ?, description = ?, price = ?, discount_price = ?,
          sku = ?, stock_quantity = ?, image_url = ?, images = ?, specifications = ?,
          is_active = ?, featured = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [
        categoryId || product.category_id,
        name || product.name,
        description !== undefined ? description : product.description,
        price !== undefined ? parseFloat(price) : product.price,
        discountPrice !== undefined
          ? discountPrice
            ? parseFloat(discountPrice)
            : null
          : product.discount_price,
        sku !== undefined ? sku : product.sku,
        stockQuantity !== undefined
          ? parseInt(stockQuantity)
          : product.stock_quantity,
        imageUrl !== undefined ? imageUrl : product.image_url,
        images !== undefined ? JSON.stringify(images) : product.images,
        specifications !== undefined
          ? JSON.stringify(specifications)
          : product.specifications,
        isActive !== undefined ? (isActive ? 1 : 0) : product.is_active,
        featured !== undefined ? (featured ? 1 : 0) : product.featured,
        productId,
      ],
    );

    res.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error: any) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete product (vendor/admin only)
export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;
    const { productId } = req.params;

    const db = await dbService.getDb();

    // Check if product exists and user has permission
    let product;
    if (userRole === "admin") {
      product = await db.get("SELECT * FROM products WHERE id = ?", [
        productId,
      ]);
    } else {
      const vendor = await dbService.getVendorByUserId(userId);
      if (!vendor) {
        return res.status(403).json({
          success: false,
          message: "Vendor profile required",
        });
      }
      product = await db.get(
        "SELECT * FROM products WHERE id = ? AND vendor_id = ?",
        [productId, vendor.id],
      );
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or access denied",
      });
    }

    // Soft delete by setting is_active to false
    await db.run("UPDATE products SET is_active = 0 WHERE id = ?", [productId]);

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get categories
export const getCategories: RequestHandler = async (req, res) => {
  try {
    const categories = await dbService.getCategories();

    res.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Add product review
export const addProductReview: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const db = await dbService.getDb();

    // Check if product exists
    const product = await db.get(
      "SELECT id FROM products WHERE id = ? AND is_active = 1",
      [productId],
    );
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if user has already reviewed this product
    const existingReview = await db.get(
      "SELECT id FROM reviews WHERE product_id = ? AND user_id = ?",
      [productId, userId],
    );

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Add review
    await db.run(
      `
      INSERT INTO reviews (product_id, user_id, rating, comment)
      VALUES (?, ?, ?, ?)
    `,
      [productId, userId, rating, comment],
    );

    res.status(201).json({
      success: true,
      message: "Review added successfully",
    });
  } catch (error: any) {
    console.error("Add review error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get vendor's products
export const getVendorProducts: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const vendor = await dbService.getVendorByUserId(userId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    const products = await dbService.getProducts({
      vendorId: vendor.id,
      isActive: undefined, // Show all products for vendor
    });

    // Parse JSON fields
    const processedProducts = products.map((product) => ({
      ...product,
      images: JSON.parse(product.images || "[]"),
      specifications: JSON.parse(product.specifications || "{}"),
    }));

    res.json({
      success: true,
      data: processedProducts,
    });
  } catch (error: any) {
    console.error("Get vendor products error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
