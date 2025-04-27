"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Briefcase, ChevronLeft, ChevronRight, Home, Trash2, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/user/context/CartContext"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
    promoCode: z.string().optional(),
    deliveryOption: z.enum(["standard", "express", "pickup"]),
})

export default function CheckoutPage() {
    const [showAddressModal, setShowAddressModal] = useState(false)

  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("OFFICE");
    const router = useRouter()
    const { getSelectedItems } = useCart()

    // Get only selected items from cart
    const selectedItems = getSelectedItems()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            promoCode: "",
            deliveryOption: "standard",
        },
    })
    const handleAddNewAddressClick = () => {
        setShowAddAddressForm(true);
      };
    
      const handleCloseForm = () => {
        setShowAddAddressForm(false);
      };

    function onSubmit() {
        router.push("/user/checkout/payment")
    }

    // Calculate totals based on selected items
    const subtotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const deliveryFee = 50
    const total = subtotal + deliveryFee

    // If no items are selected, redirect to cart
    if (selectedItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 md:py-12 bg-gray-50">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-4">No items selected</h2>
                    <p className="text-gray-600 mb-4">Please select items in your cart to proceed with checkout</p>
                    <Link href="/user//cart">
                        <Button className="bg-[#FF6A00] hover:bg-[#E05F00]">Return to Cart</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 bg-gray-50 relative">
            {/* Header with Daraz logo */}


            <div className="mb-8 flex items-center justify-between">
                <Link href="/user/cart" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back to cart
                </Link>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-md shadow-sm mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Shipping Address</h2>
                            <Button
                                variant="ghost"
                                className="text-[#00A0D0] hover:text-[#00A0D0] hover:bg-blue-50 p-0 h-auto"
                                onClick={() => setShowAddressModal(true)}
                            >
                                EDIT
                            </Button>
                        </div>
                        <div className="mb-2">
                            <span className="font-medium">Ishwor Nepal</span>
                            <span className="ml-4 text-gray-600">9762884914</span>
                        </div>
                        <div className="flex items-center mb-4">
                            <Badge className="bg-[#00A0D0] text-white rounded-md mr-2 font-normal">OFFICE</Badge>
                            <span className="text-gray-700">
                                Peshalaya, Shankhamul Area, Kathmandu Metro 10 - New Baneshwor Area, Bagmati Province
                            </span>
                        </div>

                        <div className="border border-[#00A0D0] border-dashed rounded-md p-4 text-[#00A0D0]">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">
                                        Collect your parcel from the nearest Daraz Pick-up Point with a reduced shipping fee (Pre-Payment
                                        Only)
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">6 suggested collection point(s) nearby</p>
                                </div>
                                <ChevronRight className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-md shadow-sm mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-lg font-semibold">Package 1 of 1</h2>
                                <p className="text-sm text-gray-500">
                                    Fulfilled by <span className="font-medium">Daraz</span>
                                </p>
                            </div>
                        </div>

                        <Form {...form}>
                            <form className="space-y-6">
                                <div>
                                    <h3 className="font-medium mb-4">Choose your delivery option</h3>
                                    <FormField
                                        control={form.control}
                                        name="deliveryOption"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                                                        <Card
                                                            className={`border-2 ${field.value === "standard" ? "border-[#00A0D0]" : "border-gray-200"}`}
                                                        >
                                                            <CardContent className="p-4">
                                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                                    <FormControl>
                                                                        <RadioGroupItem value="standard" />
                                                                    </FormControl>
                                                                    <div className="flex flex-1 items-center justify-between">
                                                                        <div>
                                                                            <FormLabel className="font-medium">Rs. {deliveryFee}</FormLabel>
                                                                            <p className="text-gray-600">Standard Delivery</p>
                                                                            <p className="text-gray-600 text-sm">Get by 13-15 Apr</p>
                                                                        </div>
                                                                    </div>
                                                                </FormItem>
                                                            </CardContent>
                                                        </Card>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </form>
                        </Form>

                        <Separator className="my-6" />

                        {/* Dynamic Product List */}
                        {selectedItems.map((item) => (
                            <div key={item.id} className="flex items-start space-x-4 mb-4">
                                <div className="flex-shrink-0 w-20 h-20 relative">
                                    <Image
                                        src={item.images && item.images.length > 0 ? item.images[0] : "/placeholder.svg?height=80&width=80"}
                                        alt={item.name}
                                        fill
                                        className="object-contain"
                                    />
                                      {/* <div className="absolute top-0 left-0 bg-[#FF6A00] text-white text-xs px-1">{item.name}</div>
                                    <div className="absolute top-0 left-0 bg-[#FF6A00] text-white text-xs px-1">{item.price}</div> */}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between">

                                        <div className="text-gray-600">
                                        <div className="  text-black text-2xl px-1">{item.name}</div>
                                            <div className="font-medium text-[#FF6A00]">Rs. {item.price}</div>
                                            {item.originalPrice && (
                                                <div className="text-sm text-gray-500 line-through">Rs. {item.originalPrice}</div>
                                            )}
                                            {item.discount && <div className="text-sm text-gray-500">-{item.discount}%</div>}
                                        </div>
                                    </div>
                                    <div className="mt-2 flex justify-between items-center">
                                        <div className="text-gray-600">Qty: {item.quantity}</div>
                                        <Button variant="ghost" size="sm" className="text-gray-400 p-0 h-auto">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-md shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">Promotion</h2>
                        <div className="flex space-x-2">
                            <Input placeholder="Enter Store/Daraz Code" className="border-gray-300" />
                            <Button className="bg-[#00A0D0] hover:bg-[#0090C0]">APPLY</Button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-md shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Invoice and Contact Info</h2>
                          
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-md shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Items Total ({selectedItems.reduce((acc, item) => acc + item.quantity, 0)} Items)
                                </span>
                                <span>Rs. {subtotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Delivery Fee</span>
                                <span>Rs. {deliveryFee}</span>
                            </div>
                            <Separator className="my-3" />
                            <div className="flex justify-between font-medium">
                                <span>Total:</span>
                                <span className="text-[#FF6A00] text-xl">Rs. {total}</span>
                            </div>
                            <p className="text-sm text-gray-500 text-right">All taxes included</p>
                        </div>
                        <Button className="w-full mt-4 bg-[#FF6A00] hover:bg-[#E05F00] text-white" onClick={onSubmit}>
                            Proceed to Pay
                        </Button>
                    </div>
                </div>
            </div>

            {/* Address Selection Modal */}
            {showAddressModal && !showAddAddressForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-md shadow-lg w-full max-w-3xl">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-semibold">Shipping Address</h2>
                            <Button
                                variant="link"
                                className="text-[#00A0D0] p-0 h-auto"
                                onClick={handleAddNewAddressClick}
                            >
                                Add new address
                            </Button>
                        </div>

                        <div className="p-6">
                            <div className="border rounded-md p-4 mb-4 flex items-start">
                                <div className="mr-3 mt-1">
                                    <Checkbox id="address" checked={true} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <span className="font-medium mr-3">Ishwor Nepal</span>
                                        <span className="text-gray-600">9762884914</span>
                                    </div>
                                    <div className="flex items-center mb-2">
                                        <Badge className="bg-[#00A0D0] text-white rounded-md mr-2 font-normal">
                                            OFFICE
                                        </Badge>
                                        <span>Peshalaya</span>
                                    </div>
                                    <div className="text-gray-600 text-sm mb-3">
                                        Region: Bagmati Province - Kathmandu Metro 10 - New Baneshwor Area - Shankhamul Area
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs h-7 border-[#00A0D0] text-[#00A0D0]"
                                        >
                                            Default Shipping Address
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs h-7 border-gray-300 text-gray-600"
                                        >
                                            Default Billing Address
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end p-6 border-t gap-3">
                            <Button variant="outline" className="px-8" onClick={() => setShowAddressModal(false)}>
                                CANCEL
                            </Button>
                            <Button className="bg-[#00A0D0] hover:bg-[#0090C0] px-8" onClick={() => setShowAddressModal(false)}>
                                SAVE
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {showAddressModal && showAddAddressForm && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-2xl shadow-lg">
                        <div className="flex justify-between items-center p-6 pb-4">
                            <h2 className="text-xl font-medium">Add new shipping Address</h2>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={handleCloseForm}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 pt-0">
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                        Full name
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        placeholder="Enter your first and last name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                                        Region
                                    </label>
                                    <select
                                        id="region"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none bg-white"
                                    >
                                        <option value="" disabled selected>
                                            Please choose your region
                                        </option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        placeholder="Please enter your phone number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                        City
                                    </label>
                                    <select
                                        id="city"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none bg-white"
                                    >
                                        <option value="" disabled selected>
                                            Please choose your city
                                        </option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="building" className="block text-sm font-medium text-gray-700">
                                        Building / House No / Floor / Street
                                    </label>
                                    <input
                                        type="text"
                                        id="building"
                                        placeholder="Please enter"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                                        Area
                                    </label>
                                    <select
                                        id="area"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none bg-white"
                                    >
                                        <option value="" disabled selected>
                                            Please choose your area
                                        </option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="colony" className="block text-sm font-medium text-gray-700">
                                        Colony / Suburb / Locality / Landmark
                                    </label>
                                    <input
                                        type="text"
                                        id="colony"
                                        placeholder="Please enter"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        placeholder="For Example: House# 123, Street# 123, ABC Road"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2 space-y-2 mt-2">
                                    <p className="block text-sm font-medium text-gray-700">Select a label for effective delivery:</p>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedLabel("OFFICE")}
                                            className={`flex items-center gap-2 px-6 py-3 border rounded-md ${selectedLabel === "OFFICE" ? "border-teal-500 text-teal-600" : "border-gray-300 text-gray-600"
                                                }`}
                                        >
                                            <Briefcase className="h-5 w-5" />
                                            OFFICE
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedLabel("HOME")}
                                            className={`flex items-center gap-2 px-6 py-3 border rounded-md ${selectedLabel === "HOME" ? "border-teal-500 text-teal-600" : "border-gray-300 text-gray-600"
                                                }`}
                                        >
                                            <Home className="h-5 w-5" />
                                            HOME
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <div className="flex justify-end gap-4 mt-8">
                                <button className="px-8 py-3 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">CANCEL</button>
                                <button className="px-8 py-3 bg-teal-500 text-white rounded-md hover:bg-teal-600">SAVE</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
