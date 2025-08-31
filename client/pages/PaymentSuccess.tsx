import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  CheckCircle,
  Package,
  CreditCard,
  Download,
  Share2,
  Home,
  ShoppingBag,
  Calendar,
  Truck,
  Star,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { formatPrice } from "../lib/currency";

interface PaymentDetails {
  paymentId: string;
  amount: number;
  method: string;
  timestamp: string;
  vendorName?: string;
  vendorId?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
}

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null,
  );
  const [estimatedDelivery, setEstimatedDelivery] = useState<string>("");

  useEffect(() => {
    // Get payment details from URL params or localStorage
    const paymentId = searchParams.get("paymentId");
    const amount = searchParams.get("amount");
    const method = searchParams.get("method");

    if (paymentId && amount) {
      // In a real app, you'd fetch this from your backend
      const savedPayment = localStorage.getItem(`payment_${paymentId}`);

      if (savedPayment) {
        setPaymentDetails(JSON.parse(savedPayment));
      } else {
        // Fallback details
        setPaymentDetails({
          paymentId,
          amount: parseFloat(amount),
          method: method || "card",
          timestamp: new Date().toISOString(),
          vendorName: searchParams.get("vendor") || "MarketHub",
          items: [
            {
              id: "1",
              name: "Order Items",
              price: parseFloat(amount),
              quantity: 1,
            },
          ],
        });
      }
    }

    // Calculate estimated delivery (3-7 business days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(
      deliveryDate.getDate() + Math.floor(Math.random() * 5) + 3,
    );
    setEstimatedDelivery(
      deliveryDate.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
  }, [searchParams]);

  const handleShare = () => {
    if (navigator.share && paymentDetails) {
      navigator.share({
        title: "Payment Successful",
        text: `Payment of ${formatPrice(paymentDetails.amount)} completed successfully!`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const downloadReceipt = () => {
    // In a real app, you'd generate a PDF receipt
    const receiptData = {
      paymentId: paymentDetails?.paymentId,
      amount: paymentDetails?.amount,
      timestamp: paymentDetails?.timestamp,
      items: paymentDetails?.items,
    };

    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `receipt_${paymentDetails?.paymentId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!paymentDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Payment Successful!
          </h1>
          <p className="text-muted-foreground">
            Your order has been confirmed and will be processed shortly
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Payment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Info */}
            <Card className="animate-slide-in-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Transaction Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Payment ID</span>
                    <p className="font-mono font-medium">
                      {paymentDetails.paymentId}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Amount</span>
                    <p className="font-semibold text-lg">
                      {formatPrice(paymentDetails.amount)}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Payment Method
                    </span>
                    <p className="capitalize">{paymentDetails.method}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date & Time</span>
                    <p>
                      {new Date(paymentDetails.timestamp).toLocaleString(
                        "en-IN",
                      )}
                    </p>
                  </div>
                </div>

                {paymentDetails.vendorName && (
                  <div>
                    <span className="text-muted-foreground text-sm">
                      Vendor
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">
                        {paymentDetails.vendorName}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="animate-slide-in-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentDetails.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={downloadReceipt} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
              <Button onClick={handleShare} variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button asChild>
                <Link to="/order-history">
                  <Package className="h-4 w-4 mr-2" />
                  View Orders
                </Link>
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Steps */}
            <Card className="animate-slide-in-right">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  What's Next?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-white font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Order Confirmation</p>
                    <p className="text-sm text-muted-foreground">
                      You'll receive an email confirmation shortly
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-white font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Processing</p>
                    <p className="text-sm text-muted-foreground">
                      Your order will be prepared for shipping
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs text-muted-foreground font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Shipping</p>
                    <p className="text-sm text-muted-foreground">
                      Estimated delivery: {estimatedDelivery}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="animate-slide-in-right">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/products">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Browse Products
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/order-tracking">
                    <Package className="h-4 w-4 mr-2" />
                    Track Order
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Review Reminder */}
            <Card className="animate-slide-in-right bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Rate Your Experience</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Help other customers by sharing your review
                </p>
                <Button size="sm" variant="outline">
                  Write Review
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
