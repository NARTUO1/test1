import { useState } from "react";
import {
  User,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  Plus,
  Edit,
  Trash2,
  Check,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export default function Profile() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
    holderName: "",
    brand: "Visa",
  });

  // Mock user data
  const [userProfile, setUserProfile] = useState({
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-05-15",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  });

  const [addresses, setAddresses] = useState([
    {
      id: "1",
      type: "home",
      name: "Home",
      firstName: "John",
      lastName: "Smith",
      address: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "United States",
      isDefault: true,
    },
    {
      id: "2",
      type: "work",
      name: "Work",
      firstName: "John",
      lastName: "Smith",
      address: "456 Business Ave, Suite 100",
      city: "San Francisco",
      state: "CA",
      zipCode: "94107",
      country: "United States",
      isDefault: false,
    },
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "1",
      type: "card",
      brand: "Visa",
      last4: "1234",
      expiryMonth: "12",
      expiryYear: "2025",
      isDefault: true,
    },
    {
      id: "2",
      type: "card",
      brand: "Mastercard",
      last4: "5678",
      expiryMonth: "08",
      expiryYear: "2026",
      isDefault: false,
    },
  ]);

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newArrivals: false,
    priceDrops: true,
    newsletter: true,
  });

  const [newAddress, setNewAddress] = useState({
    name: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    // Save profile changes
  };

  const handleAddAddress = () => {
    const address = {
      id: Date.now().toString(),
      type: "custom",
      isDefault: addresses.length === 0,
      ...newAddress,
    };
    setAddresses([...addresses, address]);
    setNewAddress({
      name: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    });
    setIsAddingAddress(false);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    );
  };

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id));
  };

  const handleSetDefaultPayment = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      })),
    );
  };

  const handleAddPaymentMethod = () => {
    setShowAddPaymentDialog(true);
  };

  const handleSavePaymentMethod = () => {
    // Basic validation
    if (
      !newPaymentMethod.cardNumber ||
      !newPaymentMethod.expiryMonth ||
      !newPaymentMethod.expiryYear ||
      !newPaymentMethod.cvc ||
      !newPaymentMethod.holderName
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Determine card brand from card number (simple logic)
    let brand = "Visa";
    if (newPaymentMethod.cardNumber.startsWith("5")) {
      brand = "Mastercard";
    } else if (newPaymentMethod.cardNumber.startsWith("4")) {
      brand = "Visa";
    } else if (newPaymentMethod.cardNumber.startsWith("3")) {
      brand = "Amex";
    }

    const paymentMethod = {
      id: Date.now().toString(),
      type: "card",
      brand: brand,
      last4: newPaymentMethod.cardNumber.slice(-4),
      expiryMonth: newPaymentMethod.expiryMonth,
      expiryYear: newPaymentMethod.expiryYear,
      isDefault: paymentMethods.length === 0, // First card is default
    };

    setPaymentMethods([...paymentMethods, paymentMethod]);

    // Reset form
    setNewPaymentMethod({
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvc: "",
      holderName: "",
      brand: "Visa",
    });

    setShowAddPaymentDialog(false);
    alert("Payment method added successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">My Account</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs
          defaultValue="profile"
          className="space-y-6 animate-slide-in-left"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="hover-scale">
              Profile
            </TabsTrigger>
            <TabsTrigger value="addresses" className="hover-scale">
              Addresses
            </TabsTrigger>
            <TabsTrigger value="payments" className="hover-scale">
              Payment Methods
            </TabsTrigger>
            <TabsTrigger value="notifications" className="hover-scale">
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="animate-fade-in">
            <Card className="hover-lift">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditingProfile ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={userProfile.avatar} />
                    <AvatarFallback>
                      {userProfile.firstName[0]}
                      {userProfile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">
                      {userProfile.firstName} {userProfile.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Member since March 2024
                    </p>
                    {isEditingProfile && (
                      <Button variant="outline" size="sm" className="mt-2">
                        Change Photo
                      </Button>
                    )}
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={userProfile.firstName}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          firstName: e.target.value,
                        })
                      }
                      disabled={!isEditingProfile}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={userProfile.lastName}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          lastName: e.target.value,
                        })
                      }
                      disabled={!isEditingProfile}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userProfile.email}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          email: e.target.value,
                        })
                      }
                      disabled={!isEditingProfile}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={userProfile.phone}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          phone: e.target.value,
                        })
                      }
                      disabled={!isEditingProfile}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={userProfile.dateOfBirth}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          dateOfBirth: e.target.value,
                        })
                      }
                      disabled={!isEditingProfile}
                    />
                  </div>
                </div>

                {isEditingProfile && (
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile}>
                      <Check className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingProfile(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Saved Addresses
                  </CardTitle>
                  <Button onClick={() => setIsAddingAddress(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add New Address Form */}
                {isAddingAddress && (
                  <Card className="border-dashed">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-4">Add New Address</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="addressName">Address Name</Label>
                          <Input
                            id="addressName"
                            placeholder="e.g., Home, Work"
                            value={newAddress.name}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div></div>
                        <div>
                          <Label htmlFor="newFirstName">First Name</Label>
                          <Input
                            id="newFirstName"
                            value={newAddress.firstName}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                firstName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="newLastName">Last Name</Label>
                          <Input
                            id="newLastName"
                            value={newAddress.lastName}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                lastName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="newAddress">Address</Label>
                          <Input
                            id="newAddress"
                            value={newAddress.address}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                address: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="newCity">City</Label>
                          <Input
                            id="newCity"
                            value={newAddress.city}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                city: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="newState">State</Label>
                          <Input
                            id="newState"
                            value={newAddress.state}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                state: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="newZipCode">ZIP Code</Label>
                          <Input
                            id="newZipCode"
                            value={newAddress.zipCode}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                zipCode: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button onClick={handleAddAddress}>Add Address</Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddingAddress(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Address List */}
                {addresses.map((address) => (
                  <Card key={address.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{address.name}</h4>
                            {address.isDefault && (
                              <Badge variant="secondary">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {address.firstName} {address.lastName}
                            <br />
                            {address.address}
                            <br />
                            {address.city}, {address.state} {address.zipCode}
                            <br />
                            {address.country}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!address.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleSetDefaultAddress(address.id)
                              }
                            >
                              Set Default
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAddress(address.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Methods
                  </CardTitle>
                  <Button onClick={handleAddPaymentMethod}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((payment) => (
                  <Card key={payment.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded text-white text-xs flex items-center justify-center font-bold">
                            {payment.brand.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">
                              {payment.brand} ending in {payment.last4}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Expires {payment.expiryMonth}/{payment.expiryYear}
                            </p>
                          </div>
                          {payment.isDefault && (
                            <Badge variant="secondary">Default</Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {!payment.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleSetDefaultPayment(payment.id)
                              }
                            >
                              Set Default
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDeletePaymentMethod(payment.id)
                            }
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order Updates</p>
                      <p className="text-sm text-muted-foreground">
                        Notifications about your order status and delivery
                      </p>
                    </div>
                    <Switch
                      checked={notifications.orderUpdates}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          orderUpdates: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Promotions & Deals</p>
                      <p className="text-sm text-muted-foreground">
                        Special offers and promotional content
                      </p>
                    </div>
                    <Switch
                      checked={notifications.promotions}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          promotions: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Arrivals</p>
                      <p className="text-sm text-muted-foreground">
                        Updates on new products from your favorite categories
                      </p>
                    </div>
                    <Switch
                      checked={notifications.newArrivals}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          newArrivals: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Price Drops</p>
                      <p className="text-sm text-muted-foreground">
                        Alerts when items in your wishlist go on sale
                      </p>
                    </div>
                    <Switch
                      checked={notifications.priceDrops}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          priceDrops: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Newsletter</p>
                      <p className="text-sm text-muted-foreground">
                        Weekly newsletter with curated content and offers
                      </p>
                    </div>
                    <Switch
                      checked={notifications.newsletter}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          newsletter: checked,
                        })
                      }
                    />
                  </div>
                </div>

                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Payment Method Dialog */}
      <Dialog
        open={showAddPaymentDialog}
        onOpenChange={setShowAddPaymentDialog}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Add a new credit or debit card to your account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="holderName" className="text-right">
                Cardholder Name
              </Label>
              <Input
                id="holderName"
                value={newPaymentMethod.holderName}
                onChange={(e) =>
                  setNewPaymentMethod({
                    ...newPaymentMethod,
                    holderName: e.target.value,
                  })
                }
                className="col-span-3"
                placeholder="John Doe"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cardNumber" className="text-right">
                Card Number
              </Label>
              <Input
                id="cardNumber"
                value={newPaymentMethod.cardNumber}
                onChange={(e) =>
                  setNewPaymentMethod({
                    ...newPaymentMethod,
                    cardNumber: e.target.value.replace(/\s/g, ""),
                  })
                }
                className="col-span-3"
                placeholder="1234567890123456"
                maxLength={16}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiry" className="text-right">
                Expiry
              </Label>
              <div className="col-span-3 flex gap-2">
                <Select
                  value={newPaymentMethod.expiryMonth}
                  onValueChange={(value) =>
                    setNewPaymentMethod({
                      ...newPaymentMethod,
                      expiryMonth: value,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = String(i + 1).padStart(2, "0");
                      return (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Select
                  value={newPaymentMethod.expiryYear}
                  onValueChange={(value) =>
                    setNewPaymentMethod({
                      ...newPaymentMethod,
                      expiryYear: value,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="YY" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = String(new Date().getFullYear() + i).slice(
                        -2,
                      );
                      return (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cvc" className="text-right">
                CVC
              </Label>
              <Input
                id="cvc"
                value={newPaymentMethod.cvc}
                onChange={(e) =>
                  setNewPaymentMethod({
                    ...newPaymentMethod,
                    cvc: e.target.value,
                  })
                }
                className="col-span-3"
                placeholder="123"
                maxLength={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddPaymentDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSavePaymentMethod}>
              Add Payment Method
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
