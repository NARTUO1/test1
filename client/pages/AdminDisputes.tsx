import {
  Search,
  Filter,
  MoreHorizontal,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle,
  FileText,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { AdminLayout } from "../components/AdminLayout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";

export default function AdminDisputes() {
  const disputes = [
    {
      id: "DIS-001",
      orderId: "ORD-001238",
      customer: "Alex Rodriguez",
      vendor: "HomeComfort Living",
      type: "Product Quality",
      status: "open",
      priority: "high",
      amount: 234.98,
      createdDate: "2024-03-20",
      lastUpdate: "2024-03-22",
      description: "Product arrived damaged and doesn't match the description",
      messages: 3,
    },
    {
      id: "DIS-002",
      orderId: "ORD-001156",
      customer: "Sarah Johnson",
      vendor: "TechPro Solutions",
      type: "Shipping Issue",
      status: "in_progress",
      priority: "medium",
      amount: 459.99,
      createdDate: "2024-03-18",
      lastUpdate: "2024-03-21",
      description:
        "Package never arrived, tracking shows delivered but customer didn't receive",
      messages: 7,
    },
    {
      id: "DIS-003",
      orderId: "ORD-001089",
      customer: "Mike Chen",
      vendor: "StyleCraft Fashion",
      type: "Refund Request",
      status: "resolved",
      priority: "low",
      amount: 89.99,
      createdDate: "2024-03-15",
      lastUpdate: "2024-03-19",
      description: "Customer wants to return item due to size issues",
      messages: 5,
    },
    {
      id: "DIS-004",
      orderId: "ORD-001201",
      customer: "Emily Davis",
      vendor: "FitGear Pro",
      type: "Wrong Item",
      status: "escalated",
      priority: "urgent",
      amount: 199.99,
      createdDate: "2024-03-22",
      lastUpdate: "2024-03-23",
      description: "Received completely different product than ordered",
      messages: 2,
    },
    {
      id: "DIS-005",
      orderId: "ORD-001134",
      customer: "John Smith",
      vendor: "AudioTech Store",
      type: "Payment Issue",
      status: "closed",
      priority: "medium",
      amount: 129.99,
      createdDate: "2024-03-10",
      lastUpdate: "2024-03-17",
      description: "Double charged for the same order",
      messages: 4,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "escalated":
        return "bg-orange-100 text-orange-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="h-3 w-3" />;
      case "in_progress":
        return <Clock className="h-3 w-3" />;
      case "escalated":
        return <AlertTriangle className="h-3 w-3" />;
      case "resolved":
        return <CheckCircle className="h-3 w-3" />;
      case "closed":
        return <XCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <AdminLayout activeTab="disputes">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Dispute Management</h1>
            <p className="text-muted-foreground">
              Handle customer disputes and resolution processes
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Export Disputes</Button>
            <Button>Create Manual Dispute</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Disputes
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">Being resolved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">287</div>
              <p className="text-xs text-muted-foreground">
                84% resolution rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Resolution
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.3 days</div>
              <p className="text-xs text-muted-foreground">Average time</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Search disputes..." className="pl-10" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="escalated">Escalated</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dispute ID</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disputes.map((dispute) => (
                  <TableRow key={dispute.id}>
                    <TableCell>
                      <div className="font-medium">{dispute.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{dispute.orderId}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{dispute.customer}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{dispute.vendor}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{dispute.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(dispute.priority)}>
                        {dispute.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(dispute.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(dispute.status)}
                          {dispute.status.replace("_", " ")}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">${dispute.amount}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{dispute.createdDate}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            View Messages ({dispute.messages})
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Order</DropdownMenuItem>
                          <DropdownMenuItem>Contact Customer</DropdownMenuItem>
                          <DropdownMenuItem>Contact Vendor</DropdownMenuItem>
                          {dispute.status === "open" && (
                            <DropdownMenuItem className="text-yellow-600">
                              Mark In Progress
                            </DropdownMenuItem>
                          )}
                          {(dispute.status === "open" ||
                            dispute.status === "in_progress") && (
                            <>
                              <DropdownMenuItem className="text-green-600">
                                Resolve Dispute
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-orange-600">
                                Escalate to Manager
                              </DropdownMenuItem>
                            </>
                          )}
                          {dispute.status === "resolved" && (
                            <DropdownMenuItem className="text-gray-600">
                              Close Dispute
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Resolution Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg space-y-3">
                <div className="font-semibold">Bulk Actions</div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Mark Selected as In Progress
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Send Bulk Update
                  </Button>
                </div>
              </div>
              <div className="p-4 border rounded-lg space-y-3">
                <div className="font-semibold">Templates</div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Refund Processing
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Shipping Investigation
                  </Button>
                </div>
              </div>
              <div className="p-4 border rounded-lg space-y-3">
                <div className="font-semibold">Reports</div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Monthly Dispute Report
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Vendor Dispute Analytics
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
