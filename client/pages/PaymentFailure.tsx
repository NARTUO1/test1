import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  XCircle,
  AlertTriangle,
  RefreshCw,
  CreditCard,
  HelpCircle,
  Home,
  ShoppingBag,
  Phone,
  Mail,
  Clock,
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

interface FailedPaymentDetails {
  paymentId: string;
  amount: number;
  method: string;
  timestamp: string;
  errorMessage: string;
  errorCode?: string;
  vendorName?: string;
}

export default function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] =
    useState<FailedPaymentDetails | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Get payment details from URL params
    const paymentId = searchParams.get("paymentId");
    const amount = searchParams.get("amount");
    const method = searchParams.get("method");
    const errorMessage =
      searchParams.get("error") || "Payment failed. Please try again.";
    const errorCode = searchParams.get("errorCode");

    if (paymentId && amount) {
      setPaymentDetails({
        paymentId,
        amount: parseFloat(amount),
        method: method || "card",
        timestamp: new Date().toISOString(),
        errorMessage,
        errorCode,
        vendorName: searchParams.get("vendor") || "MarketHub",
      });
    }

    // Track retry attempts
    const attempts = localStorage.getItem(`retry_${paymentId}`);
    if (attempts) {
      setRetryCount(parseInt(attempts));
    }
  }, [searchParams]);

  const handleRetryPayment = () => {
    if (paymentDetails) {
      // Increment retry count
      const newRetryCount = retryCount + 1;
      localStorage.setItem(
        `retry_${paymentDetails.paymentId}`,
        newRetryCount.toString(),
      );
      setRetryCount(newRetryCount);

      // Navigate back to checkout with payment details
      const params = new URLSearchParams({
        retry: "true",
        amount: paymentDetails.amount.toString(),
        vendor: paymentDetails.vendorName || "",
        prevPaymentId: paymentDetails.paymentId,
      });

      navigate(`/checkout?${params.toString()}`);
    }
  };

  const getErrorSolution = (errorMessage: string) => {
    if (errorMessage.includes("declined")) {
      return {
        title: "Payment Declined",
        solution:
          "Your bank has declined this transaction. Please contact your bank or try a different payment method.",
        icon: <CreditCard className="h-5 w-5 text-red-600" />,
      };
    } else if (errorMessage.includes("insufficient")) {
      return {
        title: "Insufficient Balance",
        solution:
          "Please ensure you have sufficient balance in your account or try a different payment method.",
        icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
      };
    } else if (errorMessage.includes("timeout")) {
      return {
        title: "Transaction Timeout",
        solution:
          "The transaction took too long to process. Please try again with a stable internet connection.",
        icon: <Clock className="h-5 w-5 text-blue-600" />,
      };
    } else {
      return {
        title: "Payment Error",
        solution:
          "An unexpected error occurred. Please check your payment details and try again.",
        icon: <XCircle className="h-5 w-5 text-red-600" />,
      };
    }
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

  const errorInfo = getErrorSolution(paymentDetails.errorMessage);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Failure Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            Payment Failed
          </h1>
          <p className="text-muted-foreground">
            We couldn't process your payment. Don't worry, no money was charged.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Error Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Error Information */}
            <Card className="animate-slide-in-left border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  {errorInfo.icon}
                  {errorInfo.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium mb-2">
                    Error Details:
                  </p>
                  <p className="text-red-700 text-sm">
                    {paymentDetails.errorMessage}
                  </p>
                  {paymentDetails.errorCode && (
                    <p className="text-red-600 text-xs mt-2 font-mono">
                      Error Code: {paymentDetails.errorCode}
                    </p>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-medium mb-2">
                    Suggested Solution:
                  </p>
                  <p className="text-blue-700 text-sm">{errorInfo.solution}</p>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Details */}
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
                    <span className="text-muted-foreground">
                      Transaction ID
                    </span>
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
                    <span className="text-muted-foreground">Failed At</span>
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

                {retryCount > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-yellow-800 text-sm">
                      <AlertTriangle className="h-4 w-4 inline mr-1" />
                      You have attempted this payment {retryCount} time(s)
                      before.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleRetryPayment}
                className="bg-primary hover:bg-primary/90"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Payment
              </Button>
              <Button variant="outline" asChild>
                <Link to="/checkout">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Try Different Method
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/cart">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Back to Cart
                </Link>
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Help & Support */}
            <Card className="animate-slide-in-right">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-3">
                  <div>
                    <p className="font-medium">Common Solutions:</p>
                    <ul className="text-muted-foreground space-y-1 mt-2">
                      <li>• Check your internet connection</li>
                      <li>• Verify card details are correct</li>
                      <li>• Ensure sufficient balance</li>
                      <li>• Try a different payment method</li>
                      <li>• Contact your bank if needed</li>
                    </ul>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="font-medium text-sm mb-3">Contact Support</p>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call: 1800-123-4567
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email: support@markethub.com
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alternative Actions */}
            <Card className="animate-slide-in-right">
              <CardHeader>
                <CardTitle>Other Options</CardTitle>
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
                  <Link to="/wishlist">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Save for Later
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Security Assurance */}
            <Card className="animate-slide-in-right bg-green-50 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2 text-green-800">
                  Your Money is Safe
                </h3>
                <p className="text-sm text-green-700">
                  No money was charged from your account. Your payment
                  information remains secure.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
