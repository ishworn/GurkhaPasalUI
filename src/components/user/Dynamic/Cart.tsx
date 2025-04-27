'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoginModal from '../Login/LoginModal';


export function Cart() {

  const [showLogin, setShowLogin] = useState(false);
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    handleCheckboxChange,
    selectedTotal,
    handleSelectAllChange,
    allSelected,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-8">Shopping Cart</h2>
        <div className="text-center py-12">
          <p className="text-gray-600">Your cart is empty</p>
          <Link href="/" className="text-[#ff7f2a] font-bold text-2xl">
            Start shopping now!
          </Link>
        </div>
      </div>
    );
  }
  const router = useRouter();



  const checkLoginStatus = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem("jwt"); // or whatever key you used
  
      if (!token) {
        console.warn("No token found in localStorage.");
        return false;
      }
  
      const res = await fetch("http://127.0.0.1:8000/api/user/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      const data = await res.json(); // optional, for debugging
      console.log("Status:", res.status, "Response:", data);
  
      return res.ok; // true if 200 OK
    } catch (error) {
      console.error("Error checking login status:", error);
      return false;
    }
  };






  const  onSubmit = async (): Promise<void> => {
    const isLoggedIn = await checkLoginStatus(); // secure check with cookies

    if (!isLoggedIn) {

      localStorage.setItem("redirectAfterLogin", "/user/checkout");
      
      setShowLogin(true);

      return;
    }

    // Perform Buy Now Flow
  

    
    router.push('/user/checkout');
  };



  useEffect(() => {
    handleSelectAllChange(false);
  }, []);
  

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8">Shopping Cart</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Select All Checkbox */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => handleSelectAllChange(e.target.checked)}
              className="mr-2"
            />
            <label className="text-sm font-medium">Select All</label>
          </div>

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-white p-4 rounded-lg shadow-sm mb-4 items-start"
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={item.selected || false}
                onChange={(e) =>
                  handleCheckboxChange(item.id, e.target.checked)
                }
                className="mt-2"
              />

              {/* Image */}
              <img
                src={
                  item.images && item.images.length > 0
                    ? item.images[0]
                    : '/path/to/default-image.jpg'
                }
                alt={item.name}
                className="w-24 h-24 object-cover rounded-md"
              />

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-[#ff7f2a] font-bold mt-1">Rs. {item.price}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-md hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-md hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {selectedTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>Rs. {selectedTotal}</span>
            </div>
          </div>
          <button className="w-full bg-[#ff7f2a] text-white py-2 rounded-md mt-6 hover:bg-[#ff9f5a]"  onClick={onSubmit}>
            Proceed to Checkout
          </button>
          <LoginModal
              open={showLogin}
              onClose={() => setShowLogin(false)}
              onLoginSuccess={() => {
                setShowLogin(false)

              }}
            />
        </div>
      </div>
    </div>
  );
}
