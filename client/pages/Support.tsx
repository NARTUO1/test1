import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Support() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Support</h1>
          <p className="text-muted-foreground mt-2">Find help fast or send us a message.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Help Center</CardTitle>
              <CardDescription>Guides and FAQs</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                <li>Orders and shipping</li>
                <li>Payments and refunds</li>
                <li>Vendor onboarding</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Email support@markethub.com</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Subject" />
              <Textarea rows={5} placeholder="Describe your issue" />
              <Button>Send</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
