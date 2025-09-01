import {
  ApiResponse,
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  User,
  Vendor,
  VendorRegistrationRequest,
  VendorStats,
  Product,
  CreateProductRequest,
  Category,
  Order,
  CreateOrderRequest,
  OrderStatusUpdate,
  ChatSession,
  ChatMessage,
  ChatResponse,
  ProductInquiryRequest,
  ProductRecommendation,
  DashboardStats,
  SalesReport,
  SystemSettings,
  ChatAnalytics,
  ProductFilters,
  OrderFilters,
  UserFilters,
  Review,
} from "@shared/api";

const API_BASE_URL = "/api";

// Helper function to get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

// Helper function to make authenticated requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = getAuthToken();

  const mergedHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };
  // Set JSON content-type only when a body exists and caller didn't set one
  if (options.body && !("Content-Type" in mergedHeaders)) {
    mergedHeaders["Content-Type"] = "application/json";
  }

  const config: RequestInit = {
    ...options,
    headers: mergedHeaders,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle empty/204 responses safely
    const contentType = response.headers.get("content-type") || "";
    const contentLength = response.headers.get("content-length");

    let parsed: any = {};
    if (response.status !== 204 && contentType.includes("application/json")) {
      const text = await response.text();
      if (text) {
        try {
          parsed = JSON.parse(text);
        } catch (e) {
          // Fallback when server sends invalid JSON
          parsed = { success: response.ok, message: text };
        }
      } else {
        parsed = { success: response.ok };
      }
    } else if (contentLength === "0" || response.status === 204) {
      parsed = { success: response.ok };
    } else {
      // Non-JSON response, attempt text
      const text = await response.text().catch(() => "");
      parsed = { success: response.ok, message: text };
    }

    if (!response.ok) {
      const message = parsed?.message || parsed?.error || response.statusText || "API request failed";
      throw new Error(message);
    }

    return parsed as ApiResponse<T>;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// ========================================
// AUTH API
// ========================================
export const authApi = {
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    return apiRequest<AuthResponse["data"]>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return apiRequest<AuthResponse["data"]>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiRequest<User>("/auth/profile");
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  },

  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  },
};

// ========================================
// VENDOR API
// ========================================
export const vendorApi = {
  register: async (
    vendorData: VendorRegistrationRequest,
  ): Promise<ApiResponse<{ vendorId: number }>> => {
    return apiRequest("/vendors/register", {
      method: "POST",
      body: JSON.stringify(vendorData),
    });
  },

  getProfile: async (): Promise<ApiResponse<Vendor>> => {
    return apiRequest<Vendor>("/vendors/profile");
  },

  updateProfile: async (
    vendorData: Partial<VendorRegistrationRequest>,
  ): Promise<ApiResponse> => {
    return apiRequest("/vendors/profile", {
      method: "PUT",
      body: JSON.stringify(vendorData),
    });
  },

  getStats: async (): Promise<ApiResponse<VendorStats>> => {
    return apiRequest<VendorStats>("/vendors/stats");
  },

  getAll: async (): Promise<ApiResponse<Vendor[]>> => {
    return apiRequest<Vendor[]>("/vendors");
  },

  updateVerification: async (
    vendorId: number,
    isVerified: boolean,
  ): Promise<ApiResponse> => {
    return apiRequest(`/vendors/${vendorId}/verification`, {
      method: "PUT",
      body: JSON.stringify({ isVerified }),
    });
  },
};

