import { useState } from "react";
import {
  CreditCard,
  Lock,
  CheckCircle,
  XCircle,
  Loader2,
  Shield,
  Smartphone,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { formatPrice } from "../lib/currency";

interface PaymentResult {
  success: boolean;
  paymentId: string;
  message: string;
}

interface FakePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayment: (result: PaymentResult) => void;
  totalAmount: number;
  vendorId?: string;
  vendorName?: string;
  orderItems: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

export function FakePaymentModal({
  isOpen,
  onClose,
  onPayment,
  totalAmount,
  vendorId,
  vendorName,
  orderItems,
}: FakePaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Card details state
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  // UPI state
  const [upiId, setUpiId] = useState("");

  const handleCardNumberChange = (value: string) => {
    // Format card number with spaces
    const formatted = value
      .replace(/\s/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
    if (formatted.length <= 19) {
      setCardDetails({ ...cardDetails, number: formatted });
    }
  };

  const handleExpiryChange = (value: string) => {
    // Format expiry as MM/YY
    const formatted = value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .slice(0, 5);
    setCardDetails({ ...cardDetails, expiry: formatted });
  };

  const handleCvvChange = (value: string) => {
    // Only allow 3-4 digits
    const formatted = value.replace(/\D/g, "").slice(0, 4);
    setCardDetails({ ...cardDetails, cvv: formatted });
  };

  const generatePaymentId = () => {
    const prefix = paymentMethod === "card" ? "CARD" : "UPI";
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}_${timestamp}_${random}`;
  };

  const simulatePayment = () => {
    setLoading(true);
    setProcessing(true);

    // Simulate network delay and processing
    setTimeout(() => {
      // 85% success rate for realistic simulation
      const isSuccess = Math.random() > 0.15;
      const paymentId = generatePaymentId();

      let message = "";
      if (isSuccess) {
        message = `Payment successful! Your order has been confirmed.`;
      } else {
        const failures = [
          "Payment declined by bank. Please try again.",
          "Insufficient balance. Please check your account.",
          "Transaction timeout. Please retry.",
          "Card verification failed. Please check details.",
        ];
        message = failures[Math.floor(Math.random() * failures.length)];
      }

      setLoading(false);
      setProcessing(false);

      onPayment({
        success: isSuccess,
        paymentId,
        message,
      });
    }, 3000); // 3 second processing simulation
  };

  const isCardValid = () => {
    return (
      cardDetails.number.replace(/\s/g, "").length >= 16 &&
      cardDetails.expiry.length === 5 &&
      cardDetails.cvv.length >= 3 &&
      cardDetails.name.length >= 2
    );
  };

  const isUpiValid = () => {
    return upiId.includes("@") && upiId.length >= 6;
  };

  const canProceed = paymentMethod === "card" ? isCardValid() : isUpiValid();

  const resetForm = () => {
    setCardDetails({ number: "", expiry: "", cvv: "", name: "" });
    setUpiId("");
    setPaymentMethod("card");
    setLoading(false);
    setProcessing(false);
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-green-600" />
            Secure Payment
          </DialogTitle>
          <DialogDescription>
            Complete your payment securely. This is a simulated payment for demo
            purposes.
          </DialogDescription>
        </DialogHeader>

        {processing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 text-center max-w-sm mx-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
              <p className="text-muted-foreground text-sm">
                Please don't close this window. Processing your payment of{" "}
                {formatPrice(totalAmount)}...
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">
                  Secured by MarketHub
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            {vendorName && (
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">Vendor: {vendorName}</Badge>
              </div>
            )}
            <div className="space-y-2 mb-3">
              {orderItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total Amount</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <Label className="text-base font-medium">Payment Method</Label>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <Button
                variant={paymentMethod === "card" ? "default" : "outline"}
                className="h-12 justify-start"
                onClick={() => setPaymentMethod("card")}
                disabled={loading}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Card
              </Button>
              <Button
                variant={paymentMethod === "upi" ? "default" : "outline"}
                className="h-12 justify-start"
                onClick={() => setPaymentMethod("upi")}
                disabled={loading}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                UPI
              </Button>
            </div>
          </div>

          {/* Card Payment Form */}
          {paymentMethod === "card" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  disabled={loading}
                  className="font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    disabled={loading}
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    type="password"
                    value={cardDetails.cvv}
                    onChange={(e) => handleCvvChange(e.target.value)}
                    disabled={loading}
                    className="font-mono"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, name: e.target.value })
                  }
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {/* UPI Payment Form */}
          {paymentMethod === "upi" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  placeholder="yourname@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    UPI Payment
                  </span>
                </div>
                <p className="text-xs text-blue-700">
                  Enter your UPI ID to proceed with the payment. This is a
                  simulated transaction.
                </p>
              </div>
            </div>
          )}

          {/* Demo Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                Demo Mode
              </span>
            </div>
            <p className="text-xs text-yellow-700">
              This is a simulated payment system for demonstration purposes. No
              real money will be charged.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={simulatePayment}
              disabled={!canProceed || loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Pay {formatPrice(totalAmount)}
                </>
              )}
            </Button>
          </div>

          {/* Security Info */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>Your payment information is secure and encrypted</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
