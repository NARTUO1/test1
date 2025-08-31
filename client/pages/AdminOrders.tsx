import {
  Search,
  Filter,
  MoreHorizontal,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { AdminLayout } from "../components/AdminLayout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export default function AdminOrders() {
  const orders = [
    {
      id: "ORD-001234",
      customer: "John Smith",
      vendor: "AudioTech Store",
      products: 2,
      amount: 459.99,
      status: "delivered",
      orderDate: "2024-03-15",
      deliveryDate: "2024-03-18",
      paymentMethod: "Credit Card",
      shippingAddress: "123 Main St, New York, NY",
    },
    {
      id: "ORD-001235",
      customer: "Sarah Johnson",
      vendor: "FitGear Pro",
      products: 1,
      amount: 129.99,
      status: "shipped",
      orderDate: "2024-03-20",
      deliveryDate: "2024-03-23",
      paymentMethod: "PayPal",
      shippingAddress: "456 Oak Ave, Los Angeles, CA",
    },
    {
      id: "ORD-001236",
      customer: "Mike Chen",
      vendor: "TechPro Solutions",
      products: 3,
      amount: 789.97,
      status: "processing",
      orderDate: "2024-03-22",
      deliveryDate: "2024-03-25",
      paymentMethod: "Credit Card",
      shippingAddress: "789 Pine St, Chicago, IL",
    },
    {
      id: "ORD-001237",
      customer: "Emily Davis",
      vendor: "StyleCraft Fashion",
      products: 1,
      amount: 89.99,
      status: "cancelled",
      orderDate: "2024-03-18",
      deliveryDate: null,
      paymentMethod: "Debit Card",
      shippingAddress: "321 Elm St, Houston, TX",
    },
    {
      id: "ORD-001238",
      customer: "Alex Rodriguez",
      vendor: "HomeComfort Living",
      products: 2,
      amount: 234.98,
      status: "dispute",
      orderDate: "2024-03-10",
      deliveryDate: "2024-03-14",
      paymentMethod: "Credit Card",
      shippingAddress: "654 Maple Dr, Phoenix, AZ",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "dispute":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-3 w-3" />;
      case "shipped":
        return <Truck className="h-3 w-3" />;
      case "processing":
        return <Clock className="h-3 w-3" />;
      case "cancelled":
        return <XCircle className="h-3 w-3" />;
      case "dispute":
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <Package className="h-3 w-3" />;
    }
  };

  return (
    <AdminLayout activeTab="orders">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Order Management</h1>
            <p className="text-muted-foreground">
              Monitor and manage all marketplace orders
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Export Orders</Button>
            <Button>Generate Report</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,230</div>
              <p className="text-xs text-muted-foreground">
                +5.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shipped</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,567</div>
              <p className="text-xs text-muted-foreground">In transit</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">38,892</div>
              <p className="text-xs text-muted-foreground">86% delivery rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disputes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                Requires resolution
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Search orders..." className="pl-10" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="dispute">Dispute</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{order.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{order.customer}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{order.vendor}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.products} items</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">${order.amount}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{order.orderDate}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.deliveryDate || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>View Customer</DropdownMenuItem>
                          <DropdownMenuItem>View Vendor</DropdownMenuItem>
                          <DropdownMenuItem>Track Shipment</DropdownMenuItem>
                          {order.status === "processing" && (
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                          )}
                          {order.status === "dispute" && (
                            <DropdownMenuItem className="text-orange-600">
                              Resolve Dispute
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>Send Notification</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
