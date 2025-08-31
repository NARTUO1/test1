import { useState } from "react";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { formatPrice } from "../lib/currency";

export default function Cart() {
  const { state, updateQuantity, removeItem } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/products" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>

          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button size="lg" asChild>
              <Link to="/products">Start Shopping</Link>
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/products" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl font-bold">
            Shopping Cart ({state.itemCount} items)
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <Card key={`${item.id}-${item.size}-${item.color}`}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            by {item.vendor}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            removeItem(`${item.id}-${item.size}-${item.color}`)
                          }
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Options */}
                      <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.maxStock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <div className="font-semibold">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatPrice(item.price)} each
                          </div>
                        </div>
                      </div>

                      {/* Stock Warning */}
                      {item.quantity >= item.maxStock && (
                        <p className="text-sm text-orange-600 mt-2">
                          Maximum quantity available: {item.maxStock}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Save for Later */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  <span>Move items to wishlist to save for later</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal ({state.itemCount} items)</span>
                    <span>{formatPrice(state.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span>{formatPrice(state.total * 0.18)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(state.total * 1.18)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button size="lg" className="w-full" asChild>
                    <Link to="/checkout">Proceed to Checkout</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    asChild
                  >
                    <Link to="/products">Continue Shopping</Link>
                  </Button>
                </div>

                {/* Promo Code */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-3">Promo Code</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border border-input rounded-md text-sm"
                    />
                    <Button variant="outline" size="sm">
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl mb-1">🔒</div>
                      <p className="text-xs text-muted-foreground">
                        Secure Checkout
                      </p>
                    </div>
                    <div>
                      <div className="text-2xl mb-1">🚚</div>
                      <p className="text-xs text-muted-foreground">
                        Free Shipping
                      </p>
                    </div>
                    <div>
                      <div className="text-2xl mb-1">↩️</div>
                      <p className="text-xs text-muted-foreground">
                        Easy Returns
                      </p>
                    </div>
                    <div>
                      <div className="text-2xl mb-1">💬</div>
                      <p className="text-xs text-muted-foreground">
                        24/7 Support
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
