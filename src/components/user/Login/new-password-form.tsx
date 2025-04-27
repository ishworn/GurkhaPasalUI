"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface NewPasswordFormProps {
  email: string
  token: string
  onSuccess: () => void
  onBack: () => void
}

export default function NewPasswordForm({ email, token, onSuccess, onBack }: NewPasswordFormProps) {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 5000,
      })
      return
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long", {
        position: "top-right",
        autoClose: 5000,
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:8000/api/reset_password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          token,
          new_password: newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Password reset successful!", {
          position: "top-right",
          autoClose: 3000,
        })
        onSuccess()
      } else {
        toast.error(data.error || "Failed to reset password. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        })
      }
    } catch (error) {
      console.error("Password reset error:", error)
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      })
    } finally {
      setIsLoading(false)
    }
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
            Back
          </Button>
          <CardTitle className="text-2xl text-orange-700">Create new password</CardTitle>
          <CardDescription>Your new password must be different from previously used passwords</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-orange-800">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="border-orange-200 focus-visible:ring-orange-500 pr-10"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-orange-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-orange-600" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-orange-800">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="border-orange-200 focus-visible:ring-orange-500 pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-orange-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-orange-600" />
                  )}
                </Button>
              </div>
            </div>

            {newPassword && (
              <div className="space-y-2">
                <p className="text-xs text-orange-700">Password requirements:</p>
                <ul className="text-xs space-y-1 text-orange-600">
                  <li className={newPassword.length >= 8 ? "text-green-600" : ""}>• At least 8 characters</li>
                  <li className={/[A-Z]/.test(newPassword) ? "text-green-600" : ""}>• At least one uppercase letter</li>
                  <li className={/[0-9]/.test(newPassword) ? "text-green-600" : ""}>• At least one number</li>
                  <li className={/[^A-Za-z0-9]/.test(newPassword) ? "text-green-600" : ""}>
                    • At least one special character
                  </li>
                </ul>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
