'use client';

import React from 'react';
import {  Trash2 } from 'lucide-react';
import { useWishlist } from '@/components/user/context/wishlistContext';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import { showToast } from '../alert/alert';

export function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart, } = useCart();


  const handleAddToCart = (item: { id: string; name: string; price: number; images: string[];  discount: number }) => {
    const { id, name, price, images, discount } = item;

    addToCart({
      id,
      name,
      price,
      images: [images[0]],
      discount,
      originalPrice: 0,
      description: '',
      features: [],
      colors: [],
      sizes: [],
      stock: 0,
      sku: '',
      reviews: [],
      specifications: [],
      categories: [],
      subcategory: [],
      brand: ''
    });
     showToast(`${name} added to cart!`, "success");
  };


  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-8">Wishlist</h2>
        <div className="text-center py-12">
          <p className="text-gray-600">Your wishlist is empty</p>
          <Link href="/"    className='text-[#ff7f2a] font-bold text-2xl'   > Start shopping now!</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8">Wishlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {wishlistItems.map((item) => (
          <div key={item.id} className="bg-white p-2 rounded-lg shadow-md relative">
            {/* Product Image */}
            <img
              src={item.images[0]}
              alt={item.name}
              className="w-full h-24 object-cover rounded-md"
            />

            {/* Discount Badge */}
            {item.discount && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {item.discount}
              </div>
            )}

            {/* Product Info */}
            <div className="mt-4">
            <h3 className="   text-center font-semibold min-h-[48px] line-clamp-2 overflow-hidden">{item.name}</h3>
              <p className="text-[#ff7f2a] font-bold mt-1 ml-4">Rs. {item.price}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center my-1 ml-3">
              {/* Add to Cart Button */}
              <button
                className="flex items-center gap-2  text-black px-2 py-1 bg-orange-600 rounded-md hover:bg-orange-600 transition-colors"
                onClick={() => handleAddToCart(item)}
              >
               
                Add to Cart
              </button>

              {/* Remove from Wishlist Button */}
              <button
                onClick={() => removeFromWishlist(item.id          )    }
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
