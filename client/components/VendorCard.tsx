import { Star, MapPin, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface VendorCardProps {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  description: string;
  location: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  isVerified?: boolean;
  categories: string[];
}

export function VendorCard({
  id,
  name,
  logo,
  coverImage,
  description,
  location,
  rating,
  reviewCount,
  productCount,
  isVerified,
  categories,
}: VendorCardProps) {
  return (
    <Card className="group relative overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-card hover-lift hover-glow">
      {/* Cover Image */}
      <div className="relative h-32 overflow-hidden bg-gradient-to-r from-purple-400 to-pink-400">
        <img
          src={coverImage}
          alt={`${name} cover`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Verified Badge */}
        {isVerified && (
          <div className="absolute top-2 right-2">
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 hover:bg-green-100"
            >
              ✓ Verified
            </Badge>
          </div>
        )}
      </div>

      {/* Vendor Logo */}
      <div className="absolute top-20 left-4">
        <div className="h-16 w-16 rounded-full border-4 border-white bg-white overflow-hidden shadow-sm">
          <img
            src={logo}
            alt={`${name} logo`}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Vendor Details */}
      <div className="pt-10 p-4">
        {/* Vendor Name */}
        <h3 className="font-semibold text-lg mb-1 hover:text-primary cursor-pointer transition-colors">
          {name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
          <MapPin className="h-3 w-3" />
          <span>{location}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>

        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-3">
          {categories.slice(0, 3).map((category, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {category}
            </Badge>
          ))}
          {categories.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{categories.length - 3}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span>
                {rating} ({reviewCount})
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{productCount} products</span>
            </div>
          </div>
        </div>

        {/* Visit Store Button */}
        <Button className="w-full hover-scale" variant="outline">
          Visit Store
        </Button>
      </div>
    </Card>
  );
}
