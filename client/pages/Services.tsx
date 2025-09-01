import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function Services() {
  const services = [
    { title: "Store Setup", desc: "End‑to‑end onboarding, catalog import, and branding assistance." },
    { title: "Marketing Boost", desc: "Campaigns, coupons, and merchandising to improve conversions." },
    { title: "Logistics & Shipping", desc: "Integrated labels, tracking, and preferred courier rates." },
    { title: "Payments & Payouts", desc: "Secure checkout, fraud checks, and scheduled payouts." },
    { title: "Analytics & Insights", desc: "Sales dashboards, cohort analysis, and exportable reports." },
    { title: "Priority Support", desc: "Fast help from our specialists when you need it most." },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Our Services</h1>
        <p className="text-muted-foreground mt-3">Professional services to help you launch, operate, and scale on MarketHub.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s) => (
          <Card key={s.title} className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                {s.title}
              </CardTitle>
              <CardDescription>{s.desc}</CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
