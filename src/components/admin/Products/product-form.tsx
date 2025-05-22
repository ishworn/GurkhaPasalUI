"use client"

import { useState, useEffect, useMemo } from "react"
import { useWatch, useForm, type Control } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Trash2, Plus, X, Upload, ArrowLeft, PlusCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { productService, categoryService, vendorService } from "./services/api-service"
import { productFormSchema } from "./services/protduct-form-schema"


type ProductFormValues = z.infer<typeof productFormSchema>

export default function ProductForm({
  initialData,
  setIsAddOpen,
}: Readonly<{
  initialData?: ProductFormValues & { id?: string }
  setIsAddOpen: React.Dispatch<React.SetStateAction<boolean>>
}>) {
  const [activeTab, setActiveTab] = useState("basic")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialData?.categories || [])
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || [])
  const [features, setFeatures] = useState<string[]>(initialData?.features || [""])
  const [specifications, setSpecifications] = useState<{ name: string; value: string }[]>(
    initialData?.specifications || [{ name: "", value: "" }],
  )
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>(initialData?.images?.map((img) => img.url) || [])
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(
    initialData?.primaryImageIndex ?? null
  )
  const [variantOptions, setVariantOptions] = useState<{ name: string; values: string[]; unit?: string }[]>(
    initialData?.variantOptions || [{ name: "Size", values: ["S", "M", "L"], unit: "" }],
  )
  const [categoryPopup, setCategoryPopup] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [categoryImg, setCategoryImg] = useState<File | null>(null)
  const [selectedParentCategories, setSelectedParentCategories] = useState<number[]>([])
  const [role, setRole] = useState("vendor")
  const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [vendors, setVendors] = useState<any[]>([])
  const [tags, setTags] = useState<string[]>([
    "Summer",
    "Winter",
    "Spring",
    "Fall",
    "Casual",
    "Formal",
    "Sport",
    "Outdoor",
    "Indoor",
    "Bestseller",
    "New Arrival",
    "Limited Edition",
    "Sale",
    "Clearance",
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([])

  const { toast } = useToast()

  const tabs = ["basic", "description", "pricing", "images", "variants", "shipping"];
  const currentTabIndex = tabs.indexOf(activeTab);
  const isLastTab = currentTabIndex === tabs.length - 1;

  const handleNext = () => {
    if (isLastTab) {
      form.handleSubmit(onSubmit)();
    } else {
      setActiveTab(tabs[currentTabIndex + 1]);
    }
  };

  const handleBack = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1]);
    }
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, vendorsData] = await Promise.all([
          categoryService.getAllCategories(), 
          vendorService.getAllVendors()
        ])

        setCategories(categoriesData)
        setVendors(vendorsData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [toast])

  useEffect(() => {
    // When role is admin and vendors are loaded, automatically select the first vendor
    if (role === "admin" && vendors.length > 0 && !selectedVendorId) {
      setSelectedVendorId(vendors[0].id)
    }
  }, [role, vendors, selectedVendorId])

  // Initialize form with default values or initial data
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData || {
      name: "",
      sku: "",
      vendor: "",
      brand: "",
      categories: [],
      tags: [],
      shortDescription: "",
      fullDescription: "",
      features: [],
      specifications: [],
      price: 0,
      compareAtPrice: undefined,
      discount: undefined,
      taxable: true,
      taxCode: "",
      inventory: {
        trackInventory: true,
        quantity: 0,
        allowBackorders: false,
        lowStockThreshold: 5,
      },
      images: [],
      primaryImageIndex: undefined,
      hasVariants: false,
      variantOptions: [],
      variants: [],
      shipping: {
        weight: undefined,
        weightUnit: "kg",
        dimensions: {
          length: undefined,
          width: undefined,
          height: undefined,
          unit: "cm",
        },
        shippingClass: "",
        freeShipping: false,
        shippingNote: "",
      },
      status: "draft",
      visibility: "visible",
      publishDate: "",
    },
  })

  // Handle form submission
  async function onSubmit(data: ProductFormValues) {
    setIsSubmitting(true)

    try {
      // Set primaryImageIndex from activeImageIndex
      const formData = {
        ...data,
        primaryImageIndex: activeImageIndex !== null ? activeImageIndex : undefined
      }

      let response

      if (initialData?.id) {
        // Update existing product
        response = await productService.updateProduct(initialData.id, formData, imageFiles, deletedImageIds)
      } else {
        // Create new product
        response = await productService.createProduct(formData, imageFiles)
      }

      toast({
        title: "Success",
        description: initialData?.id ? "Product updated successfully" : "Product created successfully",
      })

      // Close the form or redirect
      if (setIsAddOpen) {
        setIsAddOpen(false)
      }

      return response
    } catch (error) {
      console.error("Error submitting product:", error)
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setImageFiles((prev) => [...prev, ...filesArray])

      // Create preview URLs
      const newPreviewUrls = filesArray.map((file) => URL.createObjectURL(file))
      setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls])

      // Update form value
      const newImages = newPreviewUrls.map((url) => ({ url, alt: "", isPrimary: false }))
      const currentImages = form.getValues("images") || []
      form.setValue("images", [...currentImages, ...newImages])

      // Set the first uploaded image as active if no active image
      if (activeImageIndex === null && newPreviewUrls.length > 0) {
        setActiveImageIndex(currentImages.length)
        form.setValue("primaryImageIndex", currentImages.length)
      }
    }
  }

  // Set active image
  const setActiveImage = (index: number) => {
    setActiveImageIndex(index)
    form.setValue("primaryImageIndex", index)

    // Update form values to mark the selected image as primary
    const currentImages = form.getValues("images") || []
    const newImages = currentImages.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }))
    form.setValue("images", newImages)
  }

  // Remove image
  const removeImage = (index: number) => {
    // If this is an existing image from the backend, track its ID for deletion
    const currentImages = form.getValues("images") || []
    if (currentImages[index] && currentImages[index].id) {
      setDeletedImageIds([...deletedImageIds, currentImages[index].id])
    }

    const newPreviewUrls = [...imagePreviewUrls]
    newPreviewUrls.splice(index, 1)
    setImagePreviewUrls(newPreviewUrls)

    const newImageFiles = [...imageFiles]
    if (index < newImageFiles.length) {
      newImageFiles.splice(index, 1)
      setImageFiles(newImageFiles)
    }

    const newImages = [...currentImages]
    newImages.splice(index, 1)
    form.setValue("images", newImages)

    // Adjust activeImageIndex if needed
    if (activeImageIndex === index) {
      const newIndex = newImages.length > 0 ? 0 : null
      setActiveImageIndex(newIndex)
      form.setValue("primaryImageIndex", newIndex)
    } else if (activeImageIndex !== null && activeImageIndex > index) {
      setActiveImageIndex(activeImageIndex - 1)
      form.setValue("primaryImageIndex", activeImageIndex - 1)
    }
  }

  // Handle category selection
  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      const newCategories = selectedCategories.filter((id) => id !== categoryId)
      setSelectedCategories(newCategories)
      form.setValue("categories", newCategories)
    } else {
      const newCategories = [...selectedCategories, categoryId]
      setSelectedCategories(newCategories)
      form.setValue("categories", newCategories)
    }
  }

  // Handle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      const newTags = selectedTags.filter((t) => t !== tag)
      setSelectedTags(newTags)
      form.setValue("tags", newTags)
    } else {
      const newTags = [...selectedTags, tag]
      setSelectedTags(newTags)
      form.setValue("tags", newTags)
    }
  }

  // Add feature
  const addFeature = () => {
    setFeatures([...features, ""])
  }

  // Update feature
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = value
    setFeatures(newFeatures)
    form.setValue("features", newFeatures)
  }

  // Remove feature
  const removeFeature = (index: number) => {
    const newFeatures = [...features]
    newFeatures.splice(index, 1)
    setFeatures(newFeatures)
    form.setValue("features", newFeatures)
  }

  // Add specification
  const addSpecification = () => {
    setSpecifications([...specifications, { name: "", value: "" }])
  }

  // Update specification
  const updateSpecification = (index: number, field: "name" | "value", value: string) => {
    const newSpecs = [...specifications]
    newSpecs[index][field] = value
    setSpecifications(newSpecs)
    form.setValue("specifications", newSpecs)
  }

  // Remove specification
  const removeSpecification = (index: number) => {
    const newSpecs = [...specifications]
    newSpecs.splice(index, 1)
    setSpecifications(newSpecs)
    form.setValue("specifications", newSpecs)
  }

  // Update variant option unit
  const updateVariantOptionUnit = (optionIndex: number, unit: string) => {
    const newOptions = [...variantOptions]
    newOptions[optionIndex].unit = unit
    setVariantOptions(newOptions)
    form.setValue("variantOptions", newOptions)
  }

  // Add variant option
  const addVariantOption = () => {
    setVariantOptions([...variantOptions, { name: "", values: [""] }])
  }

  // Update variant option
  const updateVariantOptionName = (index: number, name: string) => {
    const newOptions = [...variantOptions]
    newOptions[index].name = name
    setVariantOptions(newOptions)
    form.setValue("variantOptions", newOptions)
  }

  // Add variant value
  const addVariantValue = (optionIndex: number) => {
    const newOptions = [...variantOptions]
    newOptions[optionIndex].values.push("")
    setVariantOptions(newOptions)
    form.setValue("variantOptions", newOptions)
  }

  // Update variant value
  const updateVariantValue = (optionIndex: number, valueIndex: number, value: string) => {
    const newOptions = [...variantOptions]
    newOptions[optionIndex].values[valueIndex] = value
    setVariantOptions(newOptions)
    form.setValue("variantOptions", newOptions)
  }

  // Remove variant value
  const removeVariantValue = (optionIndex: number, valueIndex: number) => {
    const newOptions = [...variantOptions]
    newOptions[optionIndex].values.splice(valueIndex, 1)
    setVariantOptions(newOptions)
    form.setValue("variantOptions", newOptions)
  }

  // Remove variant option
  const removeVariantOption = (index: number) => {
    const newOptions = [...variantOptions]
    newOptions.splice(index, 1)
    setVariantOptions(newOptions)
    form.setValue("variantOptions", newOptions)
  }

  // Generate variants with unit support
  const generateVariants = () => {
    if (variantOptions.length === 0) return

    // Check if all variant options have values
    const isValid = variantOptions.every(
      (option) =>
        option.name.trim() !== "" && option.values.length > 0 && option.values.every((value) => value.trim() !== ""),
    )

    if (!isValid) {
      toast({
        title: "Invalid variant options",
        description: "Please ensure all variant options have names and values.",
        variant: "destructive",
      })
      return
    }

    // Generate all possible combinations
    const generateCombinations = (options: typeof variantOptions, current: string[] = [], index = 0): string[][] => {
      if (index === options.length) {
        return [current]
      }

      const combinations: string[][] = []
      for (const value of options[index].values) {
        combinations.push(...generateCombinations(options, [...current, value], index + 1))
      }
      return combinations
    }

    const combinations = generateCombinations(variantOptions)

    // Create variant objects with unit support
    const basePrice = form.getValues("price") || 0
    const baseSku = form.getValues("sku") || ""

    const variants = combinations.map((combo, index) => {
      const variantName = combo.join(" / ")
      const units = variantOptions.map((option) => option.unit ?? "").filter(Boolean)
      const unit = units.length > 0 ? units[0] : ""

      return {
        id: `variant-${index + 1}`,
        name: variantName,
        sku: `${baseSku}-${combo.map((c) => c.substring(0, 2).toUpperCase()).join("")}`,
        price: basePrice,
        compareAtPrice: form.getValues("compareAtPrice"),
        quantity: 0,
        image: "",
        unit: unit,
        attributes: {},
      }
    })

    form.setValue("variants", variants)

    toast({
      title: "Variants generated",
      description: `${variants.length} variants have been generated.`,
    })
  }

  // Calculate price from compare-at price and discount
  // Update the calculation to reduce compareAtPrice by discount to get price
  const compareAtPrice = useWatch({ control: form.control, name: "compareAtPrice" });
  const discount = useWatch({ control: form.control, name: "discount" });

  useEffect(() => {
    // Only calculate if both compareAtPrice and discount are provided
    if (compareAtPrice && discount) {
      // Calculate price by reducing compareAtPrice by the discount percentage
      const calculatedPrice = compareAtPrice * (1 - discount / 100);
      form.setValue("price", Number(calculatedPrice.toFixed(2)));
    }
  }, [compareAtPrice, discount, form]);

  async function addNewCategory(e: React.FormEvent) {
    e.preventDefault()
    if (!newCategory.trim()) return

    // For admin role, use the first vendor if none selected
    const vendorToUse = role === "admin" && !selectedVendorId && vendors.length > 0 ? vendors[0].id : selectedVendorId

    if (!vendorToUse) {
      toast({
        title: "Error",
        description: "Please select a vendor",
        variant: "destructive",
      })
      return
    }

    try {
      const categoryData = {
        category_name: newCategory.trim(),
        parent_category: selectedParentCategories.length > 0 ? selectedParentCategories[0] : undefined,
        user: vendorToUse,
      }

      const response = await categoryService.createCategory(categoryData, categoryImg || undefined)

      // Update categories state
      setCategories([...categories, response])

      // Add the new category to selected categories
      const newSelected = [...selectedCategories, response.id.toString()]
      setSelectedCategories(newSelected)
      form.setValue("categories", newSelected)

      // Reset form
      setNewCategory("")
      setCategoryImg(null)
      setSelectedParentCategories([])
      setCategoryPopup(false)

      toast({
        title: "Success",
        description: "Category created successfully",
      })
    } catch (error: any) {
      console.error("Error creating category:", error)
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to create category",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <Dialog open={categoryPopup} onOpenChange={setCategoryPopup}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>Create a new product category</DialogDescription>
          </DialogHeader>
          <form onSubmit={addNewCategory}>
            <div className="space-y-4">
              <div className="relative inline-block">
                {categoryImg && <div className="mb-2 text-sm text-gray-600">Selected file: {categoryImg.name}</div>}
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif"
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setCategoryImg(e.target.files[0])
                    }
                  }}
                />
                <Button type="button" variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
              </div>

              <Input
                id="categoryName"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name"
                required
              />

              {/* Vendor Selection - disabled for admin role */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Vendor</label>
                <Select
                  value={selectedVendorId?.toString() ?? ""}
                  onValueChange={(value) => {
                    const vendorId = Number.parseInt(value)
                    setSelectedVendorId(vendorId)
                  }}
                  disabled={role === "admin"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id.toString()}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {role === "admin" && vendors.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    As admin, the first vendor ({vendors[0]?.name}) will be used by default.
                  </p>
                )}
              </div>

              {/* Parent Category Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Parent Category</label>
                <Select
                  onValueChange={(value) => {
                    const categoryId = Number.parseInt(value)
                    setSelectedParentCategories([categoryId])
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedParentCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedParentCategories.map((id) => {
                      const category = categories.find((c) => c.id === id)
                      return (
                        <div key={id} className="flex items-center bg-gray-100 px-2 py-1 rounded">
                          <span>{category?.category_name}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedParentCategories([])}
                            className="ml-2 text-red-500"
                          >
                            ×
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button type="submit" disabled={!newCategory.trim() || (role === "vendor" && !selectedVendorId)}>
                  Add Category
                </Button>
              </DialogFooter>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="heading flex space-x-3 justify-center items-center">
            <Button
              type="button"
              className="bg-transparent text-black cursor-pointer hover:bg-transparent text-2xl"
              onClick={() => setIsAddOpen(false)}
            >
              <ArrowLeft />
            </Button>
            <h1 className="text-2xl font-bold">{initialData ? "Edit Product" : "Add New Product"}</h1>
          </div>
          <div className="flex items-center gap-2">
            <FormField
              control={form.control as Control<ProductFormValues>}
              name="status"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control as Control<ProductFormValues>}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as Control<ProductFormValues>}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU (Stock Keeping Unit)*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter SKU" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as Control<ProductFormValues>}
                name="vendor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor*</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vendor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vendors.map((vendor) => (
                          <SelectItem key={vendor.id} value={vendor.id.toString()}>
                            {vendor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as Control<ProductFormValues>}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter brand name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control as Control<ProductFormValues>}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories*</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2 border p-3 rounded-md">
                    {categories.map((category) => (
                      <Badge
                        key={category.id}
                        variant={selectedCategories.includes(category.id.toString()) ? "default" : "outline"}
                        className="cursor-pointer text-sm py-1.5 px-3"
                        onClick={() => toggleCategory(category.id.toString())}
                      >
                        {category.category_name}
                      </Badge>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setCategoryPopup(true)}
                      className="ml-2"
                    >
                      <PlusCircle className="h-4 w-4 mr-1" /> Add New
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as Control<ProductFormValues>}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormDescription>Select tags to help customers find your product</FormDescription>
                  <div className="flex flex-wrap gap-2 mt-2 border p-3 rounded-md">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer text-sm py-1.5 px-3"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as Control<ProductFormValues>}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange} className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="visible" id="visible" />
                        <Label htmlFor="visible">Visible</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hidden" id="hidden" />
                        <Label htmlFor="hidden">Hidden</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="featured" id="featured" />
                        <Label htmlFor="featured">Featured</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          {/* Description Tab */}
          <TabsContent value="description" className="space-y-6">
            <FormField
              control={form.control as Control<ProductFormValues>}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormDescription>A brief summary of the product (max 300 characters)</FormDescription>
                  <FormControl>
                    <Textarea placeholder="Enter a short description" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as Control<ProductFormValues>}
              name="fullDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter full product description" className="min-h-[200px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <div className="flex items-center justify-between mb-2">
                <FormLabel>Product Features</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                  <Plus className="h-4 w-4 mr-1" /> Add Feature
                </Button>
              </div>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFeature(index)}
                      disabled={features.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <FormLabel>Specifications</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={addSpecification}>
                  <Plus className="h-4 w-4 mr-1" /> Add Specification
                </Button>
              </div>
              <div className="space-y-2">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={spec.name}
                      onChange={(e) => updateSpecification(index, "name", e.target.value)}
                      placeholder="Name (e.g. Material)"
                      className="w-1/3"
                    />
                    <Input
                      value={spec.value}
                      onChange={(e) => updateSpecification(index, "value", e.target.value)}
                      placeholder="Value (e.g. Cotton)"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSpecification(index)}
                      disabled={specifications.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="compareAtPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Price</FormLabel>
                    <FormDescription>Set the original price before discounts</FormDescription>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">NRs</span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          className="pl-12"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value ? Number.parseFloat(e.target.value) : undefined;
                            field.onChange(value);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as Control<ProductFormValues>}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount</FormLabel>
                    <FormDescription>Percentage off the original price</FormDescription>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">%</span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          className="pl-12"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value ? Number.parseFloat(e.target.value) : undefined;
                            field.onChange(value);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as Control<ProductFormValues>}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sale Price*</FormLabel>
                    <FormDescription>Final price after discount (auto-calculated)</FormDescription>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">NRs</span>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          className="pl-12 bg-gray-50" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as Control<ProductFormValues>}
                name="taxable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Charge tax on this product</FormLabel>
                      <FormDescription>Enable if this product is taxable</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as Control<ProductFormValues>}
                name="taxCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tax code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Inventory</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control as Control<ProductFormValues>}
                  name="inventory.trackInventory"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Track inventory</FormLabel>
                        <FormDescription>Keep track of inventory quantities</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control as Control<ProductFormValues>}
                    name="inventory.quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as Control<ProductFormValues>}
                    name="inventory.lowStockThreshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Low stock threshold</FormLabel>
                        <FormDescription>Get notified when inventory is low</FormDescription>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const value = e.target.value ? Number.parseInt(e.target.value) : undefined
                              field.onChange(value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control as Control<ProductFormValues>}
                  name="inventory.allowBackorders"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Allow backorders</FormLabel>
                        <FormDescription>Allow customers to purchase when out of stock</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-6">
            <div>
              <FormLabel>Product Images</FormLabel>
              <FormDescription>
                Upload images for your product. Click on an image to set it as the primary image.
              </FormDescription>

              <div className="mt-4 border-2 border-dashed rounded-lg p-6 text-center">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Click to upload product images</p>
                    <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, GIF up to 5MB</p>
                  </div>
                </label>
              </div>

              {imagePreviewUrls.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div
                        className={`aspect-square rounded-md overflow-hidden border cursor-pointer ${activeImageIndex === index ? "ring-4 ring-orange-500" : ""
                          }`}
                        onClick={() => setActiveImage(index)}
                      >
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveImage(index)
                          }}
                          className="h-8"
                        >
                          Set as primary
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeImage(index)
                          }}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {activeImageIndex === index && (
                        <Badge className="absolute top-2 left-2 bg-orange-500">Primary</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Variants Tab */}
          <TabsContent value="variants" className="space-y-6">
            <FormField
              control={form.control as Control<ProductFormValues>}
              name="hasVariants"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>This product has multiple options, like different sizes or colors</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {form.watch("hasVariants") && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Options</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addVariantOption}>
                      <Plus className="h-4 w-4 mr-1" /> Add Option
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {variantOptions.map((option, optionIndex) => (
                      <Card key={optionIndex}>
                        <CardContent className="p-4 space-y-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 w-full">
                              <span className="font-medium min-w-24">Option {optionIndex + 1}:</span>
                              <Input
                                value={option.name}
                                onChange={(e) => updateVariantOptionName(optionIndex, e.target.value)}
                                placeholder="Option name (e.g. Size, Color)"
                                className="flex-1"
                              />
                            </div>
                            <div className="flex items-center gap-2 w-full">
                              <span className="font-medium min-w-24">Unit:</span>
                              <Input
                                value={option.unit || ""}
                                onChange={(e) => updateVariantOptionUnit(optionIndex, e.target.value)}
                                placeholder="Unit (e.g. cm, ml, kg)"
                                className="flex-1"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeVariantOption(optionIndex)}
                              disabled={variantOptions.length <= 1}
                              className="ml-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Values:</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => addVariantValue(optionIndex)}
                              >
                                <Plus className="h-3 w-3 mr-1" /> Add Value
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {option.values.map((value, valueIndex) => (
                                <div
                                  key={valueIndex}
                                  className="flex items-center gap-1 bg-muted rounded-md pl-2 pr-1 py-1"
                                >
                                  <Input
                                    value={value}
                                    onChange={(e) => updateVariantValue(optionIndex, valueIndex, e.target.value)}
                                    placeholder="Value"
                                    className="h-7 w-20 min-w-0 border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeVariantValue(optionIndex, valueIndex)}
                                    disabled={option.values.length <= 1}
                                    className="h-5 w-5"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button type="button" onClick={generateVariants} className="w-full max-w-md">
                    Generate Variants
                  </Button>
                </div>

                {form.watch("variants")?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Variants</h3>
                    <div className="border rounded-md overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-4 py-2 text-left font-medium text-sm">Variant</th>
                            <th className="px-4 py-2 text-left font-medium text-sm">Price</th>
                            <th className="px-4 py-2 text-left font-medium text-sm">SKU</th>
                            <th className="px-4 py-2 text-left font-medium text-sm">Quantity</th>
                            <th className="px-4 py-2 text-left font-medium text-sm">Unit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {form.watch("variants")?.map((variant, index) => (
                            <tr key={variant.id} className="border-t">
                              <td className="px-4 py-2">{variant.name}</td>
                              <td className="px-4 py-2">
                                <div className="relative w-32">
                                  <span className="absolute left-2 top-2">NRs</span>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className="pl-10 h-8"
                                    value={variant.price}
                                    onChange={(e) => {
                                      const variants = [...(form.getValues("variants") || [])]
                                      variants[index].price = Number.parseFloat(e.target.value)
                                      form.setValue("variants", variants)
                                    }}
                                  />
                                </div>
                              </td>
                              <td className="px-4 py-2">
                                <Input
                                  className="w-32 h-8"
                                  value={variant.sku}
                                  onChange={(e) => {
                                    const variants = [...(form.getValues("variants") || [])]
                                    variants[index].sku = e.target.value
                                    form.setValue("variants", variants)
                                  }}
                                />
                              </td>
                              <td className="px-4 py-2">
                                <Input
                                  type="number"
                                  min="0"
                                  className="w-24 h-8"
                                  value={variant.quantity}
                                  onChange={(e) => {
                                    const variants = [...(form.getValues("variants") || [])]
                                    variants[index].quantity = Number.parseInt(e.target.value)
                                    form.setValue("variants", variants)
                                  }}
                                />
                              </td>
                              <td className="px-4 py-2">
                                <Input
                                  className="w-24 h-8"
                                  value={variant.unit || ""}
                                  placeholder="Unit"
                                  onChange={(e) => {
                                    const variants = [...(form.getValues("variants") || [])]
                                    variants[index].unit = e.target.value
                                    form.setValue("variants", variants)
                                  }}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Shipping Tab */}
          <TabsContent value="shipping" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control as Control<ProductFormValues>}
                  name="shipping.weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            className="flex-1"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value ? Number.parseFloat(e.target.value) : undefined
                              field.onChange(value)
                            }}
                          />
                          <Select
                            value={form.watch("shipping.weightUnit")}
                            onValueChange={(value) =>
                              form.setValue("shipping.weightUnit", value as "kg" | "g" | "lb" | "oz")
                            }
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kg">kg</SelectItem>
                              <SelectItem value="g">g</SelectItem>
                              <SelectItem value="lb">lb</SelectItem>
                              <SelectItem value="oz">oz</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as Control<ProductFormValues>}
                  name="shipping.freeShipping"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Free Shipping</FormLabel>
                        <FormDescription>Offer free shipping for this product</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as Control<ProductFormValues>}
                  name="shipping.shippingClass"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Class</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select shipping class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="express">Express</SelectItem>
                          <SelectItem value="overnight">Overnight</SelectItem>
                          <SelectItem value="international">International</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Dimensions</h3>
                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={form.control as Control<ProductFormValues>}
                    name="shipping.dimensions.length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Length</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value ? Number.parseFloat(e.target.value) : undefined
                              field.onChange(value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as Control<ProductFormValues>}
                    name="shipping.dimensions.width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Width</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value ? Number.parseFloat(e.target.value) : undefined
                              field.onChange(value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as Control<ProductFormValues>}
                    name="shipping.dimensions.height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value ? Number.parseFloat(e.target.value) : undefined
                              field.onChange(value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                
                </div>

                <FormField
                  control={form.control as Control<ProductFormValues>}
                  name="shipping.dimensions.unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dimension Unit</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value as "cm" | "m" | "in" | "ft")}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cm">cm</SelectItem>
                          <SelectItem value="m">m</SelectItem>
                          <SelectItem value="in">in</SelectItem>
                          <SelectItem value="ft">ft</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control as Control<ProductFormValues>}
              name="shipping.shippingNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Note</FormLabel>
                  <FormDescription>Special instructions for shipping (visible to customers)</FormDescription>
                  <FormControl>
                    <Textarea placeholder="Enter shipping notes" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-between space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleBack}
            disabled={currentTabIndex === 0}
          >
            Back
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : isLastTab ? "Save Product" : "Next"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}