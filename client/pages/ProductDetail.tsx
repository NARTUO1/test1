import { useState } from "react";
import { ArrowLeft, Heart, Share2, Star, Truck, Shield, RotateCcw, MessageCircle, Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");

  // Sample product data
  const product = {
    id: "1",
    name: "Premium Wireless Headphones with Active Noise Cancellation",
    price: 299.99,
    originalPrice: 399.99,
    discount: 25,
    rating: 4.8,
    reviewCount: 324,
    inStock: true,
    stockCount: 15,
    vendor: {
      id: "v1",
      name: "AudioTech",
      rating: 4.9,
      reviewCount: 1247,
      verified: true,
      responseTime: "Within 2 hours",
      avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop"
    },
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=600&fit=crop"
    ],
    description: `Experience superior audio quality with our premium wireless headphones featuring industry-leading active noise cancellation technology. Perfect for travel, work, or everyday listening.

Key Features:
• 30-hour battery life with ANC on
• Quick charge: 10 minutes = 5 hours playback
• Premium materials with comfortable ear cushions
• Voice assistant compatible
• Foldable design for easy storage
• Multiple device connectivity`,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Silver", "Blue"],
    specifications: {
      "Driver Size": "40mm",
      "Frequency Response": "20Hz - 20kHz",
      "Impedance": "32 ohms",
      "Battery Life": "30 hours (ANC on), 40 hours (ANC off)",
      "Charging Time": "3 hours",
      "Weight": "250g",
      "Connectivity": "Bluetooth 5.0, 3.5mm jack"
    }
  };

  const reviews = [
    {
      id: "r1",
      user: "Sarah M.",
      rating: 5,
      date: "2 weeks ago",
      verified: true,
      title: "Amazing sound quality!",
      content: "These headphones exceeded my expectations. The noise cancellation is incredible and the battery life is exactly as advertised. Highly recommend!",
      helpful: 23,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop"
    },
    {
      id: "r2",
      user: "Mike R.",
      rating: 4,
      date: "1 month ago",
      verified: true,
      title: "Great for travel",
      content: "Perfect for long flights. The noise cancellation blocks out most airplane noise. Only minor complaint is they can get a bit warm after extended use.",
      helpful: 18,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop"
    },
    {
      id: "r3",
      user: "Emily K.",
      rating: 5,
      date: "3 weeks ago",
      verified: true,
      title: "Worth every penny",
      content: "I was skeptical about the price but these are worth it. The build quality is excellent and they look premium. Great customer service from AudioTech too.",
      helpful: 31,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop"
    }
  ];

  const ratingBreakdown = [
    { stars: 5, count: 201, percentage: 62 },
    { stars: 4, count: 89, percentage: 27 },
    { stars: 3, count: 23, percentage: 7 },
    { stars: 2, count: 8, percentage: 3 },
    { stars: 1, count: 3, percentage: 1 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Button variant="ghost" size="sm" asChild>
            <a href="/products" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </a>
          </Button>
          <span>/</span>
          <span>Electronics</span>
          <span>/</span>
          <span>Audio</span>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="font-medium ml-2">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
              {product.discount && (
                <Badge variant="destructive">-{product.discount}%</Badge>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    In Stock
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {product.stockCount} items available
                  </span>
                </>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            {/* Vendor Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={product.vendor.avatar} />
                      <AvatarFallback>{product.vendor.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{product.vendor.name}</span>
                        {product.vendor.verified && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>★ {product.vendor.rating} ({product.vendor.reviewCount})</span>
                        <span>Response: {product.vendor.responseTime}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Visit Store
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <div className="space-y-4">
              {/* Size Selection */}
              <div>
                <label className="text-sm font-medium mb-3 block">Size</label>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="text-sm font-medium mb-3 block">Color</label>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-sm font-medium mb-3 block">Quantity</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button size="lg" className="w-full" disabled={!product.inStock}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5 mr-2" />
                  Wishlist
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over $100</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">2 Year Warranty</p>
                <p className="text-xs text-muted-foreground">Full coverage</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">30-Day Returns</p>
                <p className="text-xs text-muted-foreground">No questions asked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                      {product.description}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b">
                        <span className="font-medium">{key}:</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Review Summary */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold mb-2">{product.rating}</div>
                        <div className="flex justify-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(product.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Based on {product.reviewCount} reviews
                        </p>
                      </div>

                      <div className="space-y-3">
                        {ratingBreakdown.map((rating) => (
                          <div key={rating.stars} className="flex items-center gap-2">
                            <span className="text-sm w-2">{rating.stars}</span>
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <Progress value={rating.percentage} className="flex-1" />
                            <span className="text-sm text-muted-foreground w-8">
                              {rating.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-6">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={review.avatar} />
                            <AvatarFallback>{review.user[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">{review.user}</span>
                              {review.verified && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                  Verified Purchase
                                </Badge>
                              )}
                              <span className="text-sm text-muted-foreground">{review.date}</span>
                            </div>
                            
                            <div className="flex mb-3">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>

                            <h4 className="font-medium mb-2">{review.title}</h4>
                            <p className="text-muted-foreground mb-4">{review.content}</p>

                            <div className="flex items-center gap-4">
                              <Button variant="ghost" size="sm">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Reply
                              </Button>
                              <span className="text-sm text-muted-foreground">
                                {review.helpful} people found this helpful
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <div className="text-center">
                    <Button variant="outline">Load More Reviews</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
