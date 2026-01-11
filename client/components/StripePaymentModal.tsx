import { useState, useEffect } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { formatPrice } from "../lib/currency";
import { Lock, Shield, Loader2 } from "lucide-react";

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayment: (result: { success: boolean; paymentIntentId: string }) => void;
  totalAmount: number;
  vendorName?: string;
  orderItems: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  customerEmail?: string;
}

let stripePromise: Promise<Stripe | null> | null = null;

async function getStripe() {
  if (!stripePromise) {
    const response = await fetch("/api/payments/config");
    const { data } = await response.json();

    stripePromise = loadStripe(data.publishableKey);
  }
  return stripePromise;
}

function StripePaymentForm({
  totalAmount,
  orderItems,
  vendorName,
  customerEmail,
  onClose,
  onPayment,
}: {
  totalAmount: number;
  orderItems: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  vendorName?: string;
  customerEmail?: string;
  onClose: () => void;
  onPayment: (result: { success: boolean; paymentIntentId: string }) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState(customerEmail || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create payment intent
      const intentResponse = await fetch("/api/payments/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          currency: "usd",
          customerEmail: email,
          orderId: `order_${Date.now()}`,
        }),
      });

      const intentData = await intentResponse.json();

      if (!intentData.success) {
        throw new Error(intentData.message || "Failed to create payment");
      }

      const { clientSecret, paymentIntentId } = intentData.data;

      // Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed");
        setProcessing(false);
      } else if (result.paymentIntent?.status === "succeeded") {
        onPayment({
          success: true,
          paymentIntentId: paymentIntentId,
        });
        onClose();
      } else {
        setError("Payment was not successful");
        setProcessing(false);
      }
    } catch (err: any) {
      setError(err.message || "Payment processing failed");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      {/* Email */}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={processing}
        />
      </div>

      {/* Card Details */}
      <div>
        <Label htmlFor="card">Card Details</Label>
        <div className="border rounded-md p-3 bg-white dark:bg-slate-950">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Security Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            Secure Payment
          </span>
        </div>
        <p className="text-xs text-blue-700">
          Your payment is processed securely by Stripe. We never store your card
          details.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={processing}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || !elements || processing || !email}
          className="flex-1"
        >
          {processing ? (
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

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Shield className="h-3 w-3" />
        <span>Your payment information is secure and encrypted</span>
      </div>
    </form>
  );
}

export function StripePaymentModal({
  isOpen,
  onClose,
  onPayment,
  totalAmount,
  vendorName,
  orderItems,
  customerEmail,
}: StripePaymentModalProps) {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStripe().then((s) => {
      setStripe(s);
      setLoading(false);
    });
  }, []);

  if (loading || !stripe) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-green-600" />
            Secure Payment
          </DialogTitle>
          <DialogDescription>
            Complete your payment securely with Stripe
          </DialogDescription>
        </DialogHeader>

        <Elements stripe={stripe}>
          <StripePaymentForm
            totalAmount={totalAmount}
            orderItems={orderItems}
            vendorName={vendorName}
            customerEmail={customerEmail}
            onClose={onClose}
            onPayment={onPayment}
          />
        </Elements>
      </DialogContent>
    </Dialog>
  );
}
