import React, { useState, useEffect } from "react";
import {
  Camera,
  Save,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  Star,
} from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { VendorLayout } from "@/components/VendorLayout";
import { vendorApi, authApi } from "@/lib/api-client";
import { Vendor, User } from "@shared/api";
import { useAuth } from "@/contexts/AuthContext";

const VendorProfile: React.FC = () => {
  const { toast } = useToast();
  const { user, updateUser, refreshUser } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [vendorData, setVendorData] = useState<Vendor | null>(null);

  // Profile form data
  const [profileData, setProfileData] = useState({
    // User data
    fullName: "",
    email: "",
    phone: "",
    address: "",

    // Vendor data
    businessName: "",
    businessDescription: "",
    businessAddress: "",
    taxId: "",
    bankAccount: "",

    // Images and branding
    profileImage: "",
    coverImage: "",
    logoImage: "",
    brandColors: {
      primary: "#6366f1",
      secondary: "#f3f4f6",
    },

    // Social and contact
    website: "",
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    },

    // Business hours
    businessHours: {
      monday: { open: "09:00", close: "17:00", closed: false },
      tuesday: { open: "09:00", close: "17:00", closed: false },
      wednesday: { open: "09:00", close: "17:00", closed: false },
      thursday: { open: "09:00", close: "17:00", closed: false },
      friday: { open: "09:00", close: "17:00", closed: false },
      saturday: { open: "10:00", close: "16:00", closed: false },
      sunday: { open: "10:00", close: "16:00", closed: true },
    },
  });

  useEffect(() => {
    loadVendorProfile();
  }, []);

  const loadVendorProfile = async () => {
    try {
      setIsLoading(true);

      // Load user profile
      const userResponse = await authApi.getProfile();
      if (userResponse.success && userResponse.data) {
        const userData = userResponse.data;
        setProfileData((prev) => ({
          ...prev,
          fullName: userData.fullName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
        }));
      }

      // Load vendor profile
      const vendorResponse = await vendorApi.getProfile();
      if (vendorResponse.success && vendorResponse.data) {
        const vendor = vendorResponse.data;
        setVendorData(vendor);
        setProfileData((prev) => ({
          ...prev,
          businessName: vendor.businessName || "",
          businessDescription: vendor.businessDescription || "",
          businessAddress: vendor.businessAddress || "",
          taxId: vendor.taxId || "",
          bankAccount: vendor.bankAccount || "",
        }));
      }
    } catch (error) {
      console.error("Failed to load vendor profile:", error);
      toast({
        title: "Error",
        description: "Failed to load vendor profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (
    parent: string,
    field: string,
    value: any,
  ) => {
    setProfileData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as any),
        [field]: value,
      },
    }));
  };

  const handleBusinessHourChange = (day: string, field: string, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day as keyof typeof prev.businessHours],
          [field]: value,
        },
      },
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);

      // Update vendor profile
      const vendorUpdateData = {
        businessName: profileData.businessName,
        businessDescription: profileData.businessDescription,
        businessAddress: profileData.businessAddress,
        taxId: profileData.taxId,
        bankAccount: profileData.bankAccount,
      };

      await vendorApi.updateProfile(vendorUpdateData);

      // Refresh user data
      await refreshUser();

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <VendorLayout activeTab="profile">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout activeTab="profile">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Vendor Profile</h1>
            <p className="text-muted-foreground">
              Manage your business profile and branding
            </p>
          </div>
          <div className="flex items-center gap-2">
            {vendorData?.isVerified && (
              <Badge className="bg-green-100 text-green-800">
                <Star className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Cover Image Section */}
        <Card className="overflow-hidden">
          <div
            className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative"
            style={{
              backgroundImage: profileData.coverImage
                ? `url(${profileData.coverImage})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute bottom-4 right-4">
              <label htmlFor="cover-upload">
                <Button
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Change Cover
                </Button>
              </label>
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload("coverImage", e)}
              />
            </div>

            {/* Profile Avatar */}
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={profileData.profileImage}
                    alt={profileData.businessName}
                  />
                  <AvatarFallback className="text-2xl">
                    {profileData.businessName?.charAt(0) || "V"}
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="avatar-upload">
                  <Button
                    size="icon"
                    className="absolute bottom-2 right-2 w-8 h-8 rounded-full shadow-lg"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload("profileImage", e)}
                />
              </div>
            </div>
          </div>

          <CardContent className="pt-20 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {profileData.businessName || "Your Business Name"}
                </h2>
                <p className="text-muted-foreground">
                  {profileData.businessDescription || "Business description"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {vendorData?.commissionRate || 10}% Commission
                </Badge>
                <Badge
                  variant={vendorData?.isVerified ? "default" : "secondary"}
                >
                  {vendorData?.isVerified ? "Verified" : "Pending Verification"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={profileData.businessName}
                      onChange={(e) =>
                        handleInputChange("businessName", e.target.value)
                      }
                      placeholder="Your business name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Contact Person</Label>
                    <Input
                      id="fullName"
                      value={profileData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessDescription">
                    Business Description
                  </Label>
                  <Textarea
                    id="businessDescription"
                    value={profileData.businessDescription}
                    onChange={(e) =>
                      handleInputChange("businessDescription", e.target.value)
                    }
                    placeholder="Describe your business..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID</Label>
                    <Input
                      id="taxId"
                      value={profileData.taxId}
                      onChange={(e) =>
                        handleInputChange("taxId", e.target.value)
                      }
                      placeholder="Business tax ID"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bankAccount">Bank Account</Label>
                    <Input
                      id="bankAccount"
                      value={profileData.bankAccount}
                      onChange={(e) =>
                        handleInputChange("bankAccount", e.target.value)
                      }
                      placeholder="Bank account for payments"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Textarea
                    id="businessAddress"
                    value={profileData.businessAddress}
                    onChange={(e) =>
                      handleInputChange("businessAddress", e.target.value)
                    }
                    placeholder="Your business address"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding */}
          <TabsContent value="branding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Branding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo Upload */}
                <ImageUpload
                  value={profileData.logoImage}
                  onChange={(imageUrl) =>
                    handleInputChange("logoImage", imageUrl)
                  }
                  label="Store Logo"
                  placeholder="Upload your store logo"
                  aspectRatio="square"
                />

                <Separator />

                {/* Brand Colors */}
                <div className="space-y-4">
                  <Label>Brand Colors</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex items-center gap-2">
                        <input
                          id="primaryColor"
                          type="color"
                          value={profileData.brandColors.primary}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "brandColors",
                              "primary",
                              e.target.value,
                            )
                          }
                          className="w-12 h-10 border rounded"
                        />
                        <Input
                          value={profileData.brandColors.primary}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "brandColors",
                              "primary",
                              e.target.value,
                            )
                          }
                          placeholder="#6366f1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex items-center gap-2">
                        <input
                          id="secondaryColor"
                          type="color"
                          value={profileData.brandColors.secondary}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "brandColors",
                              "secondary",
                              e.target.value,
                            )
                          }
                          className="w-12 h-10 border rounded"
                        />
                        <Input
                          value={profileData.brandColors.secondary}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "brandColors",
                              "secondary",
                              e.target.value,
                            )
                          }
                          placeholder="#f3f4f6"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="space-y-2">
                  <Label>Color Preview</Label>
                  <div className="flex gap-4">
                    <div
                      className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-medium"
                      style={{
                        backgroundColor: profileData.brandColors.primary,
                      }}
                    >
                      Primary
                    </div>
                    <div
                      className="w-16 h-16 rounded-lg flex items-center justify-center font-medium"
                      style={{
                        backgroundColor: profileData.brandColors.secondary,
                      }}
                    >
                      Secondary
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Information */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="business@example.com"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="+1 (555) 123-4567"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="website"
                        value={profileData.website}
                        onChange={(e) =>
                          handleInputChange("website", e.target.value)
                        }
                        placeholder="https://www.yourbusiness.com"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Social Media</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      value={profileData.socialMedia.facebook}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "socialMedia",
                          "facebook",
                          e.target.value,
                        )
                      }
                      placeholder="Facebook URL"
                    />
                    <Input
                      value={profileData.socialMedia.twitter}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "socialMedia",
                          "twitter",
                          e.target.value,
                        )
                      }
                      placeholder="Twitter URL"
                    />
                    <Input
                      value={profileData.socialMedia.instagram}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "socialMedia",
                          "instagram",
                          e.target.value,
                        )
                      }
                      placeholder="Instagram URL"
                    />
                    <Input
                      value={profileData.socialMedia.linkedin}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "socialMedia",
                          "linkedin",
                          e.target.value,
                        )
                      }
                      placeholder="LinkedIn URL"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Business Hours</Label>
                  {Object.entries(profileData.businessHours).map(
                    ([day, hours]) => (
                      <div
                        key={day}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-20 text-sm font-medium capitalize">
                            {day}
                          </div>
                          <Switch
                            checked={!hours.closed}
                            onCheckedChange={(checked) =>
                              handleBusinessHourChange(day, "closed", !checked)
                            }
                          />
                        </div>

                        {!hours.closed && (
                          <div className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={hours.open}
                              onChange={(e) =>
                                handleBusinessHourChange(
                                  day,
                                  "open",
                                  e.target.value,
                                )
                              }
                              className="w-24"
                            />
                            <span className="text-muted-foreground">to</span>
                            <Input
                              type="time"
                              value={hours.close}
                              onChange={(e) =>
                                handleBusinessHourChange(
                                  day,
                                  "close",
                                  e.target.value,
                                )
                              }
                              className="w-24"
                            />
                          </div>
                        )}

                        {hours.closed && (
                          <Badge variant="secondary">Closed</Badge>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </VendorLayout>
  );
};

export default VendorProfile;
