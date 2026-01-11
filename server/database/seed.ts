import { Database } from "sqlite";
import bcrypt from "bcryptjs";

export async function seedDatabase(db: Database) {
  try {
    console.log("🌱 Starting database seeding...");

    // Check if data already exists
    const categoryCount = await db.get(
      "SELECT COUNT(*) as count FROM categories"
    );
    const productCount = await db.get("SELECT COUNT(*) as count FROM products");

    if (
      categoryCount &&
      categoryCount.count > 8 &&
      productCount &&
      productCount.count > 20
    ) {
      console.log("✅ Database already seeded");
      return;
    }

    // Create default vendor account for demo products
    let vendorId = 1;
    const vendorExists = await db.get(
      "SELECT id FROM vendors WHERE business_name = ?",
      ["MarketHub Official Store"]
    );

    if (!vendorExists) {
      // Create vendor user first
      const hashedPassword = await bcrypt.hash("vendor123", 10);
      const userResult = await db.run(
        `INSERT INTO users (username, email, password_hash, full_name, role, is_active)
         VALUES (?, ?, ?, ?, ?, 1)`,
        [
          "markethub",
          "vendor@markethub.com",
          hashedPassword,
          "MarketHub Official",
          "vendor"
        ]
      );
      const userId = userResult.lastID;

      // Create vendor
      const vendorResult = await db.run(
        `INSERT INTO vendors (user_id, business_name, business_description, is_verified, created_at)
         VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)`,
        [
          userId,
          "MarketHub Official Store",
          "Premium curated products from trusted brands worldwide"
        ]
      );
      vendorId = vendorResult.lastID;
    } else {
      vendorId = vendorExists.id;
    }

    // Seed products with real data
    const productCategories = {
      Electronics: 1,
      Clothing: 2,
      "Home & Garden": 3,
      "Sports & Outdoors": 4,
      "Books & Media": 5,
      "Health & Beauty": 6,
      Automotive: 7,
      "Food & Beverages": 8,
    };

    const products = [
      {
        name: "iPhone 15 Pro Max",
        category: "Electronics",
        price: 99599,
        description: "Latest flagship smartphone with advanced features",
        image:
          "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop",
        stock: 50,
        featured: true,
      },
      {
        name: "MacBook Air M3",
        category: "Electronics",
        price: 91299,
        description: "Powerful and portable laptop for professionals",
        image:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
        stock: 30,
        featured: true,
      },
      {
        name: "Premium Wireless Headphones",
        category: "Electronics",
        price: 24899,
        originalPrice: 33199,
        description: "High-quality audio with noise cancellation",
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        stock: 100,
        featured: false,
      },
      {
        name: "4K Gaming Monitor",
        category: "Electronics",
        price: 49799,
        description: "Perfect for gaming and professional work",
        image:
          "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop",
        stock: 25,
        featured: false,
      },
      {
        name: "Designer Leather Jacket",
        category: "Clothing",
        price: 20749,
        description: "Premium quality leather jacket for style-conscious customers",
        image:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
        stock: 40,
        featured: true,
      },
      {
        name: "Premium Running Shoes",
        category: "Clothing",
        price: 13279,
        description: "Comfortable running shoes with advanced cushioning",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
        stock: 80,
        featured: true,
      },
      {
        name: "Elegant Evening Dress",
        category: "Clothing",
        price: 15769,
        description: "Sophisticated formal dress for special occasions",
        image:
          "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=400&fit=crop",
        stock: 35,
        featured: false,
      },
      {
        name: "Modern Coffee Table",
        category: "Home & Garden",
        price: 33199,
        description: "Contemporary design coffee table for living rooms",
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
        stock: 20,
        featured: false,
      },
      {
        name: "Smart Home Security System",
        category: "Home & Garden",
        price: 66399,
        description: "Advanced security system with app control",
        image:
          "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop",
        stock: 15,
        featured: true,
      },
      {
        name: "Smart Fitness Watch",
        category: "Sports & Outdoors",
        price: 24899,
        description: "Track your fitness and health metrics in real-time",
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
        stock: 60,
        featured: true,
      },
      {
        name: "Professional Camera Lens 85mm",
        category: "Electronics",
        price: 107899,
        description: "Premium lens for professional photography",
        image:
          "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop",
        stock: 12,
        featured: true,
      },
      {
        name: "Yoga Mat Premium",
        category: "Sports & Outdoors",
        price: 4149,
        description: "High-quality yoga mat for fitness enthusiasts",
        image:
          "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
        stock: 150,
        featured: false,
      },
      {
        name: "Organic Coffee Beans",
        category: "Food & Beverages",
        price: 2075,
        description: "Premium organic coffee beans from around the world",
        image:
          "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop",
        stock: 200,
        featured: false,
      },
      {
        name: "Professional Makeup Kit",
        category: "Health & Beauty",
        price: 10789,
        description: "Complete makeup kit for professionals",
        image:
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop",
        stock: 75,
        featured: false,
      },
      {
        name: "Car Dashboard Camera",
        category: "Automotive",
        price: 12449,
        description: "High-definition dash cam for your vehicle",
        image:
          "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=400&fit=crop",
        stock: 45,
        featured: false,
      },
      {
        name: "Programming Complete Guide",
        category: "Books & Media",
        price: 3319,
        description: "Comprehensive guide to modern programming",
        image:
          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop",
        stock: 120,
        featured: false,
      },
      {
        name: "Skincare Essential Set",
        category: "Health & Beauty",
        price: 7469,
        description: "Complete skincare routine set for all skin types",
        image:
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
        stock: 95,
        featured: true,
      },
      {
        name: "Educational Toy Set",
        category: "Home & Garden",
        price: 6639,
        description: "Interactive toys for child development",
        image:
          "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop",
        stock: 55,
        featured: false,
      },
      {
        name: "Luxury Gift Hamper",
        category: "Home & Garden",
        price: 16599,
        description: "Premium gift set for special occasions",
        image:
          "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop",
        stock: 30,
        featured: true,
      },
      {
        name: "Denim Jacket",
        category: "Clothing",
        price: 7469,
        originalPrice: 10789,
        description: "Classic denim jacket for casual wear",
        image:
          "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&h=400&fit=crop",
        stock: 110,
        featured: false,
      },
    ];

    for (const product of products) {
      const categoryId =
        productCategories[product.category as keyof typeof productCategories];
      if (!categoryId) {
        console.warn(`Category ${product.category} not found`);
        continue;
      }

      const existingProduct = await db.get(
        "SELECT id FROM products WHERE name = ? AND vendor_id = ?",
        [product.name, vendorId]
      );

      if (!existingProduct) {
        await db.run(
          `INSERT INTO products (vendor_id, category_id, name, description, price, discount_price, stock_quantity, image_url, featured, is_active, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)`,
          [
            vendorId,
            categoryId,
            product.name,
            product.description,
            product.price,
            product.originalPrice || null,
            product.stock || 50,
            product.image,
            product.featured ? 1 : 0,
          ]
        );
      }
    }

    console.log("✅ Database seeded successfully");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}
