import { useState } from "react";
import {
  Package,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Search,
  Filter,
  Download,
  Upload,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { VendorLayout } from "../components/VendorLayout";

export default function VendorInventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  // Mock inventory data
  const inventory = [
    {
      id: "1",
      productId: "PRD-001",
      name: "Premium Wireless Headphones",
      sku: "AWH-001",
      currentStock: 45,
      lowStockThreshold: 10,
      reservedStock: 5,
      availableStock: 40,
      cost: 150.0,
      price: 299.99,
      lastRestocked: "2024-03-01",
      reorderLevel: 20,
      maxStock: 100,
      supplier: "AudioTech Supplies",
      location: "Warehouse A, Shelf 12",
    },
    {
      id: "2",
      productId: "PRD-002",
      name: "Smart Fitness Watch",
      sku: "SFW-001",
      currentStock: 8,
      lowStockThreshold: 15,
      reservedStock: 3,
      availableStock: 5,
      cost: 120.0,
      price: 199.99,
      lastRestocked: "2024-02-28",
      reorderLevel: 25,
      maxStock: 80,
      supplier: "FitTech Corp",
      location: "Warehouse B, Shelf 5",
    },
    {
      id: "3",
      productId: "PRD-003",
      name: "Bluetooth Speaker",
      sku: "BTS-001",
      currentStock: 0,
      lowStockThreshold: 10,
      reservedStock: 0,
      availableStock: 0,
      cost: 45.0,
      price: 89.99,
      lastRestocked: "2024-02-15",
      reorderLevel: 15,
      maxStock: 60,
      supplier: "SoundWave Ltd",
      location: "Warehouse A, Shelf 8",
    },
    {
      id: "4",
      productId: "PRD-004",
      name: "Wireless Mouse",
      sku: "WM-001",
      currentStock: 78,
      lowStockThreshold: 20,
      reservedStock: 12,
      availableStock: 66,
      cost: 15.0,
      price: 39.99,
      lastRestocked: "2024-03-05",
      reorderLevel: 30,
      maxStock: 120,
      supplier: "TechParts Inc",
      location: "Warehouse B, Shelf 15",
    },
  ];

  const getStockStatus = (item: any) => {
    if (item.currentStock === 0)
      return {
        status: "out_of_stock",
        label: "Out of Stock",
        color: "bg-red-100 text-red-800",
      };
    if (item.currentStock <= item.lowStockThreshold)
      return {
        status: "low_stock",
        label: "Low Stock",
        color: "bg-yellow-100 text-yellow-800",
      };
    if (item.currentStock >= item.maxStock * 0.9)
      return {
        status: "overstocked",
        label: "Overstocked",
        color: "bg-purple-100 text-purple-800",
      };
    return {
      status: "in_stock",
      label: "In Stock",
      color: "bg-green-100 text-green-800",
    };
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesFilter = true;
    if (stockFilter === "low_stock")
      matchesFilter = item.currentStock <= item.lowStockThreshold;
    else if (stockFilter === "out_of_stock")
      matchesFilter = item.currentStock === 0;
    else if (stockFilter === "overstocked")
      matchesFilter = item.currentStock >= item.maxStock * 0.9;
    else if (stockFilter === "in_stock")
      matchesFilter = item.currentStock > item.lowStockThreshold;

    return matchesSearch && matchesFilter;
  });

  const stockStats = {
    totalProducts: inventory.length,
    totalValue: inventory.reduce(
      (sum, item) => sum + item.currentStock * item.cost,
      0,
    ),
    lowStockItems: inventory.filter(
      (item) =>
        item.currentStock <= item.lowStockThreshold && item.currentStock > 0,
    ).length,
    outOfStockItems: inventory.filter((item) => item.currentStock === 0).length,
    totalStock: inventory.reduce((sum, item) => sum + item.currentStock, 0),
  };

  return (
    <VendorLayout activeTab="inventory">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Inventory Management</h1>
            <p className="text-muted-foreground">
              Track and manage your product stock levels
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Package className="h-4 w-4 mr-2" />
              Restock Items
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Products
                  </p>
                  <p className="text-2xl font-bold">
                    {stockStats.totalProducts}
                  </p>
                </div>
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Stock Value
                  </p>
                  <p className="text-2xl font-bold">
                    ${stockStats.totalValue.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-bold">{stockStats.totalStock}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stockStats.lowStockItems}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stockStats.outOfStockItems}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by product name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="in_stock">In Stock</SelectItem>
              <SelectItem value="low_stock">Low Stock</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              <SelectItem value="overstocked">Overstocked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Reserved</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Last Restocked</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => {
                    const stockStatus = getStockStatus(item);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.location}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.sku}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {item.currentStock}
                            </span>
                            {item.currentStock <= item.lowStockThreshold && (
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{item.availableStock}</TableCell>
                        <TableCell>{item.reservedStock}</TableCell>
                        <TableCell>
                          <Badge className={stockStatus.color}>
                            {stockStatus.label}
                          </Badge>
                        </TableCell>
                        <TableCell>${item.cost.toFixed(2)}</TableCell>
                        <TableCell>
                          ${(item.currentStock * item.cost).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {new Date(item.lastRestocked).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              Adjust
                            </Button>
                            <Button size="sm" variant="outline">
                              Restock
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Stock Movement History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Stock Movements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  type: "restock",
                  product: "Premium Wireless Headphones",
                  quantity: 25,
                  date: "2024-03-01",
                  reason: "Purchase Order #PO-2024-001",
                },
                {
                  type: "sale",
                  product: "Smart Fitness Watch",
                  quantity: -3,
                  date: "2024-03-05",
                  reason: "Order #ORD-123456",
                },
                {
                  type: "adjustment",
                  product: "Bluetooth Speaker",
                  quantity: -2,
                  date: "2024-03-03",
                  reason: "Damaged items removed",
                },
                {
                  type: "restock",
                  product: "Wireless Mouse",
                  quantity: 30,
                  date: "2024-03-05",
                  reason: "Purchase Order #PO-2024-002",
                },
              ].map((movement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        movement.type === "restock"
                          ? "bg-green-500"
                          : movement.type === "sale"
                            ? "bg-blue-500"
                            : "bg-orange-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium">{movement.product}</p>
                      <p className="text-sm text-muted-foreground">
                        {movement.reason}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${movement.quantity > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {movement.quantity > 0 ? "+" : ""}
                      {movement.quantity}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {movement.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
}
