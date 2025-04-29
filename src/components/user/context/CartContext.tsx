'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { showToast } from '../alert/alert';
import { Product } from '@/components/user/DataDetails/DataDetails';



interface CartContextType {
  cartItems: Product[];
  addToCart: (item: Omit<Product, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  cartCount: number;
  handleCheckboxChange: (id: number, isChecked: boolean) => void;
  selectedTotal: number;
  handleSelectAllChange: (isChecked: boolean) => void;
  allSelected: boolean;
  getSelectedItems: () => Product[]
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  }, [cartItems]);

  const addToCart = (product: Omit<Product, 'quantity'>) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1, selected: true }];
    });
  };

  const removeFromCart = (id: number) => {
    const item = cartItems.find(item => item.id === id);
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    showToast(`${item?.name} removed from cart!`, 'error');
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleCheckboxChange = (id: number, isChecked: boolean) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, selected: isChecked } : item
      )
    );
  };
  const getSelectedItems = () => {
    return cartItems.filter((item) => item.selected)
  }

  const handleSelectAllChange = (isChecked: boolean) => {
    setCartItems(prevItems =>
      prevItems.map(item => ({ ...item, selected: isChecked }))
    );
  };

  const selectedTotal = cartItems
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const allSelected =
    cartItems.length > 0 && cartItems.every(item => item.selected);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        handleCheckboxChange,
        selectedTotal,
        handleSelectAllChange,
        getSelectedItems,
        allSelected
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
