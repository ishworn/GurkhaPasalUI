

'use client';

import React, { useEffect, useState } from 'react';
import { Search, ShoppingCart, User, Heart, Menu, ChevronDown, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

import { useWishlist } from '../context/wishlistContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import LoginModal from '@/components/user/Login/LoginModal';
import { useRouter  } from 'next/navigation';

import { useCookies } from 'react-cookie';

export function Navbar() {
  const { cartCount } = useCart();
  const [showCategories, setShowCategories] = useState(false);
  const { wishlistCount } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const cartItemCount = 3 // This would come from your cart state
   const [showLogin, setShowLogin] = useState(false);
    const [userName, setUserName] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();




  
    const fetchUser = async () => {
      const token = localStorage.getItem("jwt");
      console.log("Token:", token); // Debugging line
  
      if (!token) {
        setLoading(false);
        return;
      }
  
      try {
        const response = await fetch("http://127.0.0.1:8000/api/user/", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

       
  
  
        if (!response.ok) throw new Error("Failed to fetch user");
  
        const userData = await response.json();
       
  
        setUserName(userData.name || "User");
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    
  
    // 🔁 Run once on mount
    useEffect(() => {
      fetchUser();
    }, []);
  
    // ✅ After successful login, wait briefly then fetch user
    const handleLoginSuccess = () => {
      setShowLogin(false);
      setTimeout(() => {
        fetchUser();
      }, 300); // Small delay to ensure JWT is set
  
     
    };
  
    // 👆 Button click based on auth state
    const handleButtonClick = () => {
      if (userName) {
        router.push('/user/account');
      } else {
        setShowLogin(true);
      }
    };



  const categories = [
    {
      id: "clothing",
      name: "Clothing",
      subcategories: [
        {
          id: "mens",
          name: "Men's Clothing",
          subsubcategories: [
            { id: "shirts", name: "Shirts" },
            { id: "pants", name: "Pants & Jeans" },
            { id: "tshirts", name: "T-Shirts" },
            { id: "sweaters", name: "Sweaters & Hoodies" },
            { id: "suits", name: "Suits & Blazers" },
          ],
        },
        {
          id: "womens",
          name: "Women's Clothing",
          subsubcategories: [
            { id: "dresses", name: "Dresses" },
            { id: "tops", name: "Tops & Blouses" },
            { id: "pants", name: "Pants & Jeans" },
            { id: "skirts", name: "Skirts" },
            { id: "outerwear", name: "Jackets & Coats" },
          ],
        },
        {
          id: "kids",
          name: "Kids' Clothing",
          subsubcategories: [
            { id: "boys", name: "Boys' Clothing" },
            { id: "girls", name: "Girls' Clothing" },
            { id: "baby", name: "Baby Clothing" },
            { id: "teens", name: "Teen Clothing" },
            { id: "accessories", name: "Kids' Accessories" },
          ],
        },
        {
          id: "activewear",
          name: "Activewear",
          subsubcategories: [
            { id: "tops", name: "Athletic Tops" },
            { id: "bottoms", name: "Athletic Bottoms" },
            { id: "sets", name: "Athletic Sets" },
            { id: "outerwear", name: "Athletic Jackets" },
            { id: "accessories", name: "Athletic Accessories" },
          ],
        },
        {
          id: "outerwear",
          name: "Outerwear",
          subsubcategories: [
            { id: "jackets", name: "Jackets" },
            { id: "coats", name: "Coats" },
            { id: "vests", name: "Vests" },
            { id: "rainwear", name: "Rainwear" },
            { id: "winterwear", name: "Winter Wear" },
          ],
        },
      ],
    },
    {
      id: "footwear",
      name: "Footwear",
      subcategories: [
        { id: "casual", name: "Casual Shoes" },
        { id: "athletic", name: "Athletic Shoes" },
        { id: "formal", name: "Formal Shoes" },
        { id: "boots", name: "Boots" },
        { id: "sandals", name: "Sandals" },
      ],
    },
    {
      id: "accessories",
      name: "Accessories",
      subcategories: [
        { id: "bags", name: "Bags & Backpacks" },
        { id: "jewelry", name: "Jewelry" },
        { id: "watches", name: "Watches" },
        { id: "belts", name: "Belts" },
        { id: "hats", name: "Hats & Caps" },
      ],
    },
    {
      id: "electronics",
      name: "Electronics",
      subcategories: [
        { id: "smartphones", name: "Smartphones" },
        { id: "laptops", name: "Laptops & Computers" },
        { id: "audio", name: "Audio & Headphones" },
        { id: "wearables", name: "Wearable Tech" },
        { id: "accessories", name: "Electronic Accessories" },
      ],
    },
  ]

  return (
    <>
      {/* Non-sticky Top Bar */}
      <div className="bg-[#ff9f5a] text-white px-4 py-1 text-sm">
        <div className="max-w-7xl mx-auto">
          Download Gurkha Pasal App | Customer Care
        </div>
      </div>

      {/* Sticky Navbar */}
      <div className="sticky top-0 bg-white shadow-sm z-50 group">

        <div className="max-w-7xl mx-auto px-4 py-4 relative">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <Link href="/" className="text-2xl font-bold text-[#ff7f2a]">
              Gurkha Pasal
            </Link>

            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search in Gurkha Pasal"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff7f2a]"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>

            <div className="flex items-center gap-6">


            
              <div>
                <div className='flex items-center justify-between'>

                  <User size={20} />
                  <button
                    onClick={handleButtonClick}
                    className=" px-2 py-2 text-black rounded hover:text-orange-700"
                  >

                    {userName ? userName : 'Login'}
                  </button>
                  <LoginModal
                        open={showLogin}
                        onClose={() => setShowLogin(false)}
                        onLoginSuccess={handleLoginSuccess}
                      />

                 
                </div>
              </div>

              <Link href="/user/wishlist" className="relative hover:text-[#ff7f2a]">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ff7f2a] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link href="/user/cart" className="relative hover:text-[#ff7f2a]">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ff7f2a] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>



            </div>
          </div>

          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">



            <div className="container mx-auto px-4">
              <div className="flex h-16 items-center justify-between">
                {/* Mobile Menu */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <nav className="flex flex-col gap-4 mt-8">
                      <Link
                        href="/"
                        className="text-lg font-medium hover:text-primary"
                        onClick={() => document.body.classList.remove("overflow-hidden")}
                      >
                        Home
                      </Link>

                      {/* Mobile Categories */}
                      {categories.map((category) => (
                        <div key={category.id} className="space-y-2">
                          <Link
                            href={`/category/${category.id}`}
                            className="text-lg font-medium hover:text-primary"
                            onClick={() => document.body.classList.remove("overflow-hidden")}
                          >
                            {category.name}
                          </Link>
                          <div className="pl-4 space-y-2">
                            {category.subcategories.slice(0, 3).map((subcategory) => (
                              <Link
                                key={subcategory.id}
                                href={`user/category/${category.id}/${subcategory.id}`}
                                className="text-sm text-muted-foreground hover:text-primary block"
                                onClick={() => document.body.classList.remove("overflow-hidden")}
                              >
                                {subcategory.name}
                              </Link>
                            ))}
                            {category.subcategories.length > 3 && (
                              <Link
                                href={`user/category/${category.id}`}
                                className="text-sm text-primary hover:underline block"
                                onClick={() => document.body.classList.remove("overflow-hidden")}
                              >
                                View all {category.name}
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}




                    </nav>
                  </SheetContent>
                </Sheet>



                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">


                  {/* Categories Dropdown */}
                  {categories.map((category) => (
                    <DropdownMenu key={category.id}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-0 h-auto text-sm font-medium hover:text-primary">
                          {category.name} <ChevronDown className="h-4 w-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[220px]">
                        <DropdownMenuGroup>
                          {category.subcategories.map((subcategory) =>
                            "subsubcategories" in subcategory ? (
                              <DropdownMenuSub key={subcategory.id}>
                                <DropdownMenuSubTrigger>{subcategory.name}</DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                  <DropdownMenuSubContent className="w-[200px]">
                                    {subcategory.subsubcategories.map((subsubcategory) => (
                                      <DropdownMenuItem key={subsubcategory.id} asChild>
                                        <Link href={`/user/category/${category.id}/${subcategory.id}/${subsubcategory.id}`}>
                                          {subsubcategory.name}
                                        </Link>
                                      </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                      <Link href={`/user/category/${category.id}/${subcategory.id}`}>
                                        View All {subcategory.name}
                                      </Link>
                                    </DropdownMenuItem>
                                  </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                              </DropdownMenuSub>
                            ) : (
                              <DropdownMenuItem key={subcategory.id} asChild>
                                <Link href={`/user/category/${category.id}/${subcategory.id}`}>{subcategory.name}</Link>
                              </DropdownMenuItem>
                            ),
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/user/category/${category.id}`}>View All {category.name}</Link>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ))}

                  <Link href="/user/categories" className="text-sm font-medium hover:text-primary">
                    All Categories
                  </Link>
                </nav>


              </div>
            </div>
          </header>
        </div>
      </div>
    </>
  );
}
