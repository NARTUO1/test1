import {
  CheckCircle,
  Package,
  Truck,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function OrderSuccess() {
  // Mock order data - in real app this would come from the order ID
  const orderDetails = {
    id: "ORD-123456",
    date: new Date().toLocaleDateString(),
    total: 389.97,
    estimatedDelivery: "March 15-17, 2024",
    shippingAddress: "123 Main St, San Francisco, CA 94105",
    paymentMethod: "**** **** **** 1234",
    items: [
      {
        id: "1",
        name: "Premium Wireless Headphones",
        price: 299.99,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
      },
      {
        id: "2",
        name: "Smart Fitness Watch",
        price: 89.98,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-muted-foreground text-lg">
              Thank you for your purchase. Your order has been confirmed and
              will be shipped soon.
            </p>
          </div>

          {/* Order Details Card */}
          <Card className="text-left mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="font-semibold">{orderDetails.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-semibold">{orderDetails.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-semibold">
                    ${orderDetails.total.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Estimated Delivery
                  </p>
                  <p className="font-semibold">
                    {orderDetails.estimatedDelivery}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-medium mb-4">Items Ordered</h4>
                <div className="space-y-3">
                  {orderDetails.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium">{item.name}</h5>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
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

              {/* Shipping & Payment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Shipping Address
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {orderDetails.shippingAddress}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment Method
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Credit Card ending in {orderDetails.paymentMethod}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-medium mb-2">Order Processing</h4>
                  <p className="text-sm text-muted-foreground">
                    We're preparing your items for shipment
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Truck className="h-6 w-6 text-orange-600" />
                  </div>
                  <h4 className="font-medium mb-2">Shipped</h4>
                  <p className="text-sm text-muted-foreground">
                    You'll receive tracking information via email
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-medium mb-2">Delivered</h4>
                  <p className="text-sm text-muted-foreground">
                    Your order arrives at your doorstep
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="/orders">
                View Order Status
                <ArrowRight className="h-4 w-4 ml-2" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/products">Continue Shopping</a>
            </Button>
          </div>

          {/* Support */}
          <div className="mt-12 p-6 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our customer support team is here to assist you with any questions
              about your order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
              <Button variant="outline" size="sm">
                Track Your Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
