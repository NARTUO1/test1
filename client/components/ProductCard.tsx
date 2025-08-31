import { Heart, Star, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { formatPrice } from "../lib/currency";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  vendor: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  vendor,
  rating,
  reviewCount,
  isNew,
  isFeatured,
  discount,
}: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id,
      name,
      price,
      image,
      vendor,
      maxStock: 10, // Default stock limit
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      id,
      name,
      price,
      originalPrice,
      image,
      vendor,
      rating,
      reviewCount,
      inStock: true,
      dateAdded: new Date().toISOString(),
    });
  };
  return (
    <Card className="group relative overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-card hover-lift hover-glow">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && (
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 hover:bg-green-100"
            >
              New
            </Badge>
          )}
          {isFeatured && (
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-800 hover:bg-purple-100"
            >
              Featured
            </Badge>
          )}
          {discount && (
            <Badge variant="destructive" className="bg-red-500 text-white">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white shadow-sm"
          onClick={handleToggleWishlist}
        >
          <Heart
            className={`h-4 w-4 ${isInWishlist(id) ? "fill-current text-red-500" : ""}`}
          />
        </Button>

        {/* Quick Add to Cart - Appears on hover */}
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            className="w-full bg-white text-black hover:bg-gray-100"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Vendor */}
        <p className="text-xs text-muted-foreground mb-1">{vendor}</p>

        {/* Product Name */}
        <Link to={`/product/${id}`}>
          <h3 className="font-medium text-sm leading-tight mb-2 line-clamp-2 hover:text-primary cursor-pointer transition-colors">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {rating} ({reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg">{formatPrice(price)}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
