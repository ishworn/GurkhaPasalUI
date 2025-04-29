"use client";

import { Eye, Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from "@/components/user/context/CartContext";
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { useWishlist } from '../../context/wishlistContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { showToast, } from "@/components/user/alert/alert";

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';


export type Review = {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string; // DateTimeField comes as ISO string
  user: string; // This will hold the username
 
  
  comment: string;
  rating: number;
  product: Product;
}


export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price: string;
  discount: number 
  image: string; // URL string
  rating: number;
  code: string;
  brand: string;
  slug: string | null;
  sold_count: number;
  category: {
    id: number;
    name: string;
    image: string | null;
    vendor: number | null;
  };
  colors: string[]; // from JSONField
  sizes: string[]; // from JSONField
  
  created_at: string; // DateTimeField comes as ISO string
  vendor: number; // vendor ID (User ID)
  stock: number;
  stock_threshold: number;
  additional_images: string[]; // from JSONField
  specifications: string[]; // from JSONField
};

export function ProductCard({ id, name, price, image,  discount ,  category,brand,  stock , rating ,original_price }: Product) {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const router = useRouter();
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);
  
 










  

  const handleAddToCart = () => {
    addToCart({
      id, name, price, image, discount,
      original_price,
      description: '',
      colors: [],
      sizes: [],
      stock: 0,
      specifications: [],
      brand: '',
      rating: 0,
      code: '',
      sold_count: 0,
      slug: null,
      created_at: '',
      vendor: 0,
      stock_threshold: 0
    });
    showToast(`${name} added to cart!`, "success");
  };




  const quickView = (productId: string) => {
    // In a real app, this would open a modal with product details
    toast({
      title: "Quick view",
      description: "Quick view functionality would open a modal here",
    })
  }

  const handleAddToWishlist = () => {
    addToWishlist({
      id, name, price, image, discount,
      original_price,
      rating: 0,
      code: '',
      brand: '',
      
      description: '',
    
      color: [],
      sizes: [],
      stock: 0,
      
      
      specifications: []
    });
    setIsAddedToWishlist(!isAddedToWishlist); // Toggle wishlist state
    showToast(`${name} added to wishlist!`, "success", { autoClose: 3000 });
  };

  const redirectPage = () => {
    router.push(`/user/product/${id}`);
  };

  return (
    <div className="group overflow-hidden border hover:border-primary transition-all duration-300" onClick={redirectPage}>
    {/* Image */}
    <div className="relative w-64 aspect-[5/4] overflow-hidden bg-muted/20">
      <Image
        src={image}
        alt={name}
        layout="fill"
        className="object-cover transition-transform group-hover:scale-100"
      />

      {/* Badges */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
        {discount && discount > 0 && (
          <Badge variant="default" className="bg-primary text-white text-[10px] px-1.5 py-0.5">
            {discount}% OFF
          </Badge>
        )}
        {stock === 0 && (
          <Badge variant="outline" className="bg-primary text-[10px] px-1.5 py-0.5">
            Out of Stock
          </Badge>
        )}
      </div>

      {/* Hover Actions */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
        <Button
          variant="secondary"
          size="icon"
          className="h-9 w-9 rounded-full"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddToWishlist();
          }}
        >
          <Heart className={`h-4 w-4 ${isAddedToWishlist ? "fill-primary text-primary" : ""}`} />
          <span className="sr-only">Add to wishlist</span>
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-9 w-9 rounded-full"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            redirectPage();
          }}
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">Quick view</span>
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-9 w-9 rounded-full"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddToCart();
          }}
          disabled={stock === 0}
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="sr-only">Add to cart</span>
        </Button>
      </div>
    </div>

    {/* Info */}
    <div className="px-3 py-2">
      { brand && (
        <div className="text-[11px] text-muted-foreground mb-1">{brand}</div>
      )}
      
        <h3 className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors mb-1">
          {name}
        </h3>
     


{rating > 0 ? (
        <div className="flex items-center mb-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3 w-3 ${star <= Math.round(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
                  }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-1">
           {rating} reviews
          </span>
        </div>
      ) : (
        <div className="">{category.name} </div>  
      )}


      <div className="flex items-center gap-2">
        <span className="font-semibold text-sm">${price}</span>
        {original_price && (
          <span className="text-xs text-muted-foreground line-through">
            ${original_price}
          </span>
        )}
      </div>
    </div>

    {/* Button */}
    <div className="px-3 pb-3">
      <Button
        className="w-full text-xs py-2 bg-primary hover:bg-primary/80 text-black"
        size="sm"
        variant={stock === 0 ? "outline" : "default"}
        disabled={stock === 0}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleAddToCart();
        }}
      >
        {stock === 0 ? "Out of Stock" : "Add to Cart"}
      </Button>
    </div>
  </div>

  

  );
}

export default ProductCard;