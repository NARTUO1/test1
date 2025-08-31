import {
  Search,
  Filter,
  Grid,
  List,
  Smartphone,
  Shirt,
  Home,
  Headphones,
  Camera,
  Gift,
  Utensils,
  Dumbbell,
  BookOpen,
  Baby,
  Car,
  Heart,
  Zap,
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
import { CategoryCard } from "../components/CategoryCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useState } from "react";

export default function Categories() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");

  const allCategories = [
    {
      id: "1",
      name: "Electronics",
      description:
        "Latest gadgets, smartphones, computers and tech accessories",
      image:
        "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop",
      productCount: 1247,
      icon: <Smartphone className="h-6 w-6" />,
      trending: true,
      subcategories: ["Smartphones", "Laptops", "Cameras", "Audio", "Gaming"],
    },
    {
      id: "2",
      name: "Fashion",
      description:
        "Clothing, shoes, accessories and style essentials for everyone",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
      productCount: 892,
      icon: <Shirt className="h-6 w-6" />,
      trending: true,
      subcategories: [
        "Men's Clothing",
        "Women's Clothing",
        "Shoes",
        "Accessories",
        "Jewelry",
      ],
    },
    {
      id: "3",
      name: "Home & Garden",
      description: "Furniture, decor, tools and everything for your home",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      productCount: 634,
      icon: <Home className="h-6 w-6" />,
      trending: false,
      subcategories: ["Furniture", "Kitchen", "Garden", "Decor", "Storage"],
    },
    {
      id: "4",
      name: "Audio & Music",
      description: "Headphones, speakers, instruments and audio equipment",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      productCount: 423,
      icon: <Headphones className="h-6 w-6" />,
      trending: false,
      subcategories: [
        "Headphones",
        "Speakers",
        "Instruments",
        "Recording",
        "Accessories",
      ],
    },
    {
      id: "5",
      name: "Photography",
      description: "Cameras, lenses, tripods and photography equipment",
      image:
        "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop",
      productCount: 256,
      icon: <Camera className="h-6 w-6" />,
      trending: false,
      subcategories: [
        "DSLR Cameras",
        "Lenses",
        "Tripods",
        "Lighting",
        "Editing",
      ],
    },
    {
      id: "6",
      name: "Gifts & Special",
      description: "Perfect gifts for any occasion and special events",
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
      productCount: 189,
      icon: <Gift className="h-6 w-6" />,
      trending: false,
      subcategories: [
        "Birthday",
        "Anniversary",
        "Holiday",
        "Corporate",
        "Personalized",
      ],
    },
    {
      id: "7",
      name: "Food & Beverages",
      description: "Gourmet foods, beverages and kitchen essentials",
      image:
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
      productCount: 345,
      icon: <Utensils className="h-6 w-6" />,
      trending: true,
      subcategories: [
        "Organic",
        "Beverages",
        "Snacks",
        "International",
        "Dietary",
      ],
    },
    {
      id: "8",
      name: "Sports & Fitness",
      description: "Exercise equipment, sportswear and outdoor gear",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      productCount: 567,
      icon: <Dumbbell className="h-6 w-6" />,
      trending: true,
      subcategories: [
        "Fitness Equipment",
        "Sportswear",
        "Outdoor",
        "Supplements",
        "Team Sports",
      ],
    },
    {
      id: "9",
      name: "Books & Media",
      description: "Books, ebooks, magazines and educational content",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      productCount: 423,
      icon: <BookOpen className="h-6 w-6" />,
      trending: false,
      subcategories: [
        "Fiction",
        "Non-Fiction",
        "Educational",
        "Children's",
        "Digital",
      ],
    },
    {
      id: "10",
      name: "Baby & Kids",
      description: "Everything for babies, toddlers and children",
      image:
        "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=300&fit=crop",
      productCount: 312,
      icon: <Baby className="h-6 w-6" />,
      trending: false,
      subcategories: ["Baby Care", "Toys", "Clothing", "Feeding", "Safety"],
    },
    {
      id: "11",
      name: "Automotive",
      description: "Car accessories, parts and automotive tools",
      image:
        "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop",
      productCount: 234,
      icon: <Car className="h-6 w-6" />,
      trending: false,
      subcategories: ["Accessories", "Parts", "Tools", "Care", "Electronics"],
    },
    {
      id: "12",
      name: "Health & Beauty",
      description: "Skincare, makeup, wellness and personal care products",
      image:
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop",
      productCount: 445,
      icon: <Heart className="h-6 w-6" />,
      trending: true,
      subcategories: [
        "Skincare",
        "Makeup",
        "Wellness",
        "Hair Care",
        "Fragrances",
      ],
    },
    {
      id: "13",
      name: "Anime & Manga",
      description:
        "Manga books, anime figures, cosplay costumes and collectibles",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      productCount: 567,
      icon: <Zap className="h-6 w-6" />,
      trending: true,
      subcategories: [
        "Manga Books",
        "Action Figures",
        "Cosplay Costumes",
        "Plush Toys",
        "Collectibles",
      ],
    },
  ];

  const filteredCategories = allCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const trendingCategories = allCategories.filter((cat) => cat.trending);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Product Categories</h1>
          <p className="text-muted-foreground">
            Discover products across all our categories
          </p>
        </div>

        {/* Trending Categories */}
        <section className="mb-12 animate-slide-in-left">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <span className="text-orange-500">🔥</span>
            Trending Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trendingCategories.map((category) => (
              <div key={category.id} className="relative">
                <CategoryCard {...category} />
                <Badge className="absolute -top-2 -right-2 bg-orange-500 hover:bg-orange-500 animate-bounce-subtle">
                  Hot
                </Badge>
              </div>
            ))}
          </div>
        </section>

        {/* Search and Filters */}
        <div className="mb-8 animate-slide-in-right">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search categories..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="products">Most Products</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="hover-scale"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="hover-scale"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* All Categories */}
        <section className="animate-fade-in">
          <h2 className="text-2xl font-semibold mb-6">
            All Categories ({filteredCategories.length})
          </h2>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-animation">
              {filteredCategories.map((category) => (
                <CategoryCard key={category.id} {...category} />
              ))}
            </div>
          ) : (
            <div className="space-y-4 stagger-animation">
              {filteredCategories.map((category) => (
                <Card key={category.id} className="hover-lift hover-glow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {category.icon}
                          <h3 className="text-lg font-semibold">
                            {category.name}
                          </h3>
                          {category.trending && (
                            <Badge className="bg-orange-500 hover:bg-orange-500">
                              Trending
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {category.productCount} products
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {category.subcategories
                              .slice(0, 3)
                              .map((sub, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {sub}
                                </Badge>
                              ))}
                            {category.subcategories.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{category.subcategories.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No categories found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms
            </p>
          </div>
        )}

        {/* Popular Subcategories */}
        <section className="mt-16 animate-slide-in-left">
          <h2 className="text-2xl font-semibold mb-6">Popular Subcategories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              "Smartphones",
              "Laptops",
              "Women's Clothing",
              "Skincare",
              "Fitness Equipment",
              "Headphones",
              "Home Decor",
              "Cameras",
              "Books",
              "Baby Toys",
              "Car Accessories",
              "Organic Food",
              "Manga Books",
              "Anime Figures",
              "Cosplay Costumes",
              "Collectibles",
            ].map((sub, index) => (
              <Button
                key={index}
                variant="outline"
                className="hover-scale h-auto py-3 px-4"
              >
                <span className="text-sm">{sub}</span>
              </Button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
