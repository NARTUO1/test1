import { useState } from "react";
import {
  Package,
  Star,
  RotateCcw,
  MessageCircle,
  Download,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { formatPrice } from "../lib/currency";
import { Link } from "react-router-dom";
import { useOrders } from "../contexts/OrderContext";

export default function OrderHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const { state } = useOrders();

  // Convert orders from context to component format, with fallback to mock data
  const contextOrders = state.orders.map((order) => ({
    id: order.id,
    date: new Date(order.createdAt).toISOString().split("T")[0],
    status: order.status,
    total: order.total,
    items: order.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image:
        item.image ||
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
      vendor: item.vendor,
    })),
    tracking: order.paymentId ? `TRK_${order.paymentId.slice(-10)}` : null,
    canReview: order.status === "delivered",
    canReturn: ["delivered", "shipped"].includes(order.status),
    paymentMethod: order.paymentMethod || "Card",
  }));

  // Fallback mock data if no real orders exist
  const mockOrders = [
    {
      id: "ORD-SAMPLE-001",
      date: "2024-03-10",
      status: "delivered",
      total: 32500,
      items: [
        {
          id: "1",
          name: "Premium Wireless Headphones",
          price: 24999,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
          vendor: "AudioTech",
        },
      ],
      tracking: "TRK_SAMPLE001",
      canReview: true,
      canReturn: true,
      paymentMethod: "Card",
    },
  ];

  const orders = contextOrders.length > 0 ? contextOrders : mockOrders;

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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "shipped":
        return "Shipped";
      case "processing":
        return "Processing";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReorder = (order: any) => {
    // Add all items from the order to cart
    console.log("Reordering:", order);
    // Implementation would add items to cart context
  };

  const handleWriteReview = (item: any) => {
    // Navigate to review writing page
    console.log("Writing review for:", item);
  };

  const handleReturnRequest = (order: any) => {
    // Navigate to return request page
    console.log("Requesting return for:", order);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Order History</h1>
          <p className="text-muted-foreground">
            Track and manage your past orders
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by order ID or product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Order List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-lg">{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          by {item.vendor}
                        </p>
                        <p className="text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatPrice(item.price)}
                        </p>
                        {order.canReview && order.status === "delivered" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={() => handleWriteReview(item)}
                          >
                            <Star className="h-3 w-3 mr-1" />
                            Review
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {order.tracking && (
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/track-order?id=${order.id}`}>
                        Track Package
                      </Link>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReorder(order)}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reorder
                  </Button>

                  <Button variant="outline" size="sm">
                    <Download className="h-3 w-3 mr-1" />
                    Invoice
                  </Button>

                  {order.canReturn &&
                    (order.status === "delivered" ||
                      order.status === "shipped") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReturnRequest(order)}
                      >
                        Return Items
                      </Button>
                    )}

                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Contact Seller
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "You haven't placed any orders yet"}
              </p>
              <Button asChild>
                <Link to="/products">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Order Statistics */}
        {orders.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{orders.length}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {formatPrice(
                      orders.reduce((sum, order) => sum + order.total, 0),
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {orders.filter((o) => o.status === "delivered").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {orders.reduce((sum, order) => sum + order.items.length, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Items Purchased
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
