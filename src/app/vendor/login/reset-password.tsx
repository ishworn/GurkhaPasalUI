"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface ResetPasswordOTPVerificationProps {
  email: string
  onVerified: (token: string) => void
  onBack: () => void
}

export default function ResetPasswordOTPVerification({ email, onVerified, onBack }: ResetPasswordOTPVerificationProps) {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit verification code", {
        position: "top-right",
        autoClose: 5000,
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:8000/api/verify_reset_otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("OTP verified successfully!", {
          position: "top-right",
          autoClose: 3000,
        })
        // Pass the reset token to the parent component to show password reset form
        onVerified(data.token || "reset-token")
      } else {
        toast.error(data.error || "Invalid verification code. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        })
      }
    } catch (error) {
      console.error("OTP verification error:", error)
      toast.error("An error occurred during verification. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:8000/api/password_reset_otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.info("A new verification code has been sent to your email.", {
          position: "top-right",
          autoClose: 5000,
        })
      } else {
        toast.error(data.error || "Failed to resend verification code. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        })
      }
    } catch (error) {
      console.error("Resend OTP error:", error)
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-orange-50 p-4">
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
            Back
          </Button>
          <CardTitle className="text-2xl text-orange-700">Verify your identity</CardTitle>
          <CardDescription>
            Enter the verification code sent to <span className="font-medium">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex justify-center gap-2">
                {/* OTP input fields */}
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <Input
                      key={index}
                      type="text"
                      maxLength={1}
                      className="w-12 h-12 text-center text-xl border-orange-200 focus-visible:ring-orange-500"
                      value={otp[index] || ""}
                      onChange={(e) => {
                        const newOtp = otp.split("")
                        newOtp[index] = e.target.value
                        setOtp(newOtp.join(""))

                        // Auto-focus next input
                        if (e.target.value && index < 5) {
                          const nextInput = document.querySelector(`input[name=reset-otp-${index + 1}]`)
                          if (nextInput) (nextInput as HTMLInputElement).focus()
                        }
                      }}
                      onKeyDown={(e) => {
                        // Handle backspace to go to previous input
                        if (e.key === "Backspace" && !otp[index] && index > 0) {
                          const prevInput = document.querySelector(`input[name=reset-otp-${index - 1}]`)
                          if (prevInput) (prevInput as HTMLInputElement).focus()
                        }
                      }}
                      name={`reset-otp-${index}`}
                    />
                  ))}
              </div>

              <p className="text-sm text-orange-600">
                Didn't receive the code?{" "}
                <Button
                  variant="link"
                  type="button"
                  className="p-0 h-auto text-orange-700 hover:text-orange-800"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                >
                  Resend
                </Button>
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              disabled={otp.length !== 6 || isLoading}
            >
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
