import React from 'react';
import { useParams } from 'next/navigation';
import { ProductCard } from  '@/components/user/Layout/components/ProductCard';

// Mock data - in a real app, this would come from an API
const CATEGORY_PRODUCTS = {
  'traditional-wear': [
    {
      id: "101",
      name: "Men's Daura Suruwal",
      price: 4500,
      image: "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?auto=format&fit=crop&w=500&q=80",
      description: "Traditional Nepali formal wear for men",
      discount: 20,
    },
    {
      id: "102",
      name: "Women's Kurta Set",
      price: 3200,
      image: "https://images.unsplash.com/photo-1606902972004-c2a5207cbc71?auto=format&fit=crop&w=500&q=80",
      description: "Elegant kurta set with traditional designs",
      discount: 20,
    }
  ],
  'handicrafts': [
    {
      id: "201",
      name: "Singing Bowl Set",
      price: 2800,
      image: "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?auto=format&fit=crop&w=500&q=80",
      description: "Hand-crafted meditation singing bowl",
      discount: 20,
    }
  ]
};

export function CategoryPage() {
  const { category } = useParams();
  const products = category ? CATEGORY_PRODUCTS[category as keyof typeof CATEGORY_PRODUCTS] || [] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
      <h1 className="text-2xl font-bold capitalize">
  {typeof category === 'string' ? category.replace(/-/g, ' ') : ''}
</h1>

        
        <span className="text-gray-500">({products.length} products)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard quantity={0} categories={[]} subcategory={[]} brand={''} originalPrice={0} features={[]} images={[]} colors={[]} sizes={[]} stock={0} sku={''} reviews={[]} specifications={[]} key={product.id} {...product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No products found in this category</p>
        </div>
      )}
    </div>
  );
}