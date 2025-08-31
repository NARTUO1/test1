import { useState } from "react";
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
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

export default function OrderTracking() {
  const [orderNumber, setOrderNumber] = useState("");
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock order data
  const mockOrder = {
    id: "ORD-123456",
    status: "shipped",
    estimatedDelivery: "March 15-17, 2024",
    trackingNumber: "1Z999AA1234567890",
    carrier: "UPS",
    orderDate: "March 10, 2024",
    shippedDate: "March 12, 2024",
    customer: {
      name: "John Smith",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
    },
    shippingAddress: {
      street: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "United States",
    },
    items: [
      {
        id: "1",
        name: "Premium Wireless Headphones",
        price: 299.99,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
        vendor: "AudioTech",
      },
    ],
    timeline: [
      {
        status: "Order Placed",
        date: "March 10, 2024 2:30 PM",
        description: "Your order has been received and is being processed",
        completed: true,
      },
      {
        status: "Payment Confirmed",
        date: "March 10, 2024 2:35 PM",
        description: "Payment has been successfully processed",
        completed: true,
      },
      {
        status: "Processing",
        date: "March 11, 2024 9:00 AM",
        description: "Your order is being prepared for shipment",
        completed: true,
      },
      {
        status: "Shipped",
        date: "March 12, 2024 3:45 PM",
        description: "Your order has been shipped and is on its way",
        completed: true,
        current: true,
      },
      {
        status: "Out for Delivery",
        date: "Expected March 15, 2024",
        description: "Your order is out for delivery",
        completed: false,
      },
      {
        status: "Delivered",
        date: "Expected March 15, 2024",
        description: "Your order has been delivered",
        completed: false,
      },
    ],
    total: 329.97,
  };

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (
      orderNumber.toLowerCase().includes("ord-123456") ||
      orderNumber === "123456"
    ) {
      setOrderData(mockOrder);
    } else {
      setOrderData(null);
    }

    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Track Your Order</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter your order number to get real-time updates on your package
            delivery status
          </p>
        </div>

        {/* Search Form */}
        <Card className="max-w-md mx-auto mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleTrackOrder} className="space-y-4">
              <div>
                <label
                  htmlFor="orderNumber"
                  className="text-sm font-medium mb-2 block"
                >
                  Order Number
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="orderNumber"
                    type="text"
                    placeholder="ORD-123456 or 123456"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Find your order number in your confirmation email
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Tracking..." : "Track Order"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an order number?{" "}
                <a href="/login" className="text-primary hover:underline">
                  Sign in to view your orders
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Order Results */}
        {orderData && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order {orderData.id}
                  </CardTitle>
                  <Badge className={getStatusColor(orderData.status)}>
                    {orderData.status.charAt(0).toUpperCase() +
                      orderData.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">{orderData.orderDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Estimated Delivery
                    </p>
                    <p className="font-medium">{orderData.estimatedDelivery}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tracking Number
                    </p>
                    <p className="font-medium">{orderData.trackingNumber}</p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h4 className="font-medium mb-3">Items in this order</h4>
                  <div className="space-y-3">
                    {orderData.items.map((item: any) => (
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
                          <h5 className="font-medium">{item.name}</h5>
                          <p className="text-sm text-muted-foreground">
                            by {item.vendor}
                          </p>
                          <p className="text-sm">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Tracking Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.timeline.map((event: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            event.completed ? "bg-green-100" : "bg-gray-100"
                          } ${event.current ? "ring-2 ring-blue-500" : ""}`}
                        >
                          {event.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        {index < orderData.timeline.length - 1 && (
                          <div
                            className={`w-0.5 h-8 ${
                              event.completed ? "bg-green-200" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h4
                            className={`font-medium ${
                              event.current ? "text-blue-600" : ""
                            }`}
                          >
                            {event.status}
                          </h4>
                          {event.current && (
                            <Badge
                              variant="outline"
                              className="text-blue-600 border-blue-600"
                            >
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {event.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {event.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Details */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{orderData.customer.name}</p>
                    <p>{orderData.shippingAddress.street}</p>
                    <p>
                      {orderData.shippingAddress.city},{" "}
                      {orderData.shippingAddress.state}{" "}
                      {orderData.shippingAddress.zipCode}
                    </p>
                    <p>{orderData.shippingAddress.country}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Questions about your order? We're here to help.
                  </p>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Support: 1-800-MARKET
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Live Chat
                    </Button>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-xs text-muted-foreground">
                      Carrier: {orderData.carrier} | Tracking:{" "}
                      {orderData.trackingNumber}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* No Results */}
        {orderNumber && !orderData && !isLoading && (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">Order Not Found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We couldn't find an order with that number. Please check and try
                again.
              </p>
              <Button variant="outline" onClick={() => setOrderNumber("")}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <h3 className="text-lg font-medium mb-4">Need Additional Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Phone className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h4 className="font-medium mb-2">Call Us</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Speak with our support team
                </p>
                <p className="text-sm font-medium">1-800-MARKET-HUB</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h4 className="font-medium mb-2">Live Chat</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Get instant help online
                </p>
                <Button size="sm" variant="outline">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h4 className="font-medium mb-2">Support Hours</h4>
                <p className="text-sm text-muted-foreground">
                  Monday - Friday: 8AM - 8PM EST
                  <br />
                  Saturday - Sunday: 9AM - 6PM EST
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
