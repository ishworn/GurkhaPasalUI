// API service for handling API requests
import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

// Add a request interceptor for authentication 
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

// Transform form data to match Django model structure
const transformFormDataToApiFormat = (formData) => {
    return {
        name: formData.name,
        sku: formData.sku,
        vendor: formData.vendor,
        brand: formData.brand,
        categories: formData.categories,
        tags: formData.tags || [],
        short_description: formData.shortDescription,
        full_description: formData.fullDescription,
        features: formData.features || [],
        specifications: formData.specifications || [],
        price: formData.price,
        compare_at_price: formData.compareAtPrice,
        discount: formData.discount,
        taxable: formData.taxable,
        tax_code: formData.taxCode || "",
        inventory: {
            track_inventory: formData.inventory?.trackInventory || true,
            quantity: formData.inventory?.quantity || 0,
            low_stock_threshold: formData.inventory?.lowStockThreshold || 0,
            allow_backorders: formData.inventory?.allowBackorders || false,
        },
        has_variants: formData.hasVariants,
        variant_options: formData.variantOptions || [],
        shipping: {
            weight: formData.shipping?.weight || 0,
            weight_unit: formData.shipping?.weightUnit || "kg",
            dimensions: {
                length: formData.shipping?.dimensions?.length || 0,
                width: formData.shipping?.dimensions?.width || 0,
                height: formData.shipping?.dimensions?.height || 0,
                unit: formData.shipping?.dimensions?.unit || "cm",
            },
            free_shipping: formData.shipping?.freeShipping || false,
            shipping_class: formData.shipping?.shippingClass || "",
            shipping_note: formData.shipping?.shippingNote || "",
        },
        status: formData.status,
        visibility: formData.visibility,
        publish_date: formData.publishDate || null,
        primary_image_index: formData.primaryImageIndex,
        variants: formData.hasVariants && formData.variants ? formData.variants.map(variant => ({
            name: variant.name,
            sku: variant.sku,
            price: variant.price,
            compare_at_price: variant.compareAtPrice,
            quantity: variant.quantity,
            unit: variant.unit || "",
            attributes: variant.attributes || {},
        })) : [],
    };
};

// Product API endpoints
export const productService = {
    // Get all products
    getAllProducts: async () => {
        try {
            const response = await apiClient.get("/products/")
            return response.data
        } catch (error) {
            console.error("Error fetching products:", error)
            throw error
        }
    },

    // Get product by ID
    getProductById: async (id: string) => {
        try {
            const response = await apiClient.get(`/products/${id}/`)
            return response.data
        } catch (error) {
            console.error(`Error fetching product with ID ${id}:`, error)
            throw error
        }
    },

    // Create new product
    createProduct: async (productData: any, imageFiles: File[]) => {
        try {
            // Transform data to match API format
            const transformedData = transformFormDataToApiFormat(productData);

            // Create FormData for file uploads
            const formData = new FormData()

            // Add product data as JSON
            formData.append("data", JSON.stringify(transformedData))

            // Add image files
            imageFiles.forEach((file) => {
                formData.append("images", file)
            })

            const response = await axios.post(`${API_BASE_URL}/products/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            return response.data
        } catch (error) {
            console.error("Error creating product:", error)
            throw error
        }
    },

    // Update product
    updateProduct: async (id: string, productData: any, imageFiles: File[] = [], deleteImageIds: string[] = []) => {
        try {
            // Transform data to match API format
            const transformedData = transformFormDataToApiFormat(productData);

            // Create FormData for file uploads
            const formData = new FormData()

            // Add product data as JSON
            formData.append("data", JSON.stringify(transformedData))

            // Add image files
            imageFiles.forEach((file) => {
                formData.append("images", file)
            })

            // Add image IDs to delete
            deleteImageIds.forEach((imageId) => {
                formData.append("delete_images", imageId)
            })

            const response = await axios.patch(`${API_BASE_URL}/products/${id}/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            return response.data
        } catch (error) {
            console.error(`Error updating product with ID ${id}:`, error)
            throw error
        }
    },

    // Delete product
    deleteProduct: async (id: string) => {
        try {
            const response = await apiClient.delete(`/products/${id}/`)
            return response.data
        } catch (error) {
            console.error(`Error deleting product with ID ${id}:`, error)
            throw error
        }
    },
}

// Category API endpoints
export const categoryService = {
    getAllCategories: async () => {
        try {
            const response = await apiClient.get("/categories/");
            return response.data;
        } catch (error) {
            console.error("Error fetching categories:", error);
            throw error;
        }
    },

    createCategory: async (
        categoryData: {
            category_name: string;
            parent_category?: number | null;
            user: number;
        },
        imageFile?: File
    ) => {
        try {
            const formData = new FormData();

            formData.append("category_name", categoryData.category_name);
            formData.append("user", categoryData.user.toString());

            if (
                categoryData.parent_category !== undefined &&
                categoryData.parent_category !== null
            ) {
                formData.append(
                    "parent_category",
                    categoryData.parent_category.toString()
                );
            }

            if (imageFile) {
                formData.append("image", imageFile);
            }

            const response = await apiClient.post("/categories/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data;
        } catch (error: any) {
            console.error("Error creating category:", error.response?.data || error.message);
            throw error;
        }
    },
};

// Vendor API endpoints
export const vendorService = {
    getAllVendors: async () => {
        try {
            const response = await apiClient.get("/vendors/")
            return response.data
        } catch (error) {
            console.error("Error fetching vendors:", error)
            throw error
        }
    },
}

export default apiClient