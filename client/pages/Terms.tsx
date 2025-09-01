import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mt-2">Last updated: 01 Sep 2025</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>These Terms of Service ("Terms") govern your access to and use of MarketHub (the "Platform"). By creating an account or using the Platform, you agree to be bound by these Terms.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>You must provide accurate information and keep your credentials secure. You are responsible for all activities that occur under your account.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Vendor Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <ul className="list-disc pl-5 space-y-2">
              <li>Comply with all applicable laws, including consumer protection and tax rules.</li>
              <li>Provide accurate product information, pricing, and stock levels.</li>
              <li>Fulfil orders promptly and provide valid tracking details.</li>
              <li>Maintain clear policies for returns, refunds, and warranties.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Fees, Commission and Payouts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>We may charge subscription fees and/or commission per sale as described on the Platform. Payout schedules and settlement timelines are shown in your dashboard. Deductions for refunds, chargebacks, or penalties may apply.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Prohibited Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <ul className="list-disc pl-5 space-y-2">
              <li>Illegal products, counterfeit goods, or infringement of third‑party rights.</li>
              <li>Fraud, spamming, scraping, or security testing without consent.</li>
              <li>Interference with the Platform’s operation or other users’ experience.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>All Platform content is owned by MarketHub or its licensors. You retain rights to content you upload but grant us a limited license to host, display, and distribute it to operate the Platform.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>Your use of the Platform is subject to our Privacy Policy, which explains how we collect and use personal data.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Disclaimers and Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>To the maximum extent permitted by law, the Platform is provided "as is" without warranties of any kind. We are not liable for indirect, incidental, or consequential damages.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>We may suspend or terminate your account for violations of these Terms or harmful conduct. You may stop using the Platform at any time.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Governing Law & Dispute Resolution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>These Terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka, India.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
