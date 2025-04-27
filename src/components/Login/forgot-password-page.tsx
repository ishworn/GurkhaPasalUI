"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call to send reset email
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1500)
  }

  return (
    <div >
      <Card className="w-full max-w-md shadow-lg border-orange-100">
        <CardHeader>
          <Button
            variant="ghost"
            className="mb-2 w-fit p-0 text-orange-600 hover:bg-orange-50 hover:text-orange-800"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Button>
          <CardTitle className="text-2xl text-orange-700">Reset your password</CardTitle>
          <CardDescription>Enter your email address and we'll send you a link to reset your password</CardDescription>
        </CardHeader>
        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-orange-800">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-orange-200 focus-visible:ring-orange-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <div className="rounded-full bg-orange-100 p-3">
                  <CheckCircle className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-medium text-orange-800">Check your email</h3>
                <p className="text-sm text-orange-600">
                  We've sent a password reset link to <span className="font-medium">{email}</span>
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="w-full border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                >
                  Try another email
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Back to login
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
