import {
  ArrowRight,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  Smartphone,
  Headphones,
  Camera,
  Home,
  Shirt,
  Heart,
  Gift,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { ProductCard } from "../components/ProductCard";
import { VendorCard } from "../components/VendorCard";
import { CategoryCard } from "../components/CategoryCard";

export default function Index() {
  // Sample data for demonstration
  const featuredProducts = [
    {
      id: "1",
      name: "Premium Wireless Headphones with Noise Cancellation",
      price: 299.99,
      originalPrice: 399.99,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      vendor: "AudioTech",
      rating: 4.8,
      reviewCount: 324,
      isNew: true,
      discount: 25,
    },
    {
      id: "2",
      name: "Smart Fitness Watch with Heart Rate Monitor",
      price: 199.99,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      vendor: "FitGear",
      rating: 4.6,
      reviewCount: 892,
      isFeatured: true,
    },
    {
      id: "3",
      name: "Professional Camera Lens 85mm f/1.4",
      price: 1299.99,
      image:
        "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop",
      vendor: "OpticsPro",
      rating: 4.9,
      reviewCount: 156,
    },
    {
      id: "4",
      name: "Organic Cotton T-Shirt Collection",
      price: 39.99,
      originalPrice: 59.99,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      vendor: "EcoWear",
      rating: 4.4,
      reviewCount: 203,
      discount: 33,
    },
  ];

  const topVendors = [
    {
      id: "1",
      name: "TechGlobal",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop",
      coverImage:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop",
      description:
        "Leading provider of cutting-edge electronics and smart devices for modern lifestyle.",
      location: "San Francisco, CA",
      rating: 4.8,
      reviewCount: 2847,
      productCount: 284,
      isVerified: true,
      categories: ["Electronics", "Smart Home", "Gadgets"],
    },
    {
      id: "2",
      name: "StyleCraft",
      logo: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
      coverImage:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop",
      description:
        "Curated fashion and lifestyle products from emerging designers worldwide.",
      location: "New York, NY",
      rating: 4.7,
      reviewCount: 1293,
      productCount: 156,
      isVerified: true,
      categories: ["Fashion", "Lifestyle", "Accessories"],
    },
    {
      id: "3",
      name: "HomeComfort",
      logo: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=100&h=100&fit=crop",
      coverImage:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=200&fit=crop",
      description:
        "Transform your living space with premium home decor and furniture collections.",
      location: "Austin, TX",
      rating: 4.6,
      reviewCount: 967,
      productCount: 203,
      categories: ["Home & Garden", "Furniture", "Decor"],
    },
  ];

  const categories = [
    {
      id: "1",
      name: "Electronics",
      image:
        "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=300&h=300&fit=crop",
      productCount: 1247,
      icon: <Smartphone className="h-6 w-6" />,
    },
    {
      id: "2",
      name: "Fashion",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=300&fit=crop",
      productCount: 892,
      icon: <Shirt className="h-6 w-6" />,
    },
    {
      id: "3",
      name: "Home & Garden",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
      productCount: 634,
      icon: <Home className="h-6 w-6" />,
    },
    {
      id: "4",
      name: "Audio",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      productCount: 423,
      icon: <Headphones className="h-6 w-6" />,
    },
    {
      id: "5",
      name: "Photography",
      image:
        "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=300&fit=crop",
      productCount: 256,
      icon: <Camera className="h-6 w-6" />,
    },
    {
      id: "6",
      name: "Gifts",
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop",
      productCount: 189,
      icon: <Gift className="h-6 w-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-purple-50 dark:from-primary/5 dark:to-background">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
                Discover Amazing
                <span
                  className="text-primary block animate-bounce-subtle"
                  style={{ animationDelay: "0.5s" }}
                >
                  Products
                </span>
                From Global Vendors
              </h1>
              <p
                className="text-lg text-muted-foreground mb-8 max-w-lg animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                Connect with thousands of trusted sellers worldwide. Find unique
                products, compare prices, and shop with confidence on MarketHub.
              </p>
              <div
                className="flex flex-col sm:flex-row gap-4 animate-scale-in"
                style={{ animationDelay: "0.6s" }}
              >
                <Button
                  size="lg"
                  className="text-lg px-8 hover-lift hover-glow"
                  asChild
                >
                  <a href="/products">
                    Start Shopping
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 hover-lift"
                  asChild
                >
                  <a href="/become-seller">Become a Seller</a>
                </Button>
              </div>
            </div>

            <div className="relative animate-slide-in-right">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=400&fit=crop"
                  alt="Featured Product 1"
                  className="rounded-lg shadow-lg hover-lift"
                />
                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=400&fit=crop"
                  alt="Featured Product 2"
                  className="rounded-lg shadow-lg mt-8 hover-lift"
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16 pt-16 border-t stagger-animation">
            <div className="text-center hover-scale">
              <div className="flex justify-center mb-2">
                <ShoppingBag className="h-8 w-8 text-primary animate-pulse-soft" />
              </div>
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-sm text-muted-foreground">Products</div>
            </div>
            <div className="text-center hover-scale">
              <div className="flex justify-center mb-2">
                <Users className="h-8 w-8 text-primary animate-pulse-soft" />
              </div>
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-muted-foreground">Vendors</div>
            </div>
            <div className="text-center hover-scale">
              <div className="flex justify-center mb-2">
                <Package className="h-8 w-8 text-primary animate-pulse-soft" />
              </div>
              <div className="text-2xl font-bold">50K+</div>
              <div className="text-sm text-muted-foreground">Orders</div>
            </div>
            <div className="text-center hover-scale">
              <div className="flex justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-primary animate-pulse-soft" />
              </div>
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse range of categories and find exactly what
              you're looking for
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 stagger-animation">
            {categories.map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
              <p className="text-muted-foreground">
                Handpicked products from our top vendors
              </p>
            </div>
            <Button variant="outline" asChild>
              <a href="/products">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Vendors */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Top Vendors</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover trusted sellers with exceptional products and service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topVendors.map((vendor) => (
              <VendorCard key={vendor.id} {...vendor} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <a href="/vendors">
                View All Vendors
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
