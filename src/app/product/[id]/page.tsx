'use client';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import productData from '@/components/user/DataDetails/DataDetails';
import { ProductCard } from '@/components/user/Layout/components/ProductCard';

// Mock data for FEATURED_PRODUCTS







const ProductDetails = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const router = useRouter();



  
    const product = productData.find((product) => product.id.toString() === id);

    if (!product) {
        return <div>Card not found</div>;
    }


  return (
    <>
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img className="w-full rounded-lg" src={product.image} alt={product.name} />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-gray-600 my-2">{product.description}</p>
          <span className="text-xl font-semibold text-red-500">Rs. {product.price}</span>
          <div className="mt-4">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg mr-2 hover:bg-blue-600">Buy Now</button>
            <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
    <div >
        <h1 className='text-center'>
            You may also like
        </h1>

        <div className='mx-20 my-20' >
              <div className="grid grid-cols-5 gap-4">
                          {productData.map((product) => (
                            <ProductCard key={product.id} {...product} />
                          ))}
                        </div>
        </div>
    </div>
    </>
    


  );
};

export default ProductDetails;
