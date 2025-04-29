'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

const ProductContext = createContext<any>(null);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/products/");
        const data = await res.json();
        console.log("Fetched Products:", data); // Log the fetched products
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    }

    if (products.length === 0) {
      fetchProducts();
    }
  }, []);

  return (
    <ProductContext.Provider value={{ products }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
