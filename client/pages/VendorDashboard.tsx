import {
  TrendingUp,
  Package,
  ShoppingCart,
  Star,
  DollarSign,
  Users,
  Eye,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { VendorLayout } from "../components/VendorLayout";

export default function VendorDashboard() {
  // Mock data - in real app this would come from API
  const stats = {
    totalRevenue: 45230,
    totalOrders: 1247,
    totalProducts: 28,
    averageRating: 4.8,
    newOrders: 23,
    pendingOrders: 8,
    lowStockProducts: 3,
    totalViews: 15420,
  };

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "John Smith",
      product: "Premium Wireless Headphones",
      amount: 299.99,
      status: "pending",
      date: "2 hours ago",
    },
    {
      id: "ORD-002",
      customer: "Sarah Johnson",
      product: "Smart Fitness Watch",
      amount: 199.99,
      status: "shipped",
      date: "5 hours ago",
    },
    {
      id: "ORD-003",
      customer: "Mike Wilson",
      product: "Bluetooth Speaker",
      amount: 89.99,
      status: "delivered",
      date: "1 day ago",
    },
  ];

  const topProducts = [
    {
      id: "1",
      name: "Premium Wireless Headphones",
      sales: 156,
      revenue: 46740,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=60&h=60&fit=crop",
    },
    {
      id: "2",
      name: "Smart Fitness Watch",
      sales: 89,
      revenue: 17801,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&h=60&fit=crop",
    },
    {
      id: "3",
      name: "Bluetooth Speaker",
      sales: 67,
      revenue: 6030,
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=60&h=60&fit=crop",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <VendorLayout activeTab="dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your store.
            </p>
          </div>
          <Button asChild>
            <a href="/vendor/products/new">Add New Product</a>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+20.1%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{stats.newOrders}</span> new
                orders today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-orange-600">
                  {stats.lowStockProducts}
                </span>{" "}
                low in stock
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <p className="text-xs text-muted-foreground">
                Based on 324 reviews
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-blue-900 dark:text-blue-100">
                    Pending Orders
                  </h3>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {stats.pendingOrders}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-600" />
              </div>
              <Button size="sm" className="w-full mt-3" asChild>
                <a href="/vendor/orders?status=pending">View Orders</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-orange-900 dark:text-orange-100">
                    Low Stock
                  </h3>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    {stats.lowStockProducts}
                  </p>
                </div>
                <Package className="h-8 w-8 text-orange-600" />
              </div>
              <Button size="sm" className="w-full mt-3" asChild>
                <a href="/vendor/products?filter=low-stock">Restock Items</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-green-900 dark:text-green-100">
                    Store Views
                  </h3>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {stats.totalViews.toLocaleString()}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-green-600" />
              </div>
              <Button
                size="sm"
                className="w-full mt-3"
                variant="outline"
                asChild
              >
                <a href="/vendor/analytics">View Analytics</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <a href="/vendor/orders">View All</a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{order.id}</span>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.customer}
                      </p>
                      <p className="text-sm">{order.product}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.amount}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Top Selling Products</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <a href="/vendor/analytics">View Analytics</a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {index + 1}
                    </div>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{product.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {product.sales} sales
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${product.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </VendorLayout>
  );
}
