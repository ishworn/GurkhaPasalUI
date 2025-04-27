'use client';


import React from 'react'
import { Package } from 'lucide-react';
import { ProductCard } from  '@/components/user/Layout/components/ProductCard';


import BannerSection from './banner';
import CategoryShow from './categoryshow';
import { ToastNotificationContainer } from '../alert/alert';




  
  const images = [
    '/Image/User/b1.jpeg',
    '/Image/User/b2.jpeg',
    '/Image/User/b3.jpeg',
    '/Image/User/b4.jpeg',
    "/Image/User/b5.jpeg"

  ];

function Hero() {


 
  return (
    <div>
      {/* Hero Section */}
    < BannerSection />

      {/* Features */}
      <div className="max-w-7xl mx-auto pt-8 md:py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
            <Package className="text-[#ff7f2a]" size={32} />
            <div>
              <h3 className="font-semibold">Free Delivery</h3>
              <p className="text-sm text-gray-600">On orders above Rs. 1000</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
            <Package className="text-[#ff7f2a]" size={32} />
            <div>
              <h3 className="font-semibold">Authentic Products</h3>
              <p className="text-sm text-gray-600">100% Genuine Items</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
            <Package className="text-[#ff7f2a]" size={32} />
            <div>
              <h3 className="font-semibold">Secure Payment</h3>
              <p className="text-sm text-gray-600">Multiple Payment Options</p>
            </div>
          </div>
        </div>
      </div>
    
     < CategoryShow />
    
     

    </div>
  )
}

export default Hero