import {z} from "zod"

export const productFormSchema = z.object({
      id: z.number().optional(),
      name: z.string().min(3, { message: "Product name must be at least 3 characters" }),
      sku: z.string().min(2, { message: "SKU is required" }),
      vendor: z.string().min(1, { message: "Vendor is required" }),
      brand: z.string().min(1, { message: "Brand is required" }),
      categories: z.array(z.string()).min(1, { message: "At least one category is required" }),
      tags: z.array(z.string()).optional(),
    
      // Description & Details
      shortDescription: z.string().max(300, { message: "Short description must be less than 300 characters" }),
      fullDescription: z.string().max(1000, { message: "Full description must be less than 1000 characters" }),
      features: z.array(z.string()).optional(),
      specifications: z
        .array(
          z.object({
            name: z.string(),
            value: z.string(),
          }),
        )
        .optional(),
    
      // Pricing & Inventory
      price: z.coerce.number().positive({ message: "Price must be positive" }),
      compareAtPrice: z.coerce.number().optional(),
      discount: z.coerce.number().optional(),
      taxable: z.boolean().default(true),
      taxCode: z.string().optional(),
      inventory: z.object({
        trackInventory: z.boolean().default(true),
        quantity: z.coerce.number().int().nonnegative(),
        allowBackorders: z.boolean().default(false),
        lowStockThreshold: z.coerce.number().int().nonnegative().optional(),
      }),
    
      // Images & Media
      images: z
        .array(
          z.object({
            url: z.string(),
            alt: z.string().optional(),
            isPrimary: z.boolean().default(false),
            id: z.string().optional(),
          }),
        )
        .optional(),
      primaryImageIndex: z.number().optional(),
    
      // Variants & Options
      hasVariants: z.boolean().default(false),
      variantOptions: z
        .array(
          z.object({
            name: z.string(),
            values: z.array(z.string()),
            unit: z.string().optional(),
          }),
        )
        .optional(),
      variants: z
        .array(
          z.object({
            id: z.string(),
            name: z.string(),
            sku: z.string(),
            price: z.coerce.number().positive(),
            compareAtPrice: z.coerce.number().optional(),
            quantity: z.coerce.number().int().nonnegative(),
            image: z.string().optional(),
            unit: z.string().optional(),
            attributes: z.record(z.string(), z.string()).optional(),
          }),
        )
        .optional(),
    
      // Shipping & Delivery
      shipping: z.object({
        weight: z.coerce.number().optional(),
        weightUnit: z.enum(["kg", "g", "lb", "oz"]).default("kg"),
        dimensions: z.object({
          length: z.coerce.number().optional(),
          width: z.coerce.number().optional(),
          height: z.coerce.number().optional(),
          unit: z.enum(["cm", "m", "in", "ft"]).default("cm"),
        }),
        shippingClass: z.string().optional(),
        freeShipping: z.boolean().default(false),
        shippingNote: z.string().optional(),
      }),
    
      // Status & Visibility
      status: z.enum(["draft", "published", "scheduled"]).default("draft"),
      visibility: z.enum(["visible", "hidden", "featured"]).default("visible"),
      publishDate: z.string().optional(),
});