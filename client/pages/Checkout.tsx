import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  MapPin,
  Check,
  Mail,
  Banknote,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Checkbox } from "../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useCart } from "../contexts/CartContext";
import {
  useOrders,
  splitCartByVendor,
  calculateVendorTotal,
} from "../contexts/OrderContext";
import { formatPrice } from "../lib/currency";
import { StripePaymentModal } from "../components/StripePaymentModal";

export default function Checkout() {
  const { state, clearCart } = useCart();
  const { createOrder, addPaymentId } = useOrders();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentVendorGroup, setCurrentVendorGroup] = useState<string | null>(
    null,
  );

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "IN",
  });

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [billingAddress, setBillingAddress] = useState({
    sameAsShipping: true,
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "IN",
  });

  const [cardInfo, setCardInfo] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  const shippingOptions = [
    {
      id: "standard",
      name: "Standard Shipping",
      price: 0,
      time: "5-7 business days",
      description: "Free shipping on orders over ₹2000",
    },
    {
      id: "express",
      name: "Express Shipping",
      price: 199,
      time: "2-3 business days",
      description: "Faster delivery",
    },
    {
      id: "overnight",
      name: "Overnight Delivery",
      price: 399,
      time: "Next business day",
      description: "Express overnight service",
    },
  ];

  const subtotal = state.total;
  const shippingCost =
    shippingOptions.find((opt) => opt.id === shippingMethod)?.price || 0;
  const tax = subtotal * 0.18; // GST 18%
  const total = subtotal + shippingCost + tax;

  const createOrdersForVendors = () => {
    // Split cart items by vendor
    const vendorGroups = splitCartByVendor(state.items);
    const createdOrders: string[] = [];

    Object.keys(vendorGroups).forEach((vendorId) => {
      const vendorItems = vendorGroups[vendorId];
      const vendorTotals = calculateVendorTotal(vendorItems);

      const vendorName = vendorItems[0]?.vendor || "MarketHub";

      const orderId = createOrder({
        items: vendorItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          vendor: item.vendor || vendorName,
          vendorId: vendorId,
        })),
        vendorId,
        vendorName,
        subtotal: vendorTotals.subtotal,
        shippingCost: vendorTotals.shippingCost,
        tax: vendorTotals.tax,
        total: vendorTotals.total,
        status: "pending",
        paymentStatus: paymentMethod === "cod" ? "paid" : "pending",
        paymentMethod: paymentMethod === "cod" ? "cod" : undefined,
        shippingAddress: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
        },
      });

      createdOrders.push(orderId);
    });

    return createdOrders;
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === "online") {
      // Create orders first, then open payment modal
      const orderIds = createOrdersForVendors();
      setCurrentVendorGroup(orderIds[0]); // For simplicity, use first order for payment modal
      setShowPaymentModal(true);
      return;
    }

    if (paymentMethod === "cod") {
      // Create COD orders
      createOrdersForVendors();

      // Clear cart and redirect to success page
      clearCart();
      navigate("/order-success");
      return;
    }
  };

  const handlePaymentResult = (result: {
    success: boolean;
    paymentId: string;
    message: string;
  }) => {
    // Close payment modal
    setShowPaymentModal(false);

    if (result.success) {
      // Update all pending orders with payment information
      if (currentVendorGroup) {
        addPaymentId(currentVendorGroup, result.paymentId, paymentMethod);
      }

      // Save payment details for success page
      const paymentDetails = {
        paymentId: result.paymentId,
        amount: total,
        method: paymentMethod,
        timestamp: new Date().toISOString(),
        vendorName: "MarketHub", // Could be dynamic based on vendor
        items: state.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
      };

      // Store payment details
      localStorage.setItem(
        `payment_${result.paymentId}`,
        JSON.stringify(paymentDetails),
      );

      // Clear cart
      clearCart();

      // Navigate to success page with payment details
      const params = new URLSearchParams({
        paymentId: result.paymentId,
        amount: total.toString(),
        method: paymentMethod,
        vendor: "MarketHub",
      });

      navigate(`/payment-success?${params.toString()}`);
    } else {
      // Navigate to failure page with error details
      const params = new URLSearchParams({
        paymentId: result.paymentId,
        amount: total.toString(),
        method: paymentMethod,
        error: result.message,
        vendor: "MarketHub",
      });

      navigate(`/payment-failure?${params.toString()}`);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">No items to checkout</h2>
            <p className="text-muted-foreground mb-8">
              Your cart is empty. Add some items before proceeding to checkout.
            </p>
            <Button size="lg" asChild>
              <a href="/products">Continue Shopping</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <a href="/cart" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Cart
            </a>
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > stepNumber ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    stepNumber
                  )}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-16 h-0.5 mx-2 ${
                      step > stepNumber ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={shippingInfo.firstName}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            firstName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={shippingInfo.lastName}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            lastName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            phone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          address: e.target.value,
                        })
                      }
                      placeholder="123 Main Street"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            city: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Select
                        value={shippingInfo.state}
                        onValueChange={(value) =>
                          setShippingInfo({ ...shippingInfo, state: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="KA">Karnataka</SelectItem>
                          <SelectItem value="MH">Maharashtra</SelectItem>
                          <SelectItem value="TN">Tamil Nadu</SelectItem>
                          <SelectItem value="AP">Andhra Pradesh</SelectItem>
                          <SelectItem value="TG">Telangana</SelectItem>
                          <SelectItem value="KL">Kerala</SelectItem>
                          <SelectItem value="GJ">Gujarat</SelectItem>
                          <SelectItem value="RJ">Rajasthan</SelectItem>
                          <SelectItem value="UP">Uttar Pradesh</SelectItem>
                          <SelectItem value="WB">West Bengal</SelectItem>
                          <SelectItem value="DL">Delhi</SelectItem>
                          <SelectItem value="PB">Punjab</SelectItem>
                          <SelectItem value="HR">Haryana</SelectItem>
                          <SelectItem value="MP">Madhya Pradesh</SelectItem>
                          <SelectItem value="OR">Odisha</SelectItem>
                          <SelectItem value="JH">Jharkhand</SelectItem>
                          <SelectItem value="CG">Chhattisgarh</SelectItem>
                          <SelectItem value="UK">Uttarakhand</SelectItem>
                          <SelectItem value="HP">Himachal Pradesh</SelectItem>
                          <SelectItem value="AS">Assam</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            zipCode: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => setStep(2)}
                      className="w-full sm:w-auto"
                    >
                      Continue to Shipping
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Shipping Method */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={shippingMethod}
                    onValueChange={setShippingMethod}
                  >
                    <div className="space-y-4">
                      {shippingOptions.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-2 p-4 border rounded-lg"
                        >
                          <RadioGroupItem value={option.id} id={option.id} />
                          <div className="flex-1">
                            <label
                              htmlFor={option.id}
                              className="cursor-pointer"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{option.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {option.description}
                                  </p>
                                  <p className="text-sm font-medium text-primary">
                                    {option.time}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span className="font-semibold">
                                    {option.price === 0
                                      ? "Free"
                                      : formatPrice(option.price)}
                                  </span>
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button onClick={() => setStep(3)}>
                      Continue to Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Payment Method Selection */}
                  <div>
                    <Label className="text-base font-medium">
                      Payment Method
                    </Label>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="mt-3"
                    >
                      <div className="flex items-center space-x-3 p-4 border rounded-lg">
                        <RadioGroupItem value="cod" id="cod" />
                        <Banknote className="h-5 w-5 text-green-600" />
                        <div className="flex-1">
                          <label
                            htmlFor="cod"
                            className="cursor-pointer font-medium"
                          >
                            Cash on Delivery (COD)
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Pay when your order is delivered to your doorstep
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg">
                        <RadioGroupItem value="online" id="online" />
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <div className="flex-1">
                          <label
                            htmlFor="online"
                            className="cursor-pointer font-medium"
                          >
                            Online Payment
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Pay securely using card or UPI
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Payment Method Information */}
                  {paymentMethod === "cod" && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Banknote className="h-5 w-5 text-green-600" />
                        <h4 className="font-medium text-green-800">
                          Cash on Delivery
                        </h4>
                      </div>
                      <p className="text-sm text-green-700">
                        You will pay {formatPrice(total)} in cash when your
                        order is delivered. Please keep the exact amount ready
                        for a smooth delivery experience.
                      </p>
                    </div>
                  )}

                  {paymentMethod === "online" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <h4 className="font-medium text-blue-800">
                          Online Payment
                        </h4>
                      </div>
                      <p className="text-sm text-blue-700 mb-3">
                        Click "Place Order" to open the secure payment modal.
                        Pay using your credit/debit card or UPI.
                      </p>
                      <div className="bg-white border border-blue-300 rounded p-3">
                        <p className="text-sm font-medium text-blue-800">
                          Order Total: {formatPrice(total)}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Your payment information is secure and encrypted
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      {paymentMethod === "cod"
                        ? "Place COD Order"
                        : "Contact for Payment"}{" "}
                      - {formatPrice(total)}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {state.items.map((item) => (
                    <div
                      key={`${item.id}-${item.size}-${item.color}`}
                      className="flex gap-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium line-clamp-2">
                          {item.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}{" "}
                          {item.size && `• Size: ${item.size}`}{" "}
                          {item.color && `• ${item.color}`}
                        </p>
                        <p className="text-sm font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <Shield className="h-6 w-6 mx-auto mb-1 text-green-600" />
                      <p className="text-xs text-muted-foreground">
                        Secure Payment
                      </p>
                    </div>
                    <div>
                      <Truck className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                      <p className="text-xs text-muted-foreground">
                        Fast Delivery
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <FakePaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPayment={handlePaymentResult}
        totalAmount={total}
        vendorName="MarketHub"
        orderItems={state.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        }))}
      />
    </div>
  );
}
