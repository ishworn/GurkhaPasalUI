"use client"

import type React from "react"
import { type SyntheticEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
// Import additional icons for password validation
import { Facebook, Mail, Instagram, Eye, EyeOff, Check, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ForgotPasswordPage from "@/app/admin/login/forget-password-page"

export default function AuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [forgotPassword, setForgotPassword] = useState(false)
  const [showOTPSection, setShowOTPSection] = useState(false)
  const [accountCreated, setAccountCreated] = useState(false)

  // Login states
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Signup states
  const [name, setName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Add password validation state after the password visibility state variables
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Add password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecial: false,
  })

  // Update the OTP state to handle individual digits
  const [otp, setOtp] = useState("")

  // Update the handleLogin function to properly handle login response and redirect
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        localStorage.setItem("jwt", data.jwt)

        // Show success toast
        toast.success(`Login successful! Welcome back, ${data.name || "User"}!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })

        const userResponse = await fetch('http://127.0.0.1:8000/api/user/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${data.jwt}`
          }
        })

        const userData = await userResponse.json()

        if (userResponse.ok) {
          // Save user data in localStorage (or context)
          localStorage.setItem('user', JSON.stringify(userData))

          // Route based on role
          if (userData.role === 'admin') {
            router.push('/admin')
          } else if (userData.role === 'user') {
            router.push('/')
          } else {
            toast.error('Unauthorized role')
          }
        } else {
          toast.error(userData.error || 'Failed to fetch user data')
        }


        // route base on roles


      } else {
        // Show error toast
        toast.error(data.error || "Login failed. Please check your credentials.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("An error occurred during login. Please try again.", {
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

  // Add a function to validate password after the handleResendOTP function
  const validatePassword = (password: string) => {
    setPasswordValidation({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    })
  }

  const handleSignup = async (e: SyntheticEvent) => {
    e.preventDefault()

    // Check if password meets all requirements
    const isPasswordValid = Object.values(passwordValidation).every((value) => value === true)

    if (!isPasswordValid) {
      toast.error("Please ensure your password meets all requirements.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      return
    }

    if (signupPassword !== confirmPassword) {
      toast.error("Passwords do not match!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          email: signupEmail,
          password: signupPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setAccountCreated(true)
        setShowOTPSection(true) // Show OTP section after signup
        toast.success("Account created! Please verify your email with the OTP sent to your inbox.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } else {
        toast.error(data.error || "Failed to create account. Please try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      }
    } catch (error) {
      console.error("Signup error:", error)
      toast.error("An error occurred during signup. Please try again.", {
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

  // Update the handleOtpVerification function to properly redirect after successful verification
  const handleOtpVerification = async (e: SyntheticEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("http://127.0.0.1:8000/api/verify_otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: signupEmail,
          otp: otp,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Your account has been verified. You can now login.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })

        // Reset to login tab after successful verification
        setShowOTPSection(false)
        setAccountCreated(false)
        // Clear signup form
        setName("")
        setSignupEmail("")
        setSignupPassword("")
        setConfirmPassword("")
        setOtp("")
      } else {
        toast.error(data.error || "OTP verification failed. Please try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      }
    } catch (error) {
      console.error("OTP verification error:", error)
      toast.error("An error occurred during verification. Please try again.", {
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

  const handleSocialAuth = (provider: string) => {
    console.log(`Authenticating with ${provider}`)
  }

  const handleResendOTP = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("http://127.0.0.1:8000/api/resend_otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: signupEmail,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.info("A new verification code has been sent to your email.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } else {
        toast.error(data.error || "Failed to resend OTP. Please try again later.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      }
    } catch (error) {
      console.error("Resend OTP error:", error)
      toast.error("Failed to resend verification code. Please try again.", {
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

  if (forgotPassword) {
    return (
      <>
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
        <ForgotPasswordPage onBack={() => setForgotPassword(false)} />
      </>
    )
  }

  // Replace the existing OTP verification section with this improved version
  if (showOTPSection) {
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
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-orange-700">Verify Your Email</CardTitle>
            <CardDescription>
              We've sent a verification code to <span className="font-medium">{signupEmail}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                          const nextInput = document.querySelector(`input[name=otp-${index + 1}]`)
                          if (nextInput) (nextInput as HTMLInputElement).focus()
                        }
                      }}
                      onKeyDown={(e) => {
                        // Handle backspace to go to previous input
                        if (e.key === "Backspace" && !otp[index] && index > 0) {
                          const prevInput = document.querySelector(`input[name=otp-${index - 1}]`)
                          if (prevInput) (prevInput as HTMLInputElement).focus()
                        }
                      }}
                      name={`otp-${index}`}
                    />
                  ))}
              </div>

              <p className="text-sm text-orange-600">
                Didn't receive the code?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-orange-700 hover:text-orange-800"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                >
                  Resend
                </Button>
              </p>
            </div>

            <Button
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              onClick={handleOtpVerification}
              disabled={otp.length !== 6 || isLoading}
            >
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </Button>

            <Button
              variant="outline"
              className="w-full border-orange-200 hover:bg-orange-50 text-orange-700"
              onClick={() => setShowOTPSection(false)}
            >
              Go back to signup
            </Button>
          </CardContent>
        </Card>
      </div>
    )
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
      <Card className="w-full max-w-md shadow-lg border-orange-100 px-5">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-orange-100">
            <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-orange-600">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:text-orange-600">
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="space-y-8">
            <CardHeader>
              <CardTitle className="text-2xl text-orange-700">Welcome back</CardTitle>
              <CardDescription>Sign in to your account to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login" className="text-orange-800">
                    Email
                  </Label>
                  <Input
                    id="email-login"
                    type="email"
                    required
                    className="border-orange-200 focus-visible:ring-orange-500"
                    onChange={(e) => setLoginEmail(e.target.value)}
                    value={loginEmail}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password-login" className="text-orange-800">
                      Password
                    </Label>
                    <Button
                      variant="link"
                      type="button"
                      className="p-0 text-sm font-medium text-orange-600 hover:text-orange-800"
                      onClick={() => setForgotPassword(true)}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password-login"
                      type={showLoginPassword ? "text" : "password"}
                      required
                      className="border-orange-200 focus-visible:ring-orange-500"
                      onChange={(e) => setLoginPassword(e.target.value)}
                      value={loginPassword}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-orange-600 hover:text-orange-800"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                    >
                      {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showLoginPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 my-2">
                  <Checkbox
                    id="remember-me"
                    className="border-orange-300 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                  />
                  <label htmlFor="remember-me" className="text-sm font-medium leading-none text-orange-800">
                    Remember me
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-orange-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-orange-600">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["Google", "Facebook", "Instagram"].map((provider) => (
                  <Button
                    key={provider}
                    variant="outline"
                    onClick={() => handleSocialAuth(provider)}
                    className="w-full border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                  >
                    {provider === "Google" && <Mail className="mr-2 h-4 w-4" />}
                    {provider === "Facebook" && <Facebook className="mr-2 h-4 w-4" />}
                    {provider === "Instagram" && <Instagram className="mr-2 h-4 w-4" />}
                    {provider}
                  </Button>
                ))}
              </div>
            </CardContent>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup" className="space-y-8">
            <CardHeader>
              <CardTitle className="text-2xl text-orange-700">Create an account</CardTitle>
              <CardDescription>Enter your details to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullname" className="text-orange-800">
                    Full Name
                  </Label>
                  <Input
                    id="fullname"
                    type="text"
                    required
                    className="border-orange-200 focus-visible:ring-orange-500"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-signup" className="text-orange-800">
                    Email
                  </Label>
                  <Input
                    id="email-signup"
                    type="email"
                    required
                    className="border-orange-200 focus-visible:ring-orange-500"
                    onChange={(e) => setSignupEmail(e.target.value)}
                    value={signupEmail}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup" className="text-orange-800">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password-signup"
                      type={showSignupPassword ? "text" : "password"}
                      required
                      className="border-orange-200 focus-visible:ring-orange-500"
                      onChange={(e) => {
                        setSignupPassword(e.target.value)
                        validatePassword(e.target.value)
                      }}
                      value={signupPassword}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-orange-600 hover:text-orange-800"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                    >
                      {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showSignupPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>

                  {/* Password validation indicators */}
                  {signupPassword.length > 0 && (
                    <div className="mt-2 space-y-1 text-sm">
                      <p className="font-medium text-orange-800 mb-1">Password must have:</p>
                      <div className="grid grid-cols-1 gap-1">
                        <div className="flex items-center gap-2">
                          {passwordValidation.minLength ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                          <span className={passwordValidation.minLength ? "text-green-600" : "text-red-500"}>
                            At least 8 characters
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {passwordValidation.hasUpperCase ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                          <span className={passwordValidation.hasUpperCase ? "text-green-600" : "text-red-500"}>
                            At least one uppercase letter
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {passwordValidation.hasNumber ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                          <span className={passwordValidation.hasNumber ? "text-green-600" : "text-red-500"}>
                            At least one number
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {passwordValidation.hasSpecial ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                          <span className={passwordValidation.hasSpecial ? "text-green-600" : "text-red-500"}>
                            At least one special character
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
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
                      className="border-orange-200 focus-visible:ring-orange-500"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      value={confirmPassword}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-orange-600 hover:text-orange-800"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 my-2">
                  <Checkbox
                    id="terms"
                    required
                    className="border-orange-300 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                  />
                  <label htmlFor="terms" className="text-sm font-medium leading-none text-orange-800">
                    I agree to the{" "}
                    <Button variant="link" className="h-auto p-0 text-orange-600 hover:text-orange-800">
                      terms and conditions
                    </Button>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  disabled={
                    isLoading ||
                    !Object.values(passwordValidation).every((value) => value === true) ||
                    signupPassword !== confirmPassword
                  }
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-orange-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-orange-600">Or sign up with</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["Google", "Facebook", "Instagram"].map((provider) => (
                  <Button
                    key={provider}
                    variant="outline"
                    onClick={() => handleSocialAuth(provider)}
                    className="w-full border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                  >
                    {provider === "Google" && <Mail className="mr-2 h-4 w-4" />}
                    {provider === "Facebook" && <Facebook className="mr-2 h-4 w-4" />}
                    {provider === "Instagram" && <Instagram className="mr-2 h-4 w-4" />}
                    {provider}
                  </Button>
                ))}
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
