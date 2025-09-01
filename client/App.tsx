import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MarketplaceHeader } from "./components/MarketplaceHeader";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { OrderProvider } from "./contexts/OrderContext";
import { AuthProvider } from "./contexts/AuthContext";
import Chatbot from "./components/Chatbot";
import ConditionalFooter from "./components/ConditionalFooter";
import VendorProductForm from "./pages/VendorProductForm";
import VendorProfile from "./pages/VendorProfile";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VendorDashboard from "./pages/VendorDashboard";
import VendorProducts from "./pages/VendorProducts";
import VendorInventory from "./pages/VendorInventory";
import OrderTracking from "./pages/OrderTracking";
import Wishlist from "./pages/Wishlist";
import OrderHistory from "./pages/OrderHistory";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminVendors from "./pages/AdminVendors";
import Vendors from "./pages/Vendors";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import AdminReports from "./pages/AdminReports";
import AdminDisputes from "./pages/AdminDisputes";
import AdminSettings from "./pages/AdminSettings";
import BecomeSeller from "./components/BecomeSeller";
import SellerLogin from "./components/SellerLogin";
import Categories from "./pages/Categories";
import NotFound from "./pages/NotFound";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <OrderProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="min-h-screen bg-background">
                  <MarketplaceHeader />
                  <main className="animate-fade-in">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/order-success" element={<OrderSuccess />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                      />
                      <Route
                        path="/vendor/dashboard"
                        element={<VendorDashboard />}
                      />
                      <Route
                        path="/vendor/products"
                        element={<VendorProducts />}
                      />
                      <Route
                        path="/vendor/inventory"
                        element={<VendorInventory />}
                      />
                      <Route path="/orders" element={<OrderTracking />} />
                      <Route path="/track-order" element={<OrderTracking />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/order-history" element={<OrderHistory />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route
                        path="/admin/dashboard"
                        element={<AdminDashboard />}
                      />
                      <Route path="/admin/users" element={<AdminUsers />} />
                      <Route path="/admin/vendors" element={<AdminVendors />} />
                      <Route path="/admin/orders" element={<AdminOrders />} />
                      <Route
                        path="/admin/products"
                        element={<AdminProducts />}
                      />
                      <Route path="/admin/reports" element={<AdminReports />} />
                      <Route
                        path="/admin/disputes"
                        element={<AdminDisputes />}
                      />
                      <Route
                        path="/admin/settings"
                        element={<AdminSettings />}
                      />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/vendors" element={<Vendors />} />
                      <Route
                        path="/vendor/products/new"
                        element={<VendorProductForm />}
                      />
                      <Route
                        path="/vendor/products/:productId/edit"
                        element={<VendorProductForm />}
                      />
                      <Route
                        path="/vendor/profile"
                        element={<VendorProfile />}
                      />
                      <Route
                        path="/deals"
                        element={
                          <div className="container mx-auto px-4 py-16 text-center">
                            <h1 className="text-2xl font-bold mb-4">Deals</h1>
                            <p className="text-muted-foreground">
                              Amazing deals and discounts. This page is coming
                              soon!
                            </p>
                          </div>
                        }
                      />
                      <Route path="/become-seller" element={<BecomeSeller />} />
                      <Route path="/seller-login" element={<SellerLogin />} />
                      <Route
                        path="/payment-success"
                        element={<PaymentSuccess />}
                      />
                      <Route
                        path="/payment-failure"
                        element={<PaymentFailure />}
                      />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <ConditionalFooter />
                  <Chatbot />
                </div>
              </BrowserRouter>
            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root")!;
if (!container._reactRoot) {
  container._reactRoot = createRoot(container);
}
container._reactRoot.render(<App />);
