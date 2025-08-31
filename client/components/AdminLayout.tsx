import { ReactNode } from "react";
import {
  BarChart3,
  Users,
  ShoppingBag,
  Settings,
  Shield,
  AlertTriangle,
  CreditCard,
  Tag,
  LogOut,
  Bell,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface AdminLayoutProps {
  children: ReactNode;
  activeTab?: string;
}

export function AdminLayout({ children, activeTab }: AdminLayoutProps) {
  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      href: "/admin/dashboard",
    },
    { id: "users", label: "Users", icon: Users, href: "/admin/users" },
    {
      id: "vendors",
      label: "Vendors",
      icon: ShoppingBag,
      href: "/admin/vendors",
    },
    { id: "orders", label: "Orders", icon: CreditCard, href: "/admin/orders" },
    { id: "products", label: "Products", icon: Tag, href: "/admin/products" },
    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
      href: "/admin/reports",
    },
    {
      id: "disputes",
      label: "Disputes",
      icon: AlertTriangle,
      href: "/admin/disputes",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold">MarketHub</span>
              <Badge className="bg-red-100 text-red-800 text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">
                  Super Administrator
                </p>
              </div>
            </div>

            <Button variant="ghost" size="icon" asChild>
              <a href="/">
                <LogOut className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col bg-muted/50 border-r min-h-[calc(100vh-4rem)] animate-slide-in-left">
          <nav className="flex-1 space-y-1 p-4 stagger-animation">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover-scale ${
                    isActive
                      ? "bg-primary text-primary-foreground hover-glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <Button variant="outline" className="w-full" asChild>
              <a href="/">View Marketplace</a>
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 animate-slide-in-right">{children}</main>
      </div>
    </div>
  );
}
