import {
  TrendingUp,
  Users,
  ShoppingBag,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { AdminLayout } from "../components/AdminLayout";
import { Progress } from "../components/ui/progress";

export default function AdminDashboard() {
  // Mock admin data
  const stats = {
    totalRevenue: 2450000,
    totalUsers: 15420,
    totalVendors: 1248,
    totalOrders: 45230,
    pendingVendors: 23,
    activeDisputes: 8,
    revenueGrowth: 15.2,
    userGrowth: 8.5,
  };

  const recentActivity = [
    {
      type: "vendor_registration",
      message: "New vendor registration from TechGear Solutions",
      time: "2 minutes ago",
      status: "pending",
    },
    {
      type: "dispute",
      message: "Dispute raised for Order #ORD-123456",
      time: "15 minutes ago",
      status: "urgent",
    },
    {
      type: "order",
      message: "Large order placed: $2,450 from Premium Electronics",
      time: "1 hour ago",
      status: "info",
    },
    {
      type: "vendor_approved",
      message: "Vendor 'AudioTech Store' has been approved",
      time: "2 hours ago",
      status: "success",
    },
  ];

  const topVendors = [
    { name: "AudioTech", revenue: 125000, orders: 450, growth: 12.5 },
    { name: "FitGear", revenue: 98000, orders: 380, growth: 8.2 },
    { name: "TechPro", revenue: 87000, orders: 320, growth: 15.8 },
    { name: "StyleCraft", revenue: 76000, orders: 290, growth: -2.1 },
    { name: "HomeComfort", revenue: 65000, orders: 240, growth: 6.7 },
  ];

  const pendingTasks = [
    { task: "Review vendor applications", count: 23, priority: "high" },
    { task: "Resolve customer disputes", count: 8, priority: "urgent" },
    { task: "Approve product listings", count: 45, priority: "medium" },
    { task: "Process vendor payouts", count: 156, priority: "high" },
    { task: "Review reported content", count: 12, priority: "medium" },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "vendor_registration":
        return <Users className="h-4 w-4" />;
      case "dispute":
        return <AlertTriangle className="h-4 w-4" />;
      case "order":
        return <ShoppingBag className="h-4 w-4" />;
      case "vendor_approved":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case "urgent":
        return "text-red-600 bg-red-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "success":
        return "text-green-600 bg-green-50";
      default:
        return "text-blue-600 bg-blue-50";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <AdminLayout activeTab="dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your marketplace platform
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Export Report</Button>
            <Button>Generate Analytics</Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-animation">
          <Card className="hover-lift hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground animate-pulse-soft" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{stats.revenueGrowth}%</span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground animate-pulse-soft" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalUsers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{stats.userGrowth}%</span>{" "}
                growth this month
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Vendors
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground animate-pulse-soft" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVendors}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-orange-600">{stats.pendingVendors}</span>{" "}
                pending approval
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground animate-pulse-soft" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalOrders.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">{stats.activeDisputes}</span>{" "}
                active disputes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <span className="font-medium">{task.task}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {task.count} items
                    </span>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-full ${getActivityColor(activity.status)}`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Vendors */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Vendors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topVendors.map((vendor, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{vendor.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {vendor.orders} orders
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${vendor.revenue.toLocaleString()}
                      </p>
                      <p
                        className={`text-xs ${vendor.growth >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {vendor.growth >= 0 ? "+" : ""}
                        {vendor.growth}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Health */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Health Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    Vendor Approval Rate
                  </span>
                  <span className="text-sm text-muted-foreground">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    Customer Satisfaction
                  </span>
                  <span className="text-sm text-muted-foreground">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Platform Uptime</span>
                  <span className="text-sm text-muted-foreground">99.9%</span>
                </div>
                <Progress value={99.9} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
