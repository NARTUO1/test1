import {
  BarChart3,
  Download,
  TrendingUp,
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  Calendar,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { AdminLayout } from "../components/AdminLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Progress } from "../components/ui/progress";

export default function AdminReports() {
  const salesData = [
    { period: "Jan 2024", revenue: 180000, orders: 1200, customers: 450 },
    { period: "Feb 2024", revenue: 220000, orders: 1450, customers: 520 },
    { period: "Mar 2024", revenue: 245000, orders: 1650, customers: 680 },
    { period: "Apr 2024", revenue: 198000, orders: 1380, customers: 490 },
    { period: "May 2024", revenue: 267000, orders: 1780, customers: 750 },
    { period: "Jun 2024", revenue: 289000, orders: 1920, customers: 820 },
  ];

  const topCategories = [
    { name: "Electronics", revenue: 890000, percentage: 35, growth: 12.5 },
    { name: "Fashion", revenue: 650000, percentage: 26, growth: 8.2 },
    { name: "Home & Garden", revenue: 420000, percentage: 16, growth: 15.1 },
    { name: "Sports & Fitness", revenue: 380000, percentage: 15, growth: -2.3 },
    { name: "Books & Media", revenue: 200000, percentage: 8, growth: 5.7 },
  ];

  const vendorPerformance = [
    {
      name: "AudioTech Store",
      revenue: 125000,
      commission: 12500,
      orders: 450,
    },
    { name: "FitGear Pro", revenue: 98000, commission: 9800, orders: 380 },
    {
      name: "TechPro Solutions",
      revenue: 87000,
      commission: 8700,
      orders: 320,
    },
    {
      name: "StyleCraft Fashion",
      revenue: 76000,
      commission: 7600,
      orders: 290,
    },
    {
      name: "HomeComfort Living",
      revenue: 65000,
      commission: 6500,
      orders: 240,
    },
  ];

  return (
    <AdminLayout activeTab="reports">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive marketplace analytics and insights
            </p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="last30">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7">Last 7 days</SelectItem>
                <SelectItem value="last30">Last 30 days</SelectItem>
                <SelectItem value="last90">Last 90 days</SelectItem>
                <SelectItem value="last365">Last year</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,540,000</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15.2%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">9,580</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8.7%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                New Customers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,710</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.3%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Order Value
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$265.12</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+6.1%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Sales Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Sales Trend (Last 6 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesData.map((data, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">{data.period}</span>
                      <span className="text-muted-foreground">
                        ${data.revenue.toLocaleString()} • {data.orders} orders
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(data.revenue / 300000) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Top Categories by Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCategories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full bg-primary"
                          style={{
                            backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
                          }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          ${category.revenue.toLocaleString()}
                        </div>
                        <div
                          className={`text-xs ${category.growth >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {category.growth >= 0 ? "+" : ""}
                          {category.growth}%
                        </div>
                      </div>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vendor Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendorPerformance.map((vendor, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{vendor.name}</div>
                    <div className="text-sm text-muted-foreground">
                      #{index + 1}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Revenue:</span>
                      <span className="font-medium">
                        ${vendor.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Commission:</span>
                      <span className="font-medium">
                        ${vendor.commission.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Orders:</span>
                      <span className="font-medium">{vendor.orders}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Report Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Package className="h-5 w-5" />
                <span>Product Report</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Users className="h-5 w-5" />
                <span>Customer Report</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <DollarSign className="h-5 w-5" />
                <span>Financial Report</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Calendar className="h-5 w-5" />
                <span>Custom Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
