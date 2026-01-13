import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const DB_DIR = path.join(process.cwd(), "server/database");
const USERS_FILE = path.join(DB_DIR, "users.json");
const VENDORS_FILE = path.join(DB_DIR, "vendors.json");

function ensureDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

function readJson(filePath: string) {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw || "null");
  } catch (e) {
    return null;
  }
}

function writeJsonAtomic(filePath: string, data: any) {
  const tmp = `${filePath}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tmp, filePath);
}

export class JSONStore {
  private static instance: JSONStore;

  static getInstance() {
    if (!JSONStore.instance) JSONStore.instance = new JSONStore();
    return JSONStore.instance;
  }

  constructor() {
    ensureDir();
    if (!fs.existsSync(USERS_FILE)) writeJsonAtomic(USERS_FILE, { users: [] });
    if (!fs.existsSync(VENDORS_FILE)) writeJsonAtomic(VENDORS_FILE, { vendors: [] });
  }

  initAdminIfMissing = async () => {
    const data = readJson(USERS_FILE) || { users: [] };
    const existing = data.users.find((u: any) => u.email === "admin@marketplace.com");
    if (!existing) {
      const hashed = await bcrypt.hash("admin123", 10);
      const id = this._nextId(data.users);
      const admin = {
        id,
        username: "admin",
        email: "admin@marketplace.com",
        password_hash: hashed,
        full_name: "System Administrator",
        role: "admin",
        is_active: 1,
        created_at: new Date().toISOString(),
      };
      data.users.push(admin);
      writeJsonAtomic(USERS_FILE, data);
    }
  };

  _nextId(items: any[]) {
    if (!items || items.length === 0) return 1;
    return Math.max(...items.map((i) => i.id || 0)) + 1;
  }

  async createUser(userData: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
    phone?: string;
    address?: string;
    role?: "customer" | "vendor" | "admin";
  }) {
    const data = readJson(USERS_FILE) || { users: [] };
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const id = this._nextId(data.users);
    const user = {
      id,
      username: userData.username,
      email: userData.email,
      password_hash: hashedPassword,
      full_name: userData.fullName || null,
      phone: userData.phone || null,
      address: userData.address || null,
      role: userData.role || "customer",
      is_active: 1,
      created_at: new Date().toISOString(),
    };
    data.users.push(user);
    writeJsonAtomic(USERS_FILE, data);
    return id;
  }

  async getUserByEmail(email: string) {
    const data = readJson(USERS_FILE) || { users: [] };
    return data.users.find((u: any) => u.email === email && u.is_active === 1) || null;
  }

  async getUserById(id: number) {
    const data = readJson(USERS_FILE) || { users: [] };
    return data.users.find((u: any) => u.id === id && u.is_active === 1) || null;
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Vendor operations
  async createVendor(vendorData: {
    userId: number;
    businessName: string;
    businessDescription?: string;
    businessAddress?: string;
    taxId?: string;
    bankAccount?: string;
  }) {
    const data = readJson(VENDORS_FILE) || { vendors: [] };
    const id = this._nextId(data.vendors);
    const vendor = {
      id,
      user_id: vendorData.userId,
      business_name: vendorData.businessName,
      business_description: vendorData.businessDescription || null,
      business_address: vendorData.businessAddress || null,
      tax_id: vendorData.taxId || null,
      bank_account: vendorData.bankAccount || null,
      created_at: new Date().toISOString(),
    };
    data.vendors.push(vendor);
    writeJsonAtomic(VENDORS_FILE, data);
    return id;
  }

  async getVendorByUserId(userId: number) {
    const data = readJson(VENDORS_FILE) || { vendors: [] };
    const vendor = data.vendors.find((v: any) => v.user_id === userId) || null;
    if (!vendor) return null;
    // attach basic user info if available
    const users = readJson(USERS_FILE) || { users: [] };
    const user = users.users.find((u: any) => u.id === userId) || null;
    return Object.assign({}, vendor, {
      username: user?.username || null,
      email: user?.email || null,
      full_name: user?.full_name || null,
    });
  }
}
