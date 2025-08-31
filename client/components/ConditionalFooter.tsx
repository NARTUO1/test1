import React from "react";
import {
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Clock,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ConditionalFooter: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <footer className="bg-background border-t">
      {/* Newsletter Section - Only show for non-authenticated users */}
      {!isAuthenticated && (
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Get the latest deals, new product launches, and exclusive offers
              delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 text-foreground bg-background"
              />
              <Button variant="secondary" size="lg">
                Subscribe
              </Button>
            </div>
            <p className="text-sm opacity-75 mt-4">
              Join thousands of happy customers. Unsubscribe at any time.
            </p>
          </div>
        </section>
      )}

      {/* Main Footer */}
      <div className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-xl font-bold">MarketHub</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Your trusted marketplace for quality products from verified
                vendors worldwide.
                {isAuthenticated && user && (
                  <span className="block mt-2 text-primary font-medium">
                    Welcome back, {user.fullName || user.username}!
                  </span>
                )}
              </p>
              <div className="flex space-x-3">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/products"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/categories"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/vendors"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Vendors
                  </Link>
                </li>
                {isAuthenticated ? (
                  <>
                    <li>
                      <Link
                        to="/orders"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        My Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/wishlist"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Wishlist
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/profile"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Profile
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/login"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Sign Up
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Seller Info */}
            <div className="space-y-4">
              <h3 className="font-semibold">For Sellers</h3>
              <ul className="space-y-2 text-sm">
                {isAuthenticated && user?.role === "vendor" ? (
                  <>
                    <li>
                      <Link
                        to="/vendor/dashboard"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Vendor Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/vendor/products"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Manage Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/vendor/orders"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/vendor/profile"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Store Profile
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/become-seller"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Become a Seller
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/seller-login"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Seller Login
                      </Link>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Seller Fees
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Seller Resources
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="font-semibold">Contact Us</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground">
                    123 Commerce Street
                    <br />
                    Business District
                    <br />
                    New York, NY 10001
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    +1 (555) 123-4567
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    support@markethub.com
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-muted-foreground">
                    <div>Mon-Fri: 9:00 AM - 6:00 PM</div>
                    <div>Sat: 10:00 AM - 4:00 PM</div>
                    <div>Sun: Closed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-muted-foreground">
                © 2024 MarketHub. All rights reserved.
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <Link
                  to="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/support"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Support
                </Link>
                {isAuthenticated && (
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Heart className="h-3 w-3 text-red-500" />
                    <span>Thank you for being a member!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ConditionalFooter;
