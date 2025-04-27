'use client'
import React, { useState } from 'react';
import { ProductCard } from '../../Layout/components/ProductCard';

import productData from '@/components/user/DataDetails/DataDetails'

function Productlisting() {
    const [visibleProducts, setVisibleProducts] = useState(productData.slice(0, 5)); // Start with the first 5 products
    const [page, setPage] = useState(1); // Start on page 1

    const handleLoadFunction = () => {
        // Increment page number
        const nextPage = page + 1;
        console.log("Button clicked - Current page: ", page);

        // Calculate the next set of products to load
        const nextProducts = productData.slice(nextPage * 5, (nextPage + 1) * 5);

        console.log("Loaded products: ", nextProducts); // Log the loaded products

        // Check if we have products to load
        if (nextProducts.length > 0) {
            setPage(nextPage); // Update page
            setVisibleProducts((prevProducts) => [...prevProducts, ...nextProducts]); // Append new products
        } else {
            console.log("No more products to load"); // Log when no more products are available
        }
    };

    return (
        <>
            <div className="grid grid-cols-5 gap-4">
                {visibleProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                ))}
            </div>

            {/* Load More Button */}
            <button
                onClick={handleLoadFunction}
                disabled={visibleProducts.length >= productData.length}
                className="mt-4 p-2 bg-blue-600 text-white rounded"
            >
                {visibleProducts.length >= productData.length ? 'No More Products' : 'Load More'}
            </button>
        </>
    );
}

export default Productlisting;
