import { useState, useEffect } from "react";
import { Filter, Grid, List, SlidersHorizontal, X, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { ProductCard } from "../components/ProductCard";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import { products } from "../data/products";
import { formatPrice, formatPriceRange } from "../lib/currency";

export default function Products() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 120000]); // Updated for INR range
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  // Get category from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    if (category) {
      setSelectedCategory(category);
    }
  }, []);

  // Get unique categories from products
  const categories = Array.from(
    new Set(products.map((p) => p.category)),
  ).sort();

  // Filter products based on criteria
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesCategory && matchesSearch && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      default: // featured
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    }
  });

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setPriceRange([0, 120000]); // Updated for INR range
    setSortBy("featured");
    // Update URL to remove category parameter
    const url = new URL(window.location.href);
    url.searchParams.delete("category");
    window.history.replaceState({}, "", url.toString());
  };

  const formatCategoryName = (category: string) => {
    return category
      .split(" & ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" & ");
  };

  const activeFiltersCount = [
    selectedCategory !== "all" ? selectedCategory : null,
    searchTerm,
    ...(priceRange[0] > 0 || priceRange[1] < 120000 ? ["price"] : []),
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">
            {selectedCategory !== "all"
              ? `${formatCategoryName(selectedCategory)} Products`
              : "All Products"}
          </h1>
          <p className="text-muted-foreground">
            {selectedCategory !== "all"
              ? `Explore our collection of ${selectedCategory} products`
              : "Discover amazing products from trusted vendors worldwide"}
          </p>
          {selectedCategory !== "all" && (
            <Badge
              variant="secondary"
              className="mt-2 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
              onClick={clearFilters}
            >
              {formatCategoryName(selectedCategory)}{" "}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
        </div>

        {/* Search and Filters Bar */}
        <div className="mb-8 animate-slide-in-left">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {formatCategoryName(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Customer Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode and Filters Toggle */}
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear All ({activeFiltersCount})
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="hover-scale"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <div className="flex gap-1 border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="hover-scale"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="hover-scale"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="bg-muted/50 p-6 rounded-lg mb-6 animate-scale-in">
              <h3 className="font-semibold mb-4">Advanced Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Price Range:{" "}
                    {formatPriceRange(priceRange[0], priceRange[1])}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={120000}
                    step={1000}
                    className="w-full"
                  />
                </div>

                {/* Brand Filters */}
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Popular Brands
                  </label>
                  <div className="space-y-2">
                    {[
                      "Apple Store",
                      "Samsung Official",
                      "AudioTech",
                      "StyleCraft",
                      "FitGear",
                    ].map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox id={`brand-${brand}`} />
                        <label
                          htmlFor={`brand-${brand}`}
                          className="text-sm cursor-pointer"
                        >
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Features
                  </label>
                  <div className="space-y-2">
                    {[
                      "New Arrivals",
                      "Featured",
                      "On Sale",
                      "Free Shipping",
                    ].map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox id={`feature-${feature}`} />
                        <label
                          htmlFor={`feature-${feature}`}
                          className="text-sm cursor-pointer"
                        >
                          {feature}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 animate-slide-in-right">
          <p className="text-muted-foreground">
            Showing {sortedProducts.length} of {products.length} products
            {selectedCategory !== "all" &&
              ` in ${formatCategoryName(selectedCategory)}`}
          </p>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div
            className={`animate-fade-in ${
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-animation"
                : "space-y-4"
            }`}
          >
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          /* No Results */
          <div className="text-center py-12 animate-fade-in">
            <div className="text-muted-foreground mb-4">
              <Search className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p>Try adjusting your search terms or filters</p>
            </div>
            <Button onClick={clearFilters} className="mt-4">
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Load More Button */}
        {sortedProducts.length > 0 &&
          sortedProducts.length === filteredProducts.length && (
            <div className="text-center mt-12 animate-fade-in">
              <Button variant="outline" size="lg" className="hover-glow">
                Load More Products
              </Button>
            </div>
          )}

        {/* Popular Categories Quick Access */}
        <section className="mt-16 animate-slide-in-left">
          <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              className="hover-scale h-auto py-3 px-4"
              onClick={() => {
                setSelectedCategory("all");
                const url = new URL(window.location.href);
                url.searchParams.delete("category");
                window.history.replaceState({}, "", url.toString());
              }}
            >
              <span className="text-sm">All Categories</span>
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="hover-scale h-auto py-3 px-4"
                onClick={() => {
                  setSelectedCategory(category);
                  const url = new URL(window.location.href);
                  url.searchParams.set("category", category);
                  window.history.replaceState({}, "", url.toString());
                }}
              >
                <span className="text-sm">{formatCategoryName(category)}</span>
              </Button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
