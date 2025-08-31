import {
  Save,
  Shield,
  Bell,
  Mail,
  CreditCard,
  Globe,
  Database,
  Users,
  Package,
  CheckCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { AdminLayout } from "../components/AdminLayout";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { useState } from "react";

export default function AdminSettings() {
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const handleSaveSettings = () => {
    // Here you would normally save the settings to your backend
    // For now, we'll just show a success popup
    setIsSuccessDialogOpen(true);
  };
  return (
    <AdminLayout activeTab="settings">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Platform Settings</h1>
            <p className="text-muted-foreground">
              Configure marketplace settings and preferences
            </p>
          </div>
          <Button onClick={handleSaveSettings}>
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input id="siteName" defaultValue="MarketHub" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  defaultValue="Your premier multi-vendor marketplace for everything you need"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  defaultValue="support@markethub.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Default Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern Standard Time</SelectItem>
                    <SelectItem value="pst">Pacific Standard Time</SelectItem>
                    <SelectItem value="cet">Central European Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD - US Dollar</SelectItem>
                    <SelectItem value="eur">EUR - Euro</SelectItem>
                    <SelectItem value="gbp">GBP - British Pound</SelectItem>
                    <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for admin accounts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-logout</Label>
                  <p className="text-sm text-muted-foreground">
                    Auto-logout after inactivity
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">
                  Session Timeout (minutes)
                </Label>
                <Input id="sessionTimeout" type="number" defaultValue="30" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Password Complexity</Label>
                  <p className="text-sm text-muted-foreground">
                    Enforce strong passwords
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                <Input id="maxLoginAttempts" type="number" defaultValue="5" />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    System email notifications
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Order Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    New order alerts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Vendor Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Vendor application alerts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dispute Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Customer dispute alerts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>System Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Critical system notifications
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Payment Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="commissionRate">
                  Default Commission Rate (%)
                </Label>
                <Input
                  id="commissionRate"
                  type="number"
                  defaultValue="10"
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="processingFee">Processing Fee (%)</Label>
                <Input
                  id="processingFee"
                  type="number"
                  defaultValue="2.9"
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minPayout">Minimum Payout Amount</Label>
                <Input id="minPayout" type="number" defaultValue="50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payoutSchedule">Payout Schedule</Label>
                <Select defaultValue="weekly">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Payouts</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically process vendor payouts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Vendor Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Vendor Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-approve Vendors</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically approve vendor applications
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Vendor Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Require identity verification
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxProducts">Max Products per Vendor</Label>
                <Input id="maxProducts" type="number" defaultValue="1000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendorFee">Vendor Registration Fee</Label>
                <Input id="vendorFee" type="number" defaultValue="0" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Featured Vendor Program</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow featured vendor subscriptions
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Product Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-approve Products</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically approve product listings
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="maxImages">Max Images per Product</Label>
                <Input id="maxImages" type="number" defaultValue="10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageSize">Max Image Size (MB)</Label>
                <Input id="imageSize" type="number" defaultValue="5" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Content Moderation</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable automated content filtering
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Review System</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable product reviews and ratings
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button size="lg" onClick={handleSaveSettings}>
            <Save className="h-4 w-4 mr-2" />
            Save All Settings
          </Button>
        </div>
      </div>

      {/* Success Popup Dialog */}
      <AlertDialog
        open={isSuccessDialogOpen}
        onOpenChange={setIsSuccessDialogOpen}
      >
        <AlertDialogContent className="animate-scale-in">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center animate-bounce-subtle">
                <CheckCircle
                  className="h-6 w-6 text-green-600 animate-scale-in"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
              <div
                className="animate-slide-in-right"
                style={{ animationDelay: "0.1s" }}
              >
                <AlertDialogTitle className="text-xl">
                  Settings Saved Successfully!
                </AlertDialogTitle>
                <AlertDialogDescription className="text-base mt-1">
                  All platform settings have been successfully saved and
                  applied.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <div
            className="flex justify-end animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <AlertDialogAction
              onClick={() => setIsSuccessDialogOpen(false)}
              className="hover-scale hover-glow"
            >
              OK
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
