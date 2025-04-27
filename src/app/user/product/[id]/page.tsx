


import { Suspense } from "react"
import ProductDetails from "@/components/user/Productdetails/productdetails"

// Loading fallback
function ProductLoading() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-lg"></div>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 w-20 bg-muted rounded-md"></div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <div className="h-8 w-3/4 bg-muted rounded mb-2"></div>
            <div className="h-6 w-1/4 bg-muted rounded"></div>
          </div>
          <div className="h-px bg-muted"></div>
          <div className="space-y-4">
            <div className="h-6 w-1/4 bg-muted rounded"></div>
            <div className="h-4 w-full bg-muted rounded mb-2"></div>
            <div className="h-4 w-full bg-muted rounded mb-2"></div>
            <div className="h-4 w-3/4 bg-muted rounded"></div>
          </div>
          <div className="h-px bg-muted"></div>
          <div className="h-10 w-full bg-muted rounded"></div>
          <div className="h-px bg-muted"></div>
          <div className="space-y-4">
            <div className="h-6 w-1/4 bg-muted rounded"></div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<ProductLoading />}>
      <ProductDetails productId={params.id} />
    </Suspense>
  )
}











































































