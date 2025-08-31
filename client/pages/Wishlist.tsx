import { useState } from "react";
import { Heart, ShoppingCart, Trash2, Filter, Grid, List } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";

export default function Wishlist() {
  const { state: wishlistState, removeItem, clearWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      vendor: item.vendor,
      maxStock: 10,
    });
  };

  const handleRemoveFromWishlist = (id: string) => {
    removeItem(id);
  };

  const filteredItems = wishlistState.items.filter((item) => {
    if (filterBy === "all") return true;
    if (filterBy === "in-stock") return item.inStock;
    if (filterBy === "out-of-stock") return !item.inStock;
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
      case "oldest":
        return (
          new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
        );
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  if (wishlistState.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Heart className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Save items you love by clicking the heart icon on any product.
              We'll keep them safe here for you!
            </p>
            <Button size="lg" asChild>
              <a href="/products">Start Shopping</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlistState.itemCount}{" "}
              {wishlistState.itemCount === 1 ? "item" : "items"} saved for later
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearWishlist}>
              Clear All
            </Button>
            <Button asChild>
              <a href="/products">Continue Shopping</a>
            </Button>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedItems.map((item) => (
            <Card key={item.id} className="group relative overflow-hidden">
              <div className="relative aspect-square">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />

                {!item.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive" className="text-white">
                      Out of Stock
                    </Badge>
                  </div>
                )}

                {/* Remove Button */}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveFromWishlist(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                {/* Quick Add to Cart */}
                {item.inStock && (
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                <div className="space-y-2">
                  {/* Vendor */}
                  <p className="text-xs text-muted-foreground">{item.vendor}</p>

                  {/* Product Name */}
                  <h3 className="font-medium line-clamp-2 leading-tight">
                    <a
                      href={`/product/${item.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {item.name}
                    </a>
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-muted-foreground">
                      {item.rating} ({item.reviewCount})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      ${item.price.toFixed(2)}
                    </span>
                    {item.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Date Added */}
                  <p className="text-xs text-muted-foreground">
                    Added {new Date(item.dateAdded).toLocaleDateString()}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {item.inStock ? (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        disabled
                      >
                        Out of Stock
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State for Filtered Results */}
        {sortedItems.length === 0 && wishlistState.items.length > 0 && (
          <div className="text-center py-16">
            <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No items found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters to see more items.
            </p>
            <Button variant="outline" onClick={() => setFilterBy("all")}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Recommendations */}
        {wishlistState.items.length > 0 && (
          <div className="mt-16 pt-16 border-t">
            <h2 className="text-2xl font-bold mb-6">You might also like</h2>
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Discover more products based on your wishlist
              </p>
              <Button asChild>
                <a href="/products">Browse Products</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
