'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { showToast } from '../alert/alert';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  description: string;
  features: string[];
  images: string[];
  colors: { name: string; value: string; inStock: boolean }[];
  sizes: { name: string; inStock: boolean }[];
  stock: number;
  sku: string;
  reviews: {
    id: string;
    user: string;
    rating: number;
    date: string;
    comment: string;
  }[];
  specifications: { name: string; value: string }[];
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Load wishlist items from localStorage when app initializes
  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlistItems');
    if (storedWishlist) {
      setWishlistItems(JSON.parse(storedWishlist)); // Load wishlist from localStorage
    }
  }, []); // Run only on first render

  // Save wishlist items to localStorage whenever wishlistItems state changes
  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    setWishlistCount(wishlistItems.length);
  }, [wishlistItems]);

  const addToWishlist = (product: WishlistItem) => {
    setWishlistItems(prevItems => {
      if (!prevItems.some(item => item.id === product.id)) {
        return [...prevItems, product];
      }
      return prevItems;
    });
  };

  const removeFromWishlist = (id: string) => {

    
    showToast(`${wishlistItems.find(item => item.id === id)?.name} removed from wishlist!`, "error") 
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, wishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
