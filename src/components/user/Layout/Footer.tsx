import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, CreditCard, Truck, Shield, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      {/* Trust badges */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <Truck className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-semibold">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">On orders over $50</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <CreditCard className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-semibold">Secure Payment</h3>
              <p className="text-sm text-muted-foreground">100% secure payment</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Shield className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-semibold">Money Back Guarantee</h3>
              <p className="text-sm text-muted-foreground">Within 30 days</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Mail className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-semibold">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">Dedicated support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Subscribe to our newsletter</h3>
              <p className="text-sm text-muted-foreground">Get the latest updates, news and special offers</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <Input type="email" placeholder="Your email address" className="max-w-sm" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">About Us</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We provide high-quality products at affordable prices. Our mission is to make shopping easy and enjoyable.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-primary">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-primary">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">My Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/account" className="text-muted-foreground hover:text-primary">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-muted-foreground hover:text-primary">
                  Order History
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-muted-foreground hover:text-primary">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/newsletter" className="text-muted-foreground hover:text-primary">
                  Newsletter
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-primary">
                  Returns
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <address className="not-italic text-sm space-y-2 text-muted-foreground">
              <p>123 Commerce St.</p>
              <p>Anytown, ST 12345</p>
              <p>
                Email:{" "}
                <a href="mailto:info@yourstore.com" className="hover:text-primary">
                  info@yourstore.com
                </a>
              </p>
              <p>
                Phone:{" "}
                <a href="tel:+11234567890" className="hover:text-primary">
                  (123) 456-7890
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Payment methods */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} YourStore. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">We accept:</span>
              <div className="flex gap-2">
                <div className="h-8 w-12 bg-muted rounded flex items-center justify-center text-xs font-medium">
                  Visa
                </div>
                <div className="h-8 w-12 bg-muted rounded flex items-center justify-center text-xs font-medium">MC</div>
                <div className="h-8 w-12 bg-muted rounded flex items-center justify-center text-xs font-medium">
                  Amex
                </div>
                <div className="h-8 w-12 bg-muted rounded flex items-center justify-center text-xs font-medium">
                  PayPal
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

