import { Link } from "react-router-dom";
import { Check, Boxes, Store, ShieldCheck, Truck, BarChart3, Headphones, Megaphone, BadgeDollarSign, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { formatPrice, usdToInr } from "@/lib/currency";

function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-16 sm:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Grow your business with MarketHub
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Sell on MarketHub and reach more customers
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-prose">
            Launch your store in minutes, list unlimited products, and get paid securely. Powerful tools, transparent pricing, and world‑class support to help you scale.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/register?type=seller">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/seller-login">Seller Login</Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-6 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> No listing limits</div>
            <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Secure payments</div>
            <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 24/7 support</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><Store className="h-5 w-5 text-primary" /> Create your store</CardTitle>
              <CardDescription>Customize your profile, policies, and branding.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="animate-scale-in [animation-delay:80ms]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><Boxes className="h-5 w-5 text-primary" /> List products fast</CardTitle>
              <CardDescription>Bulk import and rich product details supported.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="animate-scale-in [animation-delay:160ms]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><ShieldCheck className="h-5 w-5 text-primary" /> Protected checkout</CardTitle>
              <CardDescription>Fraud prevention and buyer protection built‑in.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="animate-scale-in [animation-delay:240ms]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><BadgeDollarSign className="h-5 w-5 text-primary" /> Get paid quickly</CardTitle>
              <CardDescription>Track payouts and manage finances with ease.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}

function StepsSection() {
  const steps = [
    {
      icon: <Store className="h-5 w-5 text-primary" />, title: "Create your store", desc: "Sign up, verify your business, and set your preferences." },
    { icon: <Boxes className="h-5 w-5 text-primary" />, title: "Add products", desc: "Upload images, pricing, inventory, and shipping options." },
    { icon: <Truck className="h-5 w-5 text-primary" />, title: "Ship orders", desc: "Print labels and provide tracking with integrated logistics." },
    { icon: <BarChart3 className="h-5 w-5 text-primary" />, title: "Grow with insights", desc: "Monitor sales, conversions, and repeat customers in real‑time." },
  ];
  return (
    <section className="bg-muted/30 py-14">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <Card key={s.title} className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {i + 1}
                  </span>
                  {s.icon}
                  {s.title}
                </CardTitle>
                <CardDescription>{s.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: <ShieldCheck className="h-5 w-5" />, title: "Secure payments", desc: "Trusted checkout with fraud monitoring and dispute assistance." },
    { icon: <Megaphone className="h-5 w-5" />, title: "Built‑in marketing", desc: "Discounts, coupons, and campaigns to boost conversions." },
    { icon: <Headphones className="h-5 w-5" />, title: "Dedicated support", desc: "Get help from our team via chat and email, any time." },
    { icon: <BarChart3 className="h-5 w-5" />, title: "Actionable analytics", desc: "Track performance with dashboards and exportable reports." },
  ];
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid gap-8 lg:grid-cols-3 items-start">
        <div className="lg:col-span-1">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">Everything you need to sell</h2>
          <p className="text-muted-foreground mb-6">From listing to logistics, MarketHub gives you the tools to run and scale your business in one place.</p>
          <div className="flex gap-3">
            <Button asChild>
              <Link to="/register?type=seller">Start selling</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/vendors">Explore top vendors</Link>
            </Button>
          </div>
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <Card key={f.title} className="hover-lift">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                    {f.icon}
                  </span>
                  {f.title}
                </CardTitle>
                <CardDescription>{f.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function SubscriptionSection() {
  const plans: Array<{
    name: string;
    priceInr?: number;
    priceLabel?: string;
    commission: string;
    popular: boolean;
    features: string[];
    planParam: string;
  }> = [
    {
      name: "Starter",
      priceInr: 0,
      commission: "10% per sale",
      popular: false,
      features: [
        "Unlimited listings",
        "Standard support",
        "Basic analytics",
        "Payouts every 7 days",
      ],
      planParam: "starter",
    },
    {
      name: "Pro",
      priceInr: usdToInr(29),
      commission: "5% per sale",
      popular: true,
      features: [
        "Priority support",
        "Advanced analytics",
        "Discount codes & coupons",
        "Payouts every 3 days",
      ],
      planParam: "pro",
    },
    {
      name: "Enterprise",
      priceLabel: "Custom",
      commission: "2% per sale",
      popular: false,
      features: [
        "Dedicated manager",
        "Custom SLAs",
        "API & integrations",
        "On-demand payouts",
      ],
      planParam: "enterprise",
    },
  ];
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold">Plans that fit your business</h2>
          <p className="text-muted-foreground">Choose a membership. Lower commission with higher tiers.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => (
          <Card key={p.name} className={p.popular ? "border-primary shadow-md" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{p.name}</CardTitle>
                {p.popular ? <Badge variant="secondary">Most popular</Badge> : null}
              </div>
              <CardDescription>
                <span className="text-2xl font-semibold">
                  {p.priceLabel ? p.priceLabel : `${formatPrice(p.priceInr ?? 0)}/mo`}
                </span>
                <span className="mx-2">•</span>
                <span className="font-medium text-foreground">{p.commission}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" asChild>
                <Link to={`/register?type=seller&plan=${p.planParam}`}>Choose {p.name}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="bg-muted/30 py-14">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="w-full max-w-3xl">
          <AccordionItem value="fees">
            <AccordionTrigger>What are the fees?</AccordionTrigger>
            <AccordionContent>
              We offer simple, transparent pricing. You only pay when you make a sale. There are no setup fees and no hidden charges.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="payouts">
            <AccordionTrigger>How do payouts work?</AccordionTrigger>
            <AccordionContent>
              Payouts are processed on a regular schedule to your preferred payment method. You can track all transactions in your dashboard.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="shipping">
            <AccordionTrigger>How is shipping handled?</AccordionTrigger>
            <AccordionContent>
              You can use your own carriers or connect supported providers to generate labels and share tracking automatically with customers.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="support">
            <AccordionTrigger>Do you offer support?</AccordionTrigger>
            <AccordionContent>
              Yes. Our support team is available 24/7 via chat and email to help you with onboarding, operations, or account questions.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="container mx-auto px-4 py-16 text-center">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl">Ready to grow with MarketHub?</CardTitle>
          <CardDescription>Join thousands of businesses selling safely and efficiently.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link to="/register?type=seller">Create your seller account</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/seller-login">I already have an account</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

export default function BecomeSeller() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StepsSection />
      <FeaturesSection />
      <SubscriptionSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}
