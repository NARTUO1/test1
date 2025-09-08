import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { JSONStore } from "./jsonStore";

// Enable verbose mode for debugging
const sqlite = sqlite3.verbose();

let db: Database | null = null;

export async function initializeDatabase(): Promise<Database> {
  if (db) {
    return db;
  }

  try {
    // Ensure database directory exists
    const dbDir = path.join(process.cwd(), "server/database");
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Open database connection
    db = await open({
      filename: path.join(dbDir, "marketplace.db"),
      driver: sqlite3.Database,
    });

    // Enable foreign keys
    await db.exec("PRAGMA foreign_keys = ON");
    await db.exec("PRAGMA journal_mode = WAL");

    // Read and execute schema
    const schemaPath = path.join(dbDir, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");
    await db.exec(schema);

    // Seed admin user into JSON store (users are now stored as JSON)
    const jsonStore = JSONStore.getInstance();
    await jsonStore.initAdminIfMissing();

    console.log("✅ Database initialized successfully");
    console.log("📋 Default admin credentials (if newly created):");
    console.log("   Username: admin");
    console.log("   Password: admin123");
    console.log("   Email: admin@marketplace.com");

    return db;
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}

export async function getDatabase(): Promise<Database> {
  if (!db) {
    return await initializeDatabase();
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}

// Database utility functions
export class DatabaseService {
  private static instance: DatabaseService;
  private db: Database | null = null;
  private jsonStore = JSONStore.getInstance();

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async getDb(): Promise<Database> {
    if (!this.db) {
      this.db = await getDatabase();
    }
    return this.db;
  }

  // User operations (migrated to JSON store)
  async createUser(userData: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
    phone?: string;
    address?: string;
    role?: "customer" | "vendor" | "admin";
  }) {
    return await this.jsonStore.createUser(userData as any);
  }

  async getUserByEmail(email: string) {
    return await this.jsonStore.getUserByEmail(email);
  }

  async getUserById(id: number) {
    return await this.jsonStore.getUserById(id);
  }

  async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await this.jsonStore.verifyPassword(password, hashedPassword);
  }

  // Vendor operations (migrated to JSON store)
  async createVendor(vendorData: {
    userId: number;
    businessName: string;
    businessDescription?: string;
    businessAddress?: string;
    taxId?: string;
    bankAccount?: string;
  }) {
    // Create vendor in JSON store (authoritative vendor data)
    const vendorId = await this.jsonStore.createVendor(vendorData as any);

    // Also ensure a corresponding row exists in the SQLite vendors table so JOINs continue to work
    const db = await this.getDb();
    try {
      await db.run(
        `INSERT OR REPLACE INTO vendors (id, user_id, business_name, business_description, business_address, tax_id, bank_account, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [
          vendorId,
          vendorData.userId,
          vendorData.businessName,
          vendorData.businessDescription || null,
          vendorData.businessAddress || null,
          vendorData.taxId || null,
          vendorData.bankAccount || null,
        ],
      );
    } catch (e) {
      // If sqlite insert fails, log but do not break (JSON store is authoritative)
      console.error('Failed to insert vendor into sqlite vendors table:', e);
    }

    return vendorId;
  }

  async getVendorByUserId(userId: number) {
    return await this.jsonStore.getVendorByUserId(userId);
  }

  // Product operations (remain in SQLite)
  async createProduct(productData: {
    vendorId: number;
    categoryId: number;
    name: string;
    description?: string;
    price: number;
    discountPrice?: number;
    sku?: string;
    stockQuantity?: number;
    imageUrl?: string;
    images?: string[];
    specifications?: object;
  }) {
    const db = await this.getDb();
    const result = await db.run(
      `
      INSERT INTO products (vendor_id, category_id, name, description, price, discount_price, 
                          sku, stock_quantity, image_url, images, specifications)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        productData.vendorId,
        productData.categoryId,
        productData.name,
        productData.description || null,
        productData.price,
        productData.discountPrice || null,
        productData.sku || null,
        productData.stockQuantity || 0,
        productData.imageUrl || null,
        JSON.stringify(productData.images || []),
        JSON.stringify(productData.specifications || {}),
      ],
    );

    return result.lastID;
  }

  async getProducts(
    filters: {
      categoryId?: number;
      vendorId?: number;
      search?: string;
      isActive?: boolean;
      featured?: boolean;
      limit?: number;
      offset?: number;
    } = {},
  ) {
    const db = await this.getDb();
    let query = `
      SELECT p.*, c.name as category_name, v.business_name as vendor_name,
             u.username as vendor_username
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN vendors v ON p.vendor_id = v.id
      JOIN users u ON v.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters.categoryId) {
      query += " AND p.category_id = ?";
      params.push(filters.categoryId);
    }

    if (filters.vendorId) {
      query += " AND p.vendor_id = ?";
      params.push(filters.vendorId);
    }

    if (filters.search) {
      query += " AND (p.name LIKE ? OR p.description LIKE ?)";
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.isActive !== undefined) {
      query += " AND p.is_active = ?";
      params.push(filters.isActive ? 1 : 0);
    }

    if (filters.featured !== undefined) {
      query += " AND p.featured = ?";
      params.push(filters.featured ? 1 : 0);
    }

    query += " ORDER BY p.created_at DESC";

    if (filters.limit) {
      query += " LIMIT ?";
      params.push(filters.limit);

      if (filters.offset) {
        query += " OFFSET ?";
        params.push(filters.offset);
      }
    }

    return await db.all(query, params);
  }

  // Order operations
  async createOrder(orderData: {
    userId?: number;
    guestEmail?: string;
    guestName?: string;
    guestPhone?: string;
    orderNumber: string;
    totalAmount: number;
    shippingAddress: string;
    billingAddress?: string;
    paymentMethod?: string;
    notes?: string;
    items: Array<{
      productId: number;
      vendorId: number;
      quantity: number;
      unitPrice: number;
    }>;
  }) {
    const db = await this.getDb();

    // Start transaction
    await db.run("BEGIN TRANSACTION");

    try {
      // Create order
      const orderResult = await db.run(
        `
        INSERT INTO orders (user_id, guest_email, guest_name, guest_phone, order_number, 
                          total_amount, shipping_address, billing_address, payment_method, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          orderData.userId || null,
          orderData.guestEmail || null,
          orderData.guestName || null,
          orderData.guestPhone || null,
          orderData.orderNumber,
          orderData.totalAmount,
          orderData.shippingAddress,
          orderData.billingAddress || null,
          orderData.paymentMethod || null,
          orderData.notes || null,
        ],
      );

      const orderId = orderResult.lastID;

      // Create order items
      for (const item of orderData.items) {
        await db.run(
          `
          INSERT INTO order_items (order_id, product_id, vendor_id, quantity, unit_price, total_price)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
          [
            orderId,
            item.productId,
            item.vendorId,
            item.quantity,
            item.unitPrice,
            item.quantity * item.unitPrice,
          ],
        );

        // Update product stock
        await db.run(
          `
          UPDATE products 
          SET stock_quantity = stock_quantity - ? 
          WHERE id = ? AND stock_quantity >= ?
        `,
          [item.quantity, item.productId, item.quantity],
        );
      }

      await db.run("COMMIT");
      return orderId;
    } catch (error) {
      await db.run("ROLLBACK");
      throw error;
    }
  }

  // Categories
  async getCategories() {
    const db = await this.getDb();
    return await db.all(
      "SELECT * FROM categories WHERE is_active = 1 ORDER BY name",
    );
  }

  // Chat operations
  async createChatSession(
    sessionId: string,
    userId?: number,
    guestIdentifier?: string,
  ) {
    const db = await this.getDb();
    const result = await db.run(
      `
      INSERT INTO chat_sessions (session_id, user_id, guest_identifier)
      VALUES (?, ?, ?)
    `,
      [sessionId, userId || null, guestIdentifier || null],
    );

    return result.lastID;
  }

  async addChatMessage(
    sessionId: string,
    message: string,
    sender: "user" | "bot",
    metadata?: object,
  ) {
    const db = await this.getDb();
    const result = await db.run(
      `
      INSERT INTO chat_messages (session_id, message, sender, metadata)
      VALUES (?, ?, ?, ?)
    `,
      [sessionId, message, sender, JSON.stringify(metadata || {})],
    );

    return result.lastID;
  }

  async getChatHistory(sessionId: string, limit = 50) {
    const db = await this.getDb();
    return await db.all(
      `
      SELECT * FROM chat_messages 
      WHERE session_id = ? 
      ORDER BY created_at ASC 
      LIMIT ?
    `,
      [sessionId, limit],
    );
  }

  // Admin operations
  async getAdminSettings() {
    const db = await this.getDb();
    const settings = await db.all("SELECT * FROM admin_settings");
    return settings.reduce(
      (acc, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      },
      {} as Record<string, string>,
    );
  }

  async updateAdminSetting(key: string, value: string) {
    const db = await this.getDb();
    await db.run(
      `
      INSERT OR REPLACE INTO admin_settings (setting_key, setting_value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `,
      [key, value],
    );
  }
}
