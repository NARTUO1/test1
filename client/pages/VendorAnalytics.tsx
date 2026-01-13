import { VendorLayout } from "@/components/VendorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, ShoppingCart } from "lucide-react";

export default function VendorAnalytics() {
  const kpis = [
    { label: "Revenue (30d)", value: "₹4,52,300", icon: TrendingUp },
    { label: "Orders (30d)", value: "1,247", icon: ShoppingCart },
    { label: "Unique Buyers", value: "892", icon: Users },
    { label: "Conversion", value: "3.8%", icon: BarChart3 },
  ];

  return (
    <VendorLayout activeTab="dashboard">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Sales performance, conversions, and buyers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <Card key={k.label}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{k.label}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{k.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 grid place-items-center text-sm text-muted-foreground">
              Chart coming soon
            </div>
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
}
