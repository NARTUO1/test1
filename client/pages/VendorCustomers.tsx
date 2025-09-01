import { useState } from "react";
import { VendorLayout } from "@/components/VendorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function VendorCustomers() {
  const [q, setQ] = useState("");
  const customers = [
    { id: "CUS-001", name: "Rohan Sharma", email: "rohan@example.com", orders: 5, totalSpent: 32499 },
    { id: "CUS-002", name: "Priya Verma", email: "priya@example.com", orders: 2, totalSpent: 4999 },
  ];
  const filtered = customers.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.email.toLowerCase().includes(q.toLowerCase()));

  return (
    <VendorLayout activeTab="customers">
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">Customers</h1>
            <p className="text-muted-foreground">Your buyers and their lifetime value.</p>
          </div>
          <Input placeholder="Search customers..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        </div>

        <Card>
          <CardHeader><CardTitle>Customer List</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead className="text-right">Total Spent (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.id}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.orders}</TableCell>
                    <TableCell className="text-right">{c.totalSpent.toLocaleString("en-IN")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
}
