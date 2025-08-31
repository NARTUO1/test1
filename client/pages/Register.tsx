import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone, Building } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<"buyer" | "seller">("buyer");

  // Check URL parameters to determine default tab
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get("type");
    if (type === "seller") {
      setUserType("seller");
    }
  }, []);

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    acceptTerms: false,
    marketing: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log("Registration attempt:", { ...formData, userType });
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-purple-50 dark:from-primary/5 dark:to-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-2xl font-bold">MarketHub</span>
          </div>
          <p className="text-muted-foreground">
            Join thousands of buyers and sellers
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Create Account
            </CardTitle>
            <CardDescription className="text-center">
              Choose your account type and get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={userType}
              onValueChange={(value) =>
                setUserType(value as "buyer" | "seller")
              }
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="buyer">Buyer Account</TabsTrigger>
                <TabsTrigger value="seller">Seller Account</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Common Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) =>
                          updateFormData("firstName", e.target.value)
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) =>
                        updateFormData("lastName", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Seller-specific fields */}
                {userType === "seller" && (
                  <div className="space-y-2">
                    <label
                      htmlFor="companyName"
                      className="text-sm font-medium"
                    >
                      Company Name
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="companyName"
                        type="text"
                        placeholder="Your Company Name"
                        value={formData.companyName}
                        onChange={(e) =>
                          updateFormData("companyName", e.target.value)
                        }
                        className="pl-10"
                        required={userType === "seller"}
                      />
                    </div>
                  </div>
                )}

                {/* Password Fields */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) =>
                        updateFormData("password", e.target.value)
                      }
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        updateFormData("confirmPassword", e.target.value)
                      }
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) =>
                        updateFormData("acceptTerms", checked as boolean)
                      }
                      required
                    />
                    <label
                      htmlFor="acceptTerms"
                      className="text-sm cursor-pointer leading-relaxed"
                    >
                      I agree to the{" "}
                      <a href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy"
                        className="text-primary hover:underline"
                      >
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="marketing"
                      checked={formData.marketing}
                      onCheckedChange={(checked) =>
                        updateFormData("marketing", checked as boolean)
                      }
                    />
                    <label
                      htmlFor="marketing"
                      className="text-sm cursor-pointer leading-relaxed"
                    >
                      I'd like to receive marketing emails about new products
                      and exclusive offers
                    </label>
                  </div>
                </div>

                {/* Account Type Description */}
                <TabsContent value="buyer" className="mt-4">
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Buyer Account Benefits:
                    </h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
                      <li>• Browse thousands of products</li>
                      <li>��� Create wishlists and save favorites</li>
                      <li>• Track orders and delivery</li>
                      <li>• Access exclusive buyer deals</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="seller" className="mt-4">
                  <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                      Seller Account Benefits:
                    </h4>
                    <ul className="text-sm text-purple-700 dark:text-purple-200 space-y-1">
                      <li>• List and sell your products</li>
                      <li>• Manage inventory and orders</li>
                      <li>• Access seller analytics</li>
                      <li>• Connect with global customers</li>
                    </ul>
                  </div>
                </TabsContent>

                {/* Submit Button */}
                <Button type="submit" className="w-full" size="lg">
                  Create {userType === "seller" ? "Seller" : "Buyer"} Account
                </Button>
              </form>

              {/* Sign In Link */}
              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <a
                    href={
                      userType === "seller" ? "/login?type=seller" : "/login"
                    }
                    className="text-primary hover:underline font-medium"
                  >
                    {userType === "seller"
                      ? "Sign in as Seller"
                      : "Sign in here"}
                  </a>
                </p>
                {userType === "buyer" && (
                  <p className="text-xs text-muted-foreground">
                    Want to sell on MarketHub?{" "}
                    <a
                      href="/become-seller"
                      className="text-primary hover:underline"
                    >
                      Become a seller
                    </a>
                  </p>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
