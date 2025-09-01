import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mt-2">Last updated: 01 Sep 2025</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Data Controller</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>MarketHub is responsible for the processing of personal data collected through the Platform.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <ul className="list-disc pl-5 space-y-2">
              <li>Account data: name, email, phone, address, and profile details.</li>
              <li>Transaction data: orders, payments, and shipment details.</li>
              <li>Device and usage data: IP address, browser, pages viewed.</li>
              <li>Vendor data: business details, tax information, bank account for payouts.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. How We Use Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide and improve the Platform and customer support.</li>
              <li>Process orders, payments, and payouts.</li>
              <li>Prevent fraud and ensure platform security.</li>
              <li>Send transactional communications and, with consent, marketing.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Cookies and Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>We use cookies and similar technologies to remember your preferences and analyze usage. You can control cookies through your browser settings.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Sharing of Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>We may share data with service providers (hosting, payments, analytics), with vendors to fulfil orders, or when required by law. We do not sell personal data.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>We retain personal data as long as necessary for the purposes described or as required by law, then securely delete or anonymize it.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>You may request access, correction, deletion, or restriction of your personal data, and opt out of marketing at any time.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>We implement technical and organizational measures to protect data. No method of transmission or storage is 100% secure.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. International Transfers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>Data may be processed outside your country with appropriate safeguards in place.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>For privacy questions, contact support@markethub.com.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
