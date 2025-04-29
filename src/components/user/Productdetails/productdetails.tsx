"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Minus, Plus, Star, Heart, Share2, Truck, ShieldCheck, RotateCcw, Check, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"


import ProductRecommendations from "../DataDetails/product-recommendations"
import { useRouter } from 'next/navigation';
import { useCart } from "../context/CartContext"
import LoginModal from "../Login/LoginModal"
import { Product, Review } from "../Layout/components/ProductCard"

export default function ProductDetail({ product }: { product: Product }) {

  if (!product) {
    // Handle the case where the product is not found

    return <p>Product not found.</p> // Display if the product is not found
  }

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(product.colors.length > 0 ? product.colors[0] : '')
  const [selectedSize, setSelectedSize] = useState(product.sizes.length > 0 ? product.sizes[0] : '')
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { toast } = useToast()
  const [showLogin, setShowLogin] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);

  
  const [reviews, setReviews] = useState<Review[]>([]);
  const productReviews = reviews.filter((review) => review.product.id === product.id);

  

  const {

    addToCart,
    cartItems,
    updateQuantity,
    removeFromCart,
    handleCheckboxChange,
    selectedTotal,
    handleSelectAllChange,
    allSelected,
  } = useCart();

  // Ensure there is a valid product image before trying to access it



  const incrementQuantity = () => {
    setQuantity((prev) => (prev < product.stock ? prev + 1 : prev))
  }

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }



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



  const handleAddToCart = () => {
    addToCart(product);

    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedColor}, ${selectedSize}) has been added to your cart.`,
    })
  }

  const router = useRouter();

  const [rating, setRating] = useState(0);
const [comment, setComment] = useState("");

const handleSubmit = async (e: { preventDefault: () => void }) => {
  const isLoggedIn = await checkLoginStatus(); // secure check with cookies
 
  if (!isLoggedIn) {

    localStorage.setItem("redirectAfterLogin", "/user/product/ " + product.id);
  
    setShowLogin(true);

    return;
  }
  e.preventDefault();

  const response = await fetch('http://127.0.0.1:8000/api/reviews/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    
    },
    body: JSON.stringify({
      product_id: product.id,
      user_id : 1,
      rating,
      comment,
      photo: photo ? await photo.arrayBuffer() : null, // Convert file to ArrayBuffer if needed
      // optionally: user or user_id if not from token
    }),
  });

  if (response.ok) {
    // Refresh reviews or show a success message
    setRating(0);
    setComment("");
    // Optionally reload product reviews
  } else {
    console.error("Failed to submit review");
  }
};




  const handleBuyNow = async (): Promise<void> => {
    const isLoggedIn = await checkLoginStatus(); // secure check with cookies

    if (!isLoggedIn) {

      localStorage.setItem("redirectAfterLogin", "/user/checkout");
      localStorage.setItem("productToBuy", JSON.stringify(product));
      setShowLogin(true);

      return;
    }

    // Perform Buy Now Flow
    const existingProduct = cartItems.find((item) => item.id === product.id);

    if (!existingProduct) {
      addToCart(product);
    }

    handleCheckboxChange(product.id, true);
    router.push('/user/checkout');
  };





  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted
        ? `${product.name} has been removed from your wishlist.`
        : `${product.name} has been added to your wishlist.`,
    })
  }


  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/reviews/?product_id=${product.id}`);
       

        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await res.json();
        console.log("Fetched Reviews:", data); // Log the fetched reviews


        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    }

    fetchReviews();
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:ml-8 lg:mt-8">
      {/* Left side - Images */}
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-lg border">
          {product.discount > 0 && (
            <Badge className="absolute top-2 left-2 z-10 bg-primary">{product.discount}% OFF</Badge>
          )}
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {product.additional_images?.map((image: string, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border ${selectedImage === index ? "ring-2 ring-primary" : ""}`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`Product thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>

      </div>

      {/* Right side - Product details and reviews */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 mt-1">
            <span>SKU: {product.code}</span>
            <span>•</span>
            <div className="flex items-center">
  {product.stock > 0 ? (
    <>
      <Check className="h-4 w-4 text-green-500 mr-1" />
      <span className="text-green-600">In Stock</span>
    </>
  ) : (
    <>
      <X className="h-4 w-4 text-red-500 mr-1" />
      <span className="text-red-600">Out of Stock</span>
    </>
  )}
</div>
          </div>

          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="flex items-center mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${star <= product.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-muted-foreground">
              {product.rating.toFixed(1)} ({productReviews.length} reviews)
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            {product.original_price && (
              <span className="text-lg text-muted-foreground line-through">${product.original_price}</span>
            )}
            <span className="text-2xl font-semibold text-primary">${product.price}</span>
          </div>
        </div>

        <Separator />

        {/* Color selection */}
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">
              Color: <span className="text-muted-foreground">{selectedColor}</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(product.colors) && product.colors.length > 0 && (
                <RadioGroup
                  value={selectedColor}
                  onValueChange={setSelectedColor}
                  className="flex flex-wrap gap-2 mt-4"
                >
                  {product.colors.map((color) => (
                    <div key={color} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={color}
                        id={`color-${color}`}
                        className="hidden"
                      />
                      <Label
                        htmlFor={`color-${color}`}
                        className={`flex h-10 px-4 items-center justify-center rounded border 
            ${selectedColor === color ? "bg-primary text-primary-foreground" : "hover:bg-muted cursor-pointer"}`}
                      >
                        {color}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}  
            </div>
          </div>

          {/* Size selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">
                Size: <span className="text-muted-foreground">{selectedSize}</span>
              </h3>
              <Button variant="link" className="p-0 h-auto text-sm">
                Size Guide
              </Button>
            </div>
            {Array.isArray(product.sizes) && product.sizes.length > 0 && (
              <RadioGroup
                value={selectedSize}
                onValueChange={setSelectedSize}
                className="flex flex-wrap gap-2"
              >
                {product.sizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={size}
                      id={`size-${size}`}
                      className="hidden"
                    />
                    <Label
                      htmlFor={`size-${size}`}
                      className={`flex h-10 w-16 items-center justify-center rounded border 
            ${selectedSize === size ? "bg-primary text-primary-foreground" : "hover:bg-muted cursor-pointer"}`}
                    >
                      {size}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

          </div>

          {/* Quantity */}
          <div className="flex items-center">
            <span className="mr-4 font-medium">Quantity:</span>
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={incrementQuantity} disabled={quantity >= product.stock}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <span className="ml-4 text-sm text-muted-foreground">{product.stock} items available</span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="flex-1" size="lg"
              onClick={() => {
                handleAddToCart();
              }}

            >
              Add to Cart
            </Button>
            <Button variant="outline" size="lg" className="flex-1 bg-primary text-white" onClick={() => {
              console.log("Selected product:", product); // Log the product here
              handleBuyNow();
            }}>
              Buy Now
            </Button>
            <LoginModal
              open={showLogin}
              onClose={() => setShowLogin(false)}
              onLoginSuccess={() => {
                setShowLogin(false)

              }}
            />
            <Button
              variant={isWishlisted ? "default" : "outline"}
              size="icon"
              className="h-12 w-12"
              onClick={toggleWishlist}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? "fill-primary-foreground" : ""}`} />
              <span className="sr-only">Add to wishlist</span>
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12">
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Share product</span>
            </Button>
          </div>
        </div>

        {/* Shipping info */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            <span className="text-sm">Free shipping on orders over $50</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="text-sm">30-day money-back guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-primary" />
            <span className="text-sm">Free returns within 14 days</span>
          </div>
        </div>

        <Separator />

        {/* Product details tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description">
            <p>{product.description}</p>
          </TabsContent>
          <TabsContent value="specifications">
            <ul className="list-disc ml-6">
              {Object.entries(product.specifications || {}).map(([key, value], index) => (
                <li key={index}>
                  {key}: {value}
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="reviews">
  <div>
    {/* Existing reviews */}
    {productReviews.map((review, index) => (
      <Card key={index} className="mb-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">{review.user}</span>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${star <= review.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
              />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">{review.rating}</span>
          </div>
        </div>
        <p className="mt-2">{review.comment}</p>
      </Card>
    ))}

    {/* Add Review Form */}
    <Card className="mt-6 p-4">
      <h3 className="font-semibold text-lg mb-2">Leave a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block mb-1 text-sm font-medium">Your Rating:</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => setRating(star)}
                className={`h-5 w-5 cursor-pointer ${star <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
              />
            ))}
          </div>
        </div>

        <div className="mb-2">
          <label className="block mb-1 text-sm font-medium">Your Comment:</label>
          <textarea
            className="w-full border rounded-md p-2 text-sm"
          
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
  <button className="block mb-1 text-sm font-medium ">Upload a Photo (optional):</button>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      if (e.target.files && e.target.files[0]) {
        setPhoto(e.target.files[0]);
      }
    }}
    className="text-sm"
  />
</div>


        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        >
          Submit Review
        </button>
      </form>
    </Card>
  </div>
</TabsContent>

        </Tabs>
      </div>
      <div className="col-span-1 md:col-span-2 mb-4 mt-8">
        <h2 className="text-2xl font-bold mb-6">You might also like</h2>
        <ProductRecommendations />
      </div>
    </div>
  )
}
