"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload, PlusCircle, X } from "lucide-react"

interface AddProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  section: z.string().min(1, {
    message: "Please select a section.",
  }),
  price: z.string().min(1, {
    message: "Please enter a price.",
  }),
  stock: z.coerce.number().min(0, {
    message: "Stock cannot be negative.",
  }),
  status: z.string().optional(),
  description: z.string().optional(),
  sku: z.string().min(1, {
    message: "Please enter a SKU.",
  }),
  weight: z.string().optional(),
  dimensions: z.string().optional(),
})

export function AddProductDialog({ open, onOpenChange }: AddProductDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categoryPopup, setCategoryPopup] = useState(false)
  const [sectionPopup, setSectionPopup] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [newSection, setNewSection] = useState("")
  const [categories, setCategories] = useState([
    { id: 1, name: "Electronics" },
    { id: 2, name: "Accessories" },
    { id: 3, name: "Clothing" },
    { id: 4, name: "Shoes" }
  ])
  const [sections, setSections] = useState([
    { id: 1, name: "Top Trendings" },
    { id: 2, name: "Flash Slaes" },
    { id: 3, name: "Discounted Products" },
    { id: 4, name: "Limited Offers" }
  ])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      section: "",
      price: "",
      stock: 0,
      description: "",
      status: "",
      sku: "",
      weight: "",
      dimensions: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      console.log("Adding product:", values)
      setIsSubmitting(false)
      onOpenChange(false)
      form.reset()
    }, 1000)
  }

  function addNewCategory() {
    if (newCategory.trim() && !categories.some(cat => cat.name.toLowerCase() === newCategory.trim().toLowerCase())) {
      const newId = Math.max(...categories.map(cat => cat.id)) + 1
      const updatedCategories = [...categories, { id: newId, name: newCategory.trim() }]
      setCategories(updatedCategories)
      form.setValue("category", newCategory.trim())
      setNewCategory("")
      setCategoryPopup(false)
    }
  }

  function addNewSection() {
    if (newSection.trim() && !sections.some(sec => sec.name.toLowerCase() === newSection.trim().toLowerCase())) {
      const newId = Math.max(...sections.map(sec => sec.id)) + 1
      const updatedSections = [...sections, { id: newId, name: newSection.trim() }]
      setSections(updatedSections)
      form.setValue("section", newSection.trim())
      setNewSection("")
      setSectionPopup(false)
    }
  }

  //role
  const [role, setRole] = useState("admin");

  return (
    <>
      {/* Add Category Dialog */}
      <Dialog open={categoryPopup} onOpenChange={setCategoryPopup}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new product category
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="categoryName"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name"
                className="col-span-3"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addNewCategory()
                  }
                }}
              />
              <Button type="button" onClick={addNewCategory}>
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Section Dialog */}
      <Dialog open={sectionPopup} onOpenChange={setSectionPopup}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Section</DialogTitle>
            <DialogDescription>
              Create a new product section
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="sectionName"
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
                placeholder="Section name"
                className="col-span-3"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addNewSection()
                  }
                }}
              />
              <Button type="button" onClick={addNewSection}>
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Product Dialog */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Create a new product in your inventory</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-md border bg-muted flex items-center justify-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">JPG, PNG or GIF. Max size of 800K</div>
              <Button type="button" variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Wireless Headphones" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <div className="flex space-x-2 items-center">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((item) => (
                              <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                          onClick={() => setCategoryPopup(true)}
                        >
                          <PlusCircle className="h-5 w-5 text-orange-500" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="section"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section</FormLabel>
                      <div className="flex space-x-2 items-center">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a section" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sections.map((item) => (
                              <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                          onClick={() => setSectionPopup(true)}
                        >
                          <PlusCircle className="h-5 w-5 text-orange-500" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input placeholder="129.99" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Stock</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {role == "admin" && (
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select product status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="stock">Stock</SelectItem>
                            <SelectItem value="limited">Limited</SelectItem>
                            <SelectItem value="out of stock">Out of Stock</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter product description" className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input placeholder="SKU-12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight</FormLabel>
                      <FormControl>
                        <Input placeholder="0.5 kg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dimensions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dimensions</FormLabel>
                      <FormControl>
                        <Input placeholder="10 x 5 x 2 cm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Add Product"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}