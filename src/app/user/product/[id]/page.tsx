// src/app/user/product/[id]/page.tsx
import { Suspense } from "react"
import ProductDetails from "@/components/user/Productdetails/productdetails"

async function getProduct(id: number) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
      cache: "no-store", // Disable caching if needed
    });

    if (!res.ok) {
      throw new Error("Failed to fetch product");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function ProductLoading() {
  return <div className="p-10">Loading Product Details...</div>
}

export default async function ProductPage({ params }: { params: { id: number } }) {
  const product = await getProduct(Number(params.id));

  if (!product) {
    return <div className="text-red-500">Product not found</div>;
  }

  return (
    <Suspense fallback={<ProductLoading />}>
      <ProductDetails product ={product} />
    </Suspense>
  )
}
