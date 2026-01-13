import { useEffect, useState } from "react";
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
import { LoadingSpinner } from "../components/LoadingSpinner";

interface Category {
  id: number;
  name: string;
  image_url?: string;
  description?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  discount_price?: number;
  image_url?: string;
  vendor_name?: string;
  rating?: number;
  review_count?: number;
  featured?: boolean;
}

interface Vendor {
  id: number;
  business_name: string;
  business_description?: string;
  is_verified?: boolean;
}

export default function Index() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    productCount: 0,
    vendorCount: 0,
    orderCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const categoriesRes = await fetch("/api/categories");
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData.data || categoriesData.categories || []);
        }

        // Fetch featured products
        const productsRes = await fetch("/api/products?featured=true&limit=4");
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          const products = Array.isArray(productsData)
            ? productsData
            : productsData.data || [];

          // Map database fields to component fields
          const mappedProducts = products.map((p: any) => ({
            ...p,
            image: p.image_url,
            originalPrice: p.discount_price,
            vendor: p.vendor_name || "Unknown Vendor",
            rating: p.rating || 4.5,
            reviewCount: p.review_count || 0,
          }));
          setFeaturedProducts(mappedProducts.slice(0, 4));
        }

        // Fetch vendors for display
        const vendorsRes = await fetch("/api/vendors");
        if (vendorsRes.ok) {
          const vendorsData = await vendorsRes.json();
          const vendorsList = Array.isArray(vendorsData)
            ? vendorsData
            : vendorsData.data || [];
          setVendors(vendorsList.slice(0, 3));
        }

        // Update stats
        setStats({
          productCount: Math.floor(Math.random() * 5000) + 5000,
          vendorCount: Math.floor(Math.random() * 200) + 300,
          orderCount: Math.floor(Math.random() * 30000) + 20000,
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categoryIcons: Record<string, React.ReactNode> = {
    Electronics: <Smartphone className="h-6 w-6" />,
    Clothing: <Shirt className="h-6 w-6" />,
    "Home & Garden": <Home className="h-6 w-6" />,
    "Sports & Outdoors": <Heart className="h-6 w-6" />,
    "Books & Media": <Package className="h-6 w-6" />,
    "Health & Beauty": <Heart className="h-6 w-6" />,
    Automotive: <Package className="h-6 w-6" />,
    "Food & Beverages": <Package className="h-6 w-6" />,
    Photography: <Camera className="h-6 w-6" />,
    Audio: <Headphones className="h-6 w-6" />,
    Gifts: <Gift className="h-6 w-6" />,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

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
              <div className="text-2xl font-bold">
                {Math.floor(stats.productCount / 1000)}K+
              </div>
              <div className="text-sm text-muted-foreground">Products</div>
            </div>
            <div className="text-center hover-scale">
              <div className="flex justify-center mb-2">
                <Users className="h-8 w-8 text-primary animate-pulse-soft" />
              </div>
              <div className="text-2xl font-bold">
                {Math.floor(stats.vendorCount / 100)}+
              </div>
              <div className="text-sm text-muted-foreground">Vendors</div>
            </div>
            <div className="text-center hover-scale">
              <div className="flex justify-center mb-2">
                <Package className="h-8 w-8 text-primary animate-pulse-soft" />
              </div>
              <div className="text-2xl font-bold">
                {Math.floor(stats.orderCount / 1000)}K+
              </div>
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
              <CategoryCard
                key={category.id}
                id={String(category.id)}
                name={category.name}
                image={category.image_url || ""}
                productCount={0}
                icon={
                  categoryIcons[
                    category.name as keyof typeof categoryIcons
                  ] || <Package className="h-6 w-6" />
                }
              />
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
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={String(product.id)}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.discount_price}
                  image={product.image_url || ""}
                  vendor={product.vendor_name || "Unknown Vendor"}
                  rating={product.rating || 0}
                  reviewCount={product.review_count || 0}
                />
              ))
            ) : (
              <div className="col-span-4 text-center py-8">
                <p className="text-muted-foreground">
                  No featured products available
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Top Vendors */}
      {vendors.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Top Vendors</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover trusted sellers with exceptional products and service
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vendors.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  id={String(vendor.id)}
                  name={vendor.business_name}
                  description={vendor.business_description || "Premium seller"}
                  isVerified={vendor.is_verified || false}
                />
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
      )}
    </div>
  );
}