// ========================================
// PRODUCT API
// ========================================
export const productApi = {
  getAll: async (filters?: ProductFilters): Promise<ApiResponse<Product[]>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<Product[]>(`/products${query}`);
  },

  getById: async (productId: number): Promise<ApiResponse<Product>> => {
    return apiRequest<Product>(`/products/${productId}`);
  },

  create: async (
    productData: CreateProductRequest,
  ): Promise<ApiResponse<{ productId: number }>> => {
    return apiRequest("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  },

  update: async (
    productId: number,
    productData: Partial<CreateProductRequest>,
  ): Promise<ApiResponse> => {
    return apiRequest(`/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  },

  delete: async (productId: number): Promise<ApiResponse> => {
    return apiRequest(`/products/${productId}`, {
      method: "DELETE",
    });
  },

  addReview: async (
    productId: number,
    rating: number,
    comment?: string,
  ): Promise<ApiResponse> => {
    return apiRequest(`/products/${productId}/reviews`, {
      method: "POST",
      body: JSON.stringify({ rating, comment }),
    });
  },

  getVendorProducts: async (): Promise<ApiResponse<Product[]>> => {
    return apiRequest<Product[]>("/vendor/products");
  },
};

// ========================================
// CATEGORY API
// ========================================
export const categoryApi = {
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    return apiRequest<Category[]>("/categories");
  },

  create: async (categoryData: {
    name: string;
    description?: string;
    imageUrl?: string;
  }): Promise<ApiResponse<{ categoryId: number }>> => {
    return apiRequest("/admin/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  },

  update: async (
    categoryId: number,
    categoryData: {
      name?: string;
      description?: string;
      imageUrl?: string;
      isActive?: boolean;
    },
  ): Promise<ApiResponse> => {
    return apiRequest(`/admin/categories/${categoryId}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
  },
};

// ========================================
// ORDER API
// ========================================
export const orderApi = {
  create: async (
    orderData: CreateOrderRequest,
  ): Promise<
    ApiResponse<{ orderId: number; orderNumber: string; totalAmount: number }>
  > => {
    return apiRequest("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  },

  getById: async (orderIdentifier: string): Promise<ApiResponse<Order>> => {
    return apiRequest<Order>(`/orders/${orderIdentifier}`);
  },

  getUserOrders: async (
    filters?: OrderFilters,
  ): Promise<ApiResponse<Order[]>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<Order[]>(`/orders${query}`);
  },

  cancel: async (orderId: number): Promise<ApiResponse> => {
    return apiRequest(`/orders/${orderId}/cancel`, {
      method: "PUT",
    });
  },

  getVendorOrders: async (
    filters?: OrderFilters,
  ): Promise<ApiResponse<Order[]>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<Order[]>(`/vendor/orders${query}`);
  },

  updateStatus: async (
    orderId: number,
    statusUpdate: OrderStatusUpdate,
  ): Promise<ApiResponse> => {
    return apiRequest(`/admin/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify(statusUpdate),
    });
  },
};

// ========================================
// CHATBOT API
// ========================================
export const chatApi = {
  startSession: async (
    guestIdentifier?: string,
  ): Promise<ApiResponse<{ sessionId: string; welcomeMessage: string }>> => {
    return apiRequest("/chat/start", {
      method: "POST",
      body: JSON.stringify({ guestIdentifier }),
    });
  },

  sendMessage: async (
    sessionId: string,
    message: string,
  ): Promise<ChatResponse> => {
    return apiRequest(`/chat/${sessionId}/message`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  },

  getHistory: async (
    sessionId: string,
    limit?: number,
  ): Promise<ApiResponse<ChatMessage[]>> => {
    const query = limit ? `?limit=${limit}` : "";
    return apiRequest<ChatMessage[]>(`/chat/${sessionId}/history${query}`);
  },

  getRecommendations: async (
    query?: string,
    category?: number,
    maxPrice?: number,
  ): Promise<ApiResponse<ProductRecommendation[]>> => {
    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (category) params.append("category", category.toString());
    if (maxPrice) params.append("maxPrice", maxPrice.toString());
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<ProductRecommendation[]>(
      `/chat/recommendations${queryString}`,
    );
  },

  sendProductInquiry: async (
    sessionId: string,
    inquiry: ProductInquiryRequest,
  ): Promise<ApiResponse<any>> => {
    return apiRequest(`/chat/${sessionId}/product-inquiry`, {
      method: "POST",
      body: JSON.stringify(inquiry),
    });
  },
};

// ========================================
// ADMIN API
// ========================================
export const adminApi = {
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return apiRequest<DashboardStats>("/admin/dashboard");
  },

  getAllUsers: async (filters?: UserFilters): Promise<ApiResponse<User[]>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<User[]>(`/admin/users${query}`);
  },

  updateUserStatus: async (
    userId: number,
    isActive: boolean,
  ): Promise<ApiResponse> => {
    return apiRequest(`/admin/users/${userId}/status`, {
      method: "PUT",
      body: JSON.stringify({ isActive }),
    });
  },

  getAllOrders: async (
    filters?: OrderFilters,
  ): Promise<ApiResponse<Order[]>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<Order[]>(`/admin/orders${query}`);
  },

  getSystemSettings: async (): Promise<ApiResponse<SystemSettings>> => {
    return apiRequest<SystemSettings>("/admin/settings");
  },

  updateSystemSetting: async (
    key: string,
    value: string,
  ): Promise<ApiResponse> => {
    return apiRequest("/admin/settings", {
      method: "PUT",
      body: JSON.stringify({ key, value }),
    });
  },

  getSalesReports: async (
    startDate?: string,
    endDate?: string,
    groupBy?: string,
  ): Promise<ApiResponse<SalesReport>> => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (groupBy) params.append("groupBy", groupBy);
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<SalesReport>(`/admin/reports/sales${query}`);
  },

  getChatAnalytics: async (
    startDate?: string,
    endDate?: string,
  ): Promise<ApiResponse<ChatAnalytics>> => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<ChatAnalytics>(`/admin/chat/analytics${query}`);
  },

  exportData: async (type: string, format: string = "json"): Promise<any> => {
    const params = new URLSearchParams({ type, format });
    const response = await fetch(
      `${API_BASE_URL}/admin/export?${params.toString()}`,
      {
        headers: {
          ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` }),
        },
      },
    );

    if (format === "csv") {
      return response.text();
    }
    return response.json();
  },
};

// ========================================
// UTILITY FUNCTIONS
// ========================================
export const apiUtils = {
  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      if (!apiUtils.isAuthenticated()) return null;
      const response = await authApi.getProfile();
      return response.data || null;
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  },

  formatPrice: (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  },

  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  },

  formatDateTime: (dateString: string): string => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },
};

export default {
  auth: authApi,
  vendor: vendorApi,
  product: productApi,
  category: categoryApi,
  order: orderApi,
  chat: chatApi,
  admin: adminApi,
  utils: apiUtils,
};
