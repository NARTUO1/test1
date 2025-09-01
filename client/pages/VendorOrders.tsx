import { useState } from "react";
import { VendorLayout } from "@/components/VendorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function VendorOrders() {
  const [status, setStatus] = useState<string>("all");
  const [query, setQuery] = useState("");

  const orders = [
    { id: "ORD-1001", customer: "Rahul Kumar", total: 2599, status: "pending", date: "2025-08-01" },
    { id: "ORD-1000", customer: "Ananya Singh", total: 12999, status: "shipped", date: "2025-08-01" },
    { id: "ORD-0999", customer: "Vikram Patel", total: 899, status: "delivered", date: "2025-07-31" },
  ];

  const filtered = orders.filter((o) => (status === "all" || o.status === status) && (o.id.toLowerCase().includes(query.toLowerCase()) || o.customer.toLowerCase().includes(query.toLowerCase())));

  return (
    <VendorLayout activeTab="orders">
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground">Manage, fulfill, and track your orders.</p>
          </div>
          <div className="flex gap-3">
            <Input placeholder="Search orders..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Export</Button>
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>{o.id}</TableCell>
                    <TableCell>{o.customer}</TableCell>
                    <TableCell className="capitalize">{o.status}</TableCell>
                    <TableCell className="text-right">{o.total.toLocaleString("en-IN")}</TableCell>
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
