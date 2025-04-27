import React from "react";
import { ProductCard } from "../Layout/components/ProductCard";
import Link from 'next/link';
import productData from "../DataDetails/DataDetails";

const categories = [
  "Breast Pump Accessories",
  "Vinegar & Cooking Wine",
  "Phone Cases",
  "Convertible",
  "Telescopes",
  "Canned",
  "Kids Bookshelves & Shelving",
  "Toilet Paper",
  "Hoodies & Sweatshirts",
  "Polishers",
  "Ergonomic Accessories",
  "Bathroom Lighting",
];

// Card component
const CategoryShow: React.FC = () => {
  return (
    <div className="max-w-7xl lg:mx-auto md:mx-auto lg:pb-8 md:py-12 lg:px-4">
      <div className="flex min-h-screen bg-white">
        {/* Main Content */}
        <main className="flex-1 ">
          {/* Flash Sale Section */}
          <section className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Flash Sale</h1>
              <Link href="/user/productlist">
             See All Product
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {productData.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </section>

          {/* Categories Section */}
          <section className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Categories</h1>
             
              <Link href="/user/categories"className="text-blue-600 hover:underline text-sm md:text-base">
                    All Categories
                  </Link>
          
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg shadow-md bg-white text-center"
                >
                  <div className="h-16 bg-gray-300 mb-2 flex items-center justify-center text-gray-500">
                    Image
                  </div>
                  {category}
                </div>
              ))}
            </div>
          </section>

          {/* Just For You Section */}
          <section>
          <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Just For You </h1>
              <Link href="/user/productlist">
             See All Product
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {productData.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CategoryShow;
