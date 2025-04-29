"use client"

import { useState, useEffect } from "react"
import { Info } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { v4 as uuidv4 } from "uuid"

export default function PaymentMethodPage() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)

  function handlePayment() {
    toast({
      title: "Payment successful!",
      description: "Your order has been placed and will be processed shortly.",
    })
  }

  const [totalAmt, setTotalAmt] = useState(300)

  const [formData, setFormData] = useState({
    amount: "100",
    total_amount: "110",
    tax_amount: "0",
    transaction_uuid: uuidv4(),
    product_delivery_charge: "0",
    product_service_charge: "0",
    product_code: "EPAYTEST",
    failure_url: "https://developer.esewa.com.np/failure",
    success_url: "https://developer.esewa.com.np/success",
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: "",
    secret: "8gBm/:&EnhH.1/q",
  })

  const CryptoJS = require("crypto-js")

  const generateSignature = (total_amount: string, transaction_uuid: string, product_code: string, secret: string) => {
    const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`
    const hash = CryptoJS.HmacSHA256(hashString, secret)
    const hashSignature = CryptoJS.enc.Base64.stringify(hash)
    return hashSignature
  }

  // Update signature whenever important fields change
  useEffect(() => {
    const { total_amount, transaction_uuid, product_code, secret } = formData
    const hashedSignature = generateSignature(total_amount, transaction_uuid, product_code, secret)
    setFormData((prev) => ({
      ...prev,
      signature: hashedSignature,
    }))
  }, [formData.total_amount, formData.transaction_uuid])

  // Remove the handleAmountChange function and add this useEffect
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      amount: totalAmt.toString(),
      total_amount: totalAmt.toString(),
    }))
  }, [totalAmt])

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 bg-gray-50">
      {/* Alert banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-8 flex items-center">
        <Info className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
        <p className="text-amber-600">
          Ensure you have collected the payment voucher to get Bank and Wallet Discounts. 0% EMI available on selected
          bank partners.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-semibold mb-6">Select Payment Method</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Credit/Debit Card */}
            <Card
              className={`cursor-pointer hover:border-[#00A0D0] transition-colors ${selectedMethod === "card" ? "border-[#00A0D0] border-2" : ""} opacity-50`}
              onClick={() =>
                toast({
                  title: "Not Available",
                  description: "This payment method is not available at the moment.",
                })
              }
            >
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 flex items-center justify-center mb-3">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="12" width="32" height="24" rx="2" fill="#1E88E5" />
                    <rect x="8" y="16" width="32" height="4" fill="#0D47A1" />
                    <rect x="12" y="24" width="8" height="4" rx="1" fill="white" />
                  </svg>
                </div>
                <h3 className="font-medium">Credit/Debit Card</h3>
                <p className="text-sm text-gray-500">Not Available</p>
              </CardContent>
            </Card>

            {/* eSewa Mobile Wallet */}
            <Card
              className={`cursor-pointer hover:border-[#00A0D0] transition-colors ${selectedMethod === "esewa" ? "border-[#00A0D0] border-2" : ""}`}
              onClick={() => setSelectedMethod("esewa")}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 flex items-center justify-center mb-3">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="20" fill="#60B158" />
                    <path
                      d="M24 14C18.48 14 14 18.48 14 24C14 29.52 18.48 34 24 34C29.52 34 34 29.52 34 24C34 18.48 29.52 14 24 14ZM27 27.5H21C20.17 27.5 19.5 26.83 19.5 26V22C19.5 21.17 20.17 20.5 21 20.5H27C27.83 20.5 28.5 21.17 28.5 22V26C28.5 26.83 27.83 27.5 27 27.5Z"
                      fill="white"
                    />
                    <path
                      d="M24 23.5C24.83 23.5 25.5 22.83 25.5 22C25.5 21.17 24.83 20.5 24 20.5C23.17 20.5 22.5 21.17 22.5 22C22.5 22.83 23.17 23.5 24 23.5Z"
                      fill="#60B158"
                    />
                  </svg>
                </div>
                <h3 className="font-medium">eSewa Mobile Wallet</h3>
                <p className="text-sm text-gray-500">eSewa Mobile Wallet</p>
              </CardContent>
            </Card>

            {/* IME Pay */}
            <Card
              className={`cursor-pointer hover:border-[#00A0D0] transition-colors ${selectedMethod === "ime" ? "border-[#00A0D0] border-2" : ""} opacity-50`}
              onClick={() =>
                toast({
                  title: "Not Available",
                  description: "This payment method is not available at the moment.",
                })
              }
            >
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 flex items-center justify-center mb-3">
                  <div className="bg-red-600 text-white text-xs font-bold py-1 px-2 rounded">IME PAY</div>
                </div>
                <h3 className="font-medium">IME Pay</h3>
                <p className="text-sm text-gray-500">Not Available</p>
              </CardContent>
            </Card>

            {/* Cash on Delivery */}
            <Card
              className={`cursor-pointer hover:border-[#00A0D0] transition-colors ${selectedMethod === "cash" ? "border-[#00A0D0] border-2" : ""} opacity-50`}
              onClick={() =>
                toast({
                  title: "Not Available",
                  description: "This payment method is not available at the moment.",
                })
              }
            >
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 flex items-center justify-center mb-3">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="12" width="32" height="24" rx="2" fill="#BDBDBD" />
                    <circle cx="24" cy="24" r="6" fill="#757575" />
                    <path d="M24 21V27" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M27 24H21" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="font-medium">Cash on Delivery</h3>
                <p className="text-sm text-gray-500">Not Available</p>
              </CardContent>
            </Card>
          </div>

          {selectedMethod === "esewa" && (
            <div className="mt-8">
              <form action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
                {/* Hidden fields */}
                <input type="hidden" name="amount" value={formData.amount} required />
                <input type="hidden" name="tax_amount" value={formData.tax_amount} required />
                <input type="hidden" name="total_amount" value={formData.total_amount} required />
                <input type="hidden" name="transaction_uuid" value={formData.transaction_uuid} required />
                <input type="hidden" name="product_code" value={formData.product_code} required />
                <input type="hidden" name="product_service_charge" value={formData.product_service_charge} required />
                <input type="hidden" name="product_delivery_charge" value={formData.product_delivery_charge} required />
                <input type="hidden" name="success_url" value={formData.success_url} required />
                <input type="hidden" name="failure_url" value={formData.failure_url} required />
                <input type="hidden" name="signed_field_names" value={formData.signed_field_names} required />
                <input type="hidden" name="signature" value={formData.signature} required />

                <div className="bg-gray-100 p-4 rounded-md mb-4">
                  <p className="text-gray-700">
                    Payment Amount: <span className="font-semibold">Rs. {totalAmt}</span>
                  </p>
                </div>

                <input
                  type="submit"
                  value="Pay with eSewa"
                  className="bg-[#60B158] hover:bg-[#4e9e47] text-white font-semibold py-2 px-4 rounded mt-4 cursor-pointer w-full"
                />
              </form>
            </div>
          )}
        </div>

        <div>
          <div className="bg-white p-6 rounded-md shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal(2 items and shipping fee included)</span>
                <span>556</span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="font-medium text-lg">Total Amount</span>
                <span className="text-[#FF6A00] text-xl font-medium">Rs. {totalAmt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
