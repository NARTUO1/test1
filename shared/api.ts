// Demo/Legacy interfaces
export interface DemoResponse {
  message: string;
}

// ========================================
// AUTH INTERFACES
// ========================================
export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  phone?: string;
  address?: string;
  role: "customer" | "vendor" | "admin";
  isActive: boolean;
  createdAt: string;
  vendorInfo?: Vendor;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    userId: number;
    username: string;
    email: string;
    fullName?: string;
    role: string;
    vendorInfo?: Vendor;
    token: string;
  };
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
  address?: string;
  role?: "customer" | "vendor";
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ========================================
// VENDOR INTERFACES
// ========================================
export interface Vendor {
  id: number;
  userId: number;
  businessName: string;
  businessDescription?: string;
  businessAddress?: string;
  taxId?: string;
  bankAccount?: string;
  commissionRate: number;
  isVerified: boolean;
  createdAt: string;
  username?: string;
  email?: string;
  fullName?: string;
}

export interface VendorRegistrationRequest {
  businessName: string;
  businessDescription?: string;
  businessAddress?: string;
  taxId?: string;
  bankAccount?: string;
}

export interface VendorStats {
  productCount: number;
  orderCount: number;
  totalSales: number;
  recentOrders: OrderItem[];
}

// ========================================
// PRODUCT INTERFACES
// ========================================
export interface Product {
  id: number;
  vendorId: number;
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  sku?: string;
  stockQuantity: number;
  imageUrl?: string;
  images: string[];
  specifications: Record<string, any>;
  isActive: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  categoryName?: string;
  vendorName?: string;
  vendorUsername?: string;
  vendorVerified?: boolean;
  averageRating?: number;
  reviewCount?: number;
  reviews?: Review[];
}

export interface CreateProductRequest {
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  sku?: string;
  stockQuantity?: number;
  imageUrl?: string;
  images?: string[];
  specifications?: Record<string, any>;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Review {
  id: number;
  productId: number;
  userId?: number;
  guestName?: string;
  rating: number;
  comment?: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  username?: string;
  fullName?: string;
}

// ========================================
// ORDER INTERFACES
// ========================================
export interface Order {
  id: number;
  userId?: number;
  guestEmail?: string;
  guestName?: string;
  guestPhone?: string;
  orderNumber: string;
  totalAmount: number;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  paymentMethod?: string;
  shippingAddress: string;
  billingAddress?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  itemCount?: number;
  username?: string;
  fullName?: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  vendorId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productName?: string;
  vendorName?: string;
}

export interface CreateOrderRequest {
  guestInfo?: {
    email: string;
    name: string;
    phone?: string;
  };
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  shippingAddress: string;
  billingAddress?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface OrderStatusUpdate {
  status?: Order["status"];
  paymentStatus?: Order["paymentStatus"];
}

// ========================================
// CHATBOT INTERFACES
// ========================================
export interface ChatSession {
  id: number;
  sessionId: string;
  userId?: number;
  guestIdentifier?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: number;
  sessionId: string;
  message: string;
  sender: "user" | "bot";
  metadata: Record<string, any>;
  createdAt: string;
}

export interface ChatResponse {
  success: boolean;
  data: {
    userMessage: string;
    botResponse: string;
    timestamp: string;
  };
}

export interface ProductInquiryRequest {
  productId: number;
  question: string;
}

export interface ProductRecommendation {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  imageUrl?: string;
  categoryName: string;
  vendorName: string;
}

// ========================================
// ADMIN INTERFACES
// ========================================
export interface DashboardStats {
  userStats: Array<{ role: string; count: number }>;
  orderStats: {
    totalOrders: number;
    pendingOrders: number;
    deliveredOrders: number;
    totalRevenue: number;
  };
  productStats: {
    totalProducts: number;
    activeProducts: number;
    featuredProducts: number;
  };
  vendorStats: {
    totalVendors: number;
    verifiedVendors: number;
  };
  recentActivity: {
    orders: Order[];
    users: User[];
  };
}

export interface SalesReport {
  salesData: Array<{
    period: string;
    orderCount: number;
    totalSales: number;
    averageOrderValue: number;
  }>;
  topProducts: Array<{
    name: string;
    price: number;
    totalSold: number;
    revenue: number;
  }>;
  topVendors: Array<{
    businessName: string;
    orderCount: number;
    revenue: number;
  }>;
}

export interface SystemSettings {
  siteName: string;
  commissionRate: string;
  guestCheckout: string;
  autoApproveVendors: string;
  chatbotEnabled: string;
  maxFileSize: string;
}

export interface ChatAnalytics {
  sessionStats: { totalSessions: number };
  messageStats: Array<{ sender: string; totalMessages: number }>;
  popularTopics: Array<{ topic: string; count: number }>;
}

// ========================================
// GENERIC API RESPONSE
// ========================================
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

// ========================================
// PAGINATION & FILTERING
// ========================================
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ProductFilters extends PaginationParams {
  categoryId?: number;
  vendorId?: number;
  search?: string;
  featured?: boolean;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface OrderFilters extends PaginationParams {
  status?: Order["status"];
  startDate?: string;
  endDate?: string;
}

export interface UserFilters extends PaginationParams {
  role?: User["role"];
  search?: string;
}

// ========================================
// WISHLIST INTERFACES
// ========================================
export interface WishlistItem {
  id: number;
  userId: number;
  productId: number;
  createdAt: string;
  product?: Product;
}

// ========================================
// UTILITY TYPES
// ========================================
export type UserRole = User["role"];
export type OrderStatus = Order["status"];
export type PaymentStatus = Order["paymentStatus"];
