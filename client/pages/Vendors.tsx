import { useState } from "react";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Package,
  Truck,
  Shield,
  Users,
  Calendar,
  ChevronRight,
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
import { Link } from "react-router-dom";

export default function Vendors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  // Mock vendor data
  const vendors = [
    {
      id: "vendor-1",
      name: "TechGear Pro",
      description:
        "Premium technology accessories and gadgets for modern lifestyle",
      logo: "https://images.unsplash.com/photo-1560472355-536de3962603?w=100&h=100&fit=crop",
      coverImage:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop",
      rating: 4.8,
      reviewCount: 2847,
      productCount: 156,
      category: "Electronics",
      location: "Mumbai, Maharashtra",
      joinedDate: "2022-03-15",
      isVerified: true,
      isFeatured: true,
      totalSales: "50K+",
      responseTime: "< 2 hours",
      shippingTime: "1-2 days",
      tags: ["Fast Shipping", "Premium Quality", "24/7 Support"],
    },
    {
      id: "vendor-2",
      name: "Fashion Forward",
      description: "Trendy clothing and fashion accessories for all occasions",
      logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop",
      coverImage:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop",
      rating: 4.6,
      reviewCount: 1923,
      productCount: 289,
      category: "Fashion",
      location: "Delhi, Delhi",
      joinedDate: "2021-08-22",
      isVerified: true,
      isFeatured: false,
      totalSales: "75K+",
      responseTime: "< 4 hours",
      shippingTime: "2-3 days",
      tags: ["Trendy", "Affordable", "Wide Range"],
    },
    {
      id: "vendor-3",
      name: "Home & Living Co.",
      description: "Beautiful home decor and furniture for your perfect space",
      logo: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop",
      coverImage:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=200&fit=crop",
      rating: 4.7,
      reviewCount: 856,
      productCount: 94,
      category: "Home & Garden",
      location: "Bangalore, Karnataka",
      joinedDate: "2022-11-10",
      isVerified: true,
      isFeatured: true,
      totalSales: "25K+",
      responseTime: "< 6 hours",
      shippingTime: "3-5 days",
      tags: ["Quality Furniture", "Custom Design", "Expert Advice"],
    },
    {
      id: "vendor-4",
      name: "Sports Arena",
      description:
        "Sports equipment and fitness gear for athletes and enthusiasts",
      logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
      coverImage:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop",
      rating: 4.5,
      reviewCount: 1234,
      productCount: 178,
      category: "Sports",
      location: "Pune, Maharashtra",
      joinedDate: "2021-12-03",
      isVerified: true,
      isFeatured: false,
      totalSales: "40K+",
      responseTime: "< 3 hours",
      shippingTime: "2-4 days",
      tags: ["Professional Grade", "Durable", "Competitive Prices"],
    },
    {
      id: "vendor-5",
      name: "BookWorm Paradise",
      description:
        "Vast collection of books, stationery, and educational materials",
      logo: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop",
      coverImage:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop",
      rating: 4.9,
      reviewCount: 687,
      productCount: 423,
      category: "Books",
      location: "Chennai, Tamil Nadu",
      joinedDate: "2020-06-18",
      isVerified: true,
      isFeatured: true,
      totalSales: "30K+",
      responseTime: "< 1 hour",
      shippingTime: "1-3 days",
      tags: ["Rare Books", "Educational", "Quick Delivery"],
    },
    {
      id: "vendor-6",
      name: "Beauty Bliss",
      description: "Premium beauty products and cosmetics for all skin types",
      logo: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100&h=100&fit=crop",
      coverImage:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=200&fit=crop",
      rating: 4.4,
      reviewCount: 1567,
      productCount: 201,
      category: "Beauty",
      location: "Hyderabad, Telangana",
      joinedDate: "2022-01-09",
      isVerified: false,
      isFeatured: false,
      totalSales: "20K+",
      responseTime: "< 8 hours",
      shippingTime: "2-5 days",
      tags: ["Natural Products", "Cruelty-Free", "Dermatologist Tested"],
    },
    {
      id: "vendor-7",
      name: "Otaku Paradise",
      description:
        "Your ultimate destination for anime figures, manga, and collectibles",
      logo: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop",
      coverImage:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop",
      rating: 4.9,
      reviewCount: 2847,
      productCount: 423,
      category: "Anime & Manga",
      location: "Tokyo, Japan",
      joinedDate: "2020-05-12",
      isVerified: true,
      isFeatured: true,
      totalSales: "100K+",
      responseTime: "< 1 hour",
      shippingTime: "3-7 days",
      tags: ["Authentic Items", "Limited Edition", "Global Shipping"],
    },
  ];

  const categories = [
    "Electronics",
    "Fashion",
    "Home & Garden",
    "Sports",
    "Books",
    "Beauty",
    "Toys",
    "Automotive",
    "Anime & Manga",
  ];

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || vendor.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedVendors = [...filteredVendors].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "products":
        return b.productCount - a.productCount;
      case "sales":
        return parseInt(b.totalSales) - parseInt(a.totalSales);
      case "newest":
        return (
          new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
        );
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Our Vendors</h1>
          <p className="text-muted-foreground">
            Discover amazing vendors and explore their products
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search vendors, categories, or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="products">Most Products</SelectItem>
              <SelectItem value="sales">Best Selling</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {vendors.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Active Vendors
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {vendors.reduce((sum, v) => sum + v.productCount, 0)}+
              </div>
              <div className="text-sm text-muted-foreground">
                Total Products
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {vendors.filter((v) => v.isVerified).length}
              </div>
              <div className="text-sm text-muted-foreground">
                Verified Vendors
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">4.7</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Vendor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedVendors.map((vendor) => (
            <Card
              key={vendor.id}
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Cover Image */}
              <div className="relative h-32 bg-gradient-to-r from-purple-400 to-blue-500 overflow-hidden">
                <img
                  src={vendor.coverImage}
                  alt={`${vendor.name} cover`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {vendor.isFeatured && (
                    <Badge className="bg-yellow-500 text-yellow-900">
                      Featured
                    </Badge>
                  )}
                  {vendor.isVerified && (
                    <Badge className="bg-green-500 text-green-900">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-6">
                {/* Vendor Logo and Info */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={vendor.logo}
                    alt={`${vendor.name} logo`}
                    className="w-16 h-16 rounded-lg object-cover border-2 border-background shadow-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{vendor.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {vendor.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{vendor.rating}</span>
                        <span className="text-muted-foreground">
                          ({vendor.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{vendor.productCount} Products</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{vendor.totalSales} Sales</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{vendor.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span>{vendor.shippingTime}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {vendor.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {vendor.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{vendor.tags.length - 2}
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" asChild>
                    <Link to={`/vendor/${vendor.id}`}>
                      View Store
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/products?vendor=${vendor.id}`}>Products</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedVendors.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No vendors found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters to find vendors
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Want to Become a Vendor?
            </h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of successful vendors on MarketHub and grow your
              business
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/register?type=seller">
                  Start Selling
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/become-seller">Learn More</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
