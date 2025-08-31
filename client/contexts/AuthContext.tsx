import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, AuthResponse, RegisterRequest, LoginRequest } from "@shared/api";
import { authApi, apiUtils } from "@/lib/api-client";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      if (apiUtils.isAuthenticated()) {
        const currentUser = await apiUtils.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
      // Clear invalid token
      authApi.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authApi.login(credentials);

      if (response.success && response.data) {
        // Store token
        authApi.setToken(response.data.token);

        // Set user data
        setUser({
          id: response.data.userId,
          username: response.data.username,
          email: response.data.email,
          fullName: response.data.fullName || "",
          role: response.data.role as "customer" | "vendor" | "admin",
          isActive: true,
          createdAt: new Date().toISOString(),
          vendorInfo: response.data.vendorInfo,
        });
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authApi.register(userData);

      if (response.success && response.data) {
        // Store token
        authApi.setToken(response.data.token);

        // Set user data
        setUser({
          id: response.data.userId,
          username: response.data.username,
          email: response.data.email,
          fullName: response.data.fullName || "",
          role: response.data.role as "customer" | "vendor" | "admin",
          isActive: true,
          createdAt: new Date().toISOString(),
        });
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    authApi.logout();
    setUser(null);
  };

  const updateUser = (userData: Partial<User>): void => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      if (apiUtils.isAuthenticated()) {
        const currentUser = await apiUtils.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Higher-order component for protected routes
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "customer" | "vendor" | "admin";
  fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallback,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground">
              Please log in to access this page.
            </p>
          </div>
        </div>
      )
    );
  }

  if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
};

// Hook for role-based access control
export const useRoleAccess = () => {
  const { user } = useAuth();

  return {
    isAdmin: user?.role === "admin",
    isVendor: user?.role === "vendor" || user?.role === "admin",
    isCustomer: user?.role === "customer",
    hasRole: (role: "customer" | "vendor" | "admin") =>
      user?.role === role || user?.role === "admin",
    canAccess: (requiredRoles: Array<"customer" | "vendor" | "admin">) =>
      user ? requiredRoles.includes(user.role) || user.role === "admin" : false,
  };
};
