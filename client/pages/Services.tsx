import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";
import { formatPrice } from "@/lib/currency";

const quoteSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone"),
  company: z.string().optional(),
  service: z.string().min(1, "Select a service"),
  budget: z
    .string()
    .optional()
    .transform((v) =>
      v && v.trim() !== "" ? Number(v.replace(/[^0-9]/g, "")) : undefined,
    )
    .refine((v) => v === undefined || v >= 0, {
      message: "Budget must be positive",
    }),
  message: z.string().min(10, "Please describe your needs"),
});

export default function Services() {
  const services = [
    {
      title: "Store Setup",
      desc: "End‑to‑end onboarding, catalog import, and branding assistance.",
    },
    {
      title: "Marketing Boost",
      desc: "Campaigns, coupons, and merchandising to improve conversions.",
    },
    {
      title: "Logistics & Shipping",
      desc: "Integrated labels, tracking, and preferred courier rates.",
    },
    {
      title: "Payments & Payouts",
      desc: "Secure checkout, fraud checks, and scheduled payouts.",
    },
    {
      title: "Analytics & Insights",
      desc: "Sales dashboards, cohort analysis, and exportable reports.",
    },
    {
      title: "Priority Support",
      desc: "Fast help from our specialists when you need it most.",
    },
  ];

  const form = useForm<z.infer<typeof quoteSchema>>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      service: "",
      budget: "" as unknown as string,
      message: "",
    },
    mode: "onBlur",
  });
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(values: z.infer<typeof quoteSchema>) {
    setSubmitting(true);
    try {
      // Simulate submission; backend endpoint can be wired later
      await new Promise((r) => setTimeout(r, 800));
      toast({
        title: "Request received",
        description: "Our team will contact you within 24 hours.",
      });
      form.reset();
    } catch (e) {
      toast({
        title: "Submission failed",
        description: "Please try again.",
        variant: "destructive" as any,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Our Services</h1>
        <p className="text-muted-foreground mt-3">
          Professional services to help you launch, operate, and scale on
          MarketHub.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </Card>
          ))}
        </div>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Request a Quote</CardTitle>
            <CardDescription>
              Tell us what you need. We’ll tailor a plan for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="phone"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Your phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  name="company"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    name="service"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {services.map((s) => (
                              <SelectItem key={s.title} value={s.title}>
                                {s.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="budget"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Approx. Monthly Budget</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`${formatPrice(25000)} e.g.`}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter an amount in ₹ (optional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  name="message"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Details</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={5}
                          placeholder="Tell us about your goals, timelines, and any links."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Submitting..." : "Request Quote"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
