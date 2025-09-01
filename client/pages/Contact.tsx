import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
        <p className="text-muted-foreground mt-3">We’re here to help with onboarding, operations, and account questions.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Support</CardTitle>
            <CardDescription>Get assistance from our team.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">Email: support@markethub.com</p>
            <p className="text-sm">Hours: 24/7</p>
            <Button asChild>
              <a href="mailto:support@markethub.com">Email Support</a>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales & Partnerships</CardTitle>
            <CardDescription>Talk to us about growing together.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">Email: sales@markethub.com</p>
            <p className="text-sm">Hours: Mon–Fri, 9am–6pm IST</p>
            <Button variant="outline" asChild>
              <a href="mailto:sales@markethub.com">Email Sales</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
