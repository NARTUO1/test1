import { ReactNode } from "react";
import {
  Package,
  BarChart3,
  ShoppingCart,
  Star,
  Settings,
  Users,
  LogOut,
  Bell,
  User,
} from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface VendorLayoutProps {
  children: ReactNode;
  activeTab?: string;
}

export function VendorLayout({ children, activeTab }: VendorLayoutProps) {
  const { user, logout } = useAuth();

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      href: "/vendor/dashboard",
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      href: "/vendor/products",
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: Package,
      href: "/vendor/inventory",
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      href: "/vendor/orders",
    },
    { id: "reviews", label: "Reviews", icon: Star, href: "/vendor/reviews" },
    {
      id: "customers",
      label: "Customers",
      icon: Users,
      href: "/vendor/customers",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      href: "/vendor/profile",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/vendor/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold">MarketHub</span>
              <span className="text-sm text-muted-foreground">
                Vendor Portal
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage
                  src={
                    user?.vendorInfo?.businessName
                      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.vendorInfo.businessName)}&background=6366f1&color=fff`
                      : undefined
                  }
                />
                <AvatarFallback>
                  {user?.vendorInfo?.businessName?.charAt(0) ||
                    user?.username?.charAt(0) ||
                    "V"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">
                  {user?.vendorInfo?.businessName ||
                    user?.fullName ||
                    user?.username ||
                    "Vendor"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.vendorInfo?.isVerified
                    ? "Verified Vendor"
                    : "Pending Verification"}
                </p>
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={logout} title="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col bg-muted/50 border-r min-h-[calc(100vh-4rem)]">
          <nav className="flex-1 space-y-1 p-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/">View Marketplace</Link>
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
