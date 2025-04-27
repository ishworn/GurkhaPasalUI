"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ResetPasswordOTPVerification from "./reset-password"
import NewPasswordForm from "./new-password-form"

type ForgotPasswordProps = {
  onBack: () => void
}

export default function ForgotPasswordPage({ onBack }: ForgotPasswordProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showOTPVerification, setShowOTPVerification] = useState(false)
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false)
  const [resetToken, setResetToken] = useState("")

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/forgot_password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
  
      const data = await response.json()
  
      if (response.ok) {
        toast.success("OTP sent to your email for password reset.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        setShowOTPVerification(true)
      } else {
        toast.error(data.error || "Failed to send OTP. Please try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      }
    } catch (error) {
      console.error("Send OTP error:", error)
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }
  

  // Handle OTP verification success
  const handleOTPVerified = (token: string) => {
    setResetToken(token)
    setShowOTPVerification(false)
    setShowNewPasswordForm(true)
  }

  // Handle password reset success
  const handlePasswordResetSuccess = () => {
    toast.success("Password reset successful! You can now login with your new password.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
    onBack() // Go back to login
  }

  // Show OTP verification screen
  if (showOTPVerification) {
    return (
      <ResetPasswordOTPVerification
        email={email}
        onVerified={handleOTPVerified}
        onBack={() => {
          setShowOTPVerification(false)
        }}
      />
    )
  }

  // Show new password form
  if (showNewPasswordForm) {
    return (
      <NewPasswordForm
        email={email}
        token={resetToken}
        onSuccess={handlePasswordResetSuccess}
        onBack={() => {
          setShowNewPasswordForm(false)
          setShowOTPVerification(true)
        }}
      />
    )
  }

  return (
    <div >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
      <Card className="w-full max-w-md shadow-lg border-orange-100">
        <CardHeader>
          <Button
            variant="ghost"
            className="mb-2 w-fit p-0 text-orange-600 hover:bg-orange-50 hover:text-orange-800"
            onClick={onBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Button>
          <CardTitle className="text-2xl text-orange-700">Reset your password</CardTitle>
          <CardDescription>Enter your email address and we'll send you a verification code</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendOTP} className="space-y-4">
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
            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send verification code"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
