import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  LogOut,
  Package,
  Settings,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function MarketplaceHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state } = useCart();
  const { state: wishlistState } = useWishlist();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold">MarketHub</span>
          </Link>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search products, brands, and more..."
              className="pl-10 pr-4 w-full"
            />
          </div>
        </div>

        {/* Navigation Links - Hidden on mobile */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link
            to="/categories"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Categories
          </Link>
          <Link
            to="/vendors"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Vendors
          </Link>
          <Link
            to="/deals"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Deals
          </Link>
          <Link
            to="/become-seller"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Sell on MarketHub
          </Link>
          <Link
            to="/services"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Services
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-2">
          {/* Search icon for mobile */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>

          {/* Wishlist */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex relative"
            asChild
          >
            <Link to="/wishlist">
              <Heart className="h-5 w-5" />
              {wishlistState.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistState.itemCount}
                </span>
              )}
            </Link>
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {state.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.itemCount}
                </span>
              )}
            </Link>
          </Button>

          {/* User Account */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <Settings className="h-4 w-4 mr-2" />
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/order-history">
                  <Package className="h-4 w-4 mr-2" />
                  Order History
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/wishlist">
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/vendor/dashboard">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Vendor Portal
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/dashboard">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/login">
                  <User className="h-4 w-4 mr-2" />
                  Customer Login
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/login?type=seller">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Seller Login
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/register">
                  <User className="h-4 w-4 mr-2" />
                  Create Account
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t bg-background">
          <div className="container py-4 px-4">
            {/* Mobile Search */}
            <div className="mb-4 md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10 pr-4 w-full"
                />
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-3">
              <Link
                to="/categories"
                className="text-sm font-medium hover:text-primary transition-colors py-2"
              >
                Categories
              </Link>
              <Link
                to="/vendors"
                className="text-sm font-medium hover:text-primary transition-colors py-2"
              >
                Vendors
              </Link>
              <Link
                to="/deals"
                className="text-sm font-medium hover:text-primary transition-colors py-2"
              >
                Deals
              </Link>
              <Link
                to="/become-seller"
                className="text-sm font-medium hover:text-primary transition-colors py-2"
              >
                Sell on MarketHub
              </Link>
              <Link
                to="/services"
                className="text-sm font-medium hover:text-primary transition-colors py-2"
              >
                Services
              </Link>
              <Link
                to="/contact"
                className="text-sm font-medium hover:text-primary transition-colors py-2"
              >
                Contact
              </Link>
              <div className="border-t pt-3 mt-3">
                <Link
                  to="/wishlist"
                  className="text-sm font-medium hover:text-primary transition-colors py-2 flex items-center space-x-2"
                >
                  <Heart className="h-4 w-4" />
                  <span>Wishlist</span>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
