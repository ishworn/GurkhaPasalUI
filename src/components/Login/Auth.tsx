"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Facebook, Mail, Instagram, ArrowLeft, CheckCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import ForgotPasswordModal from "./ForgotPasswordModal"
import { toast } from "react-toastify"

export default function AuthPage() {

    const [view, setView] = useState<'login' | 'forgot'>('login');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showOtpVerification, setShowOtpVerification] = useState<boolean>(false)
    const [email, setEmail] = useState<string>("")
    const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""])
    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])
    const [otpVerified, setOtpVerified] = useState<boolean>(false)
    const [otpError, setOtpError] = useState<string>("")


    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    // Initialize refs array
    useEffect(() => {
        otpInputRefs.current = otpInputRefs.current.slice(0, 6)
    }, [])

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
                        router.push('/admin/dashboard')
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

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Get email from form
        const formData = new FormData(e.target as HTMLFormElement)
        const emailValue = formData.get("email") as string
        setEmail(emailValue)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            setShowOtpVerification(true)
        }, 1500)
    }

    const handleSocialAuth = (provider: string) => {
        console.log(`Authenticating with ${provider}`)
        // Implement social authentication logic here
    }

    const handleOtpChange = (index: number, value: string) => {
        // Update OTP values
        const newOtpValues = [...otpValues]
        newOtpValues[index] = value
        setOtpValues(newOtpValues)

        // Auto-focus next input
        if (value && index < 5) {
            otpInputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace to go to previous input
        if (e.key === "Backspace" && !otpValues[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus()
        }
    }

    const handleVerifyOtp = () => {
        setIsLoading(true)
        const otp = otpValues.join("")

        // Simulate OTP verification
        setTimeout(() => {
            setIsLoading(false)

            // For demo purposes, any complete 6-digit OTP is considered valid
            if (otp.length === 6 && /^\d+$/.test(otp)) {
                setOtpVerified(true)
                setOtpError("")
            } else {
                setOtpError("Invalid verification code. Please try again.")
            }
        }, 1500)
    }


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

    const handleResendOtp = () => {
        setOtpValues(["", "", "", "", "", ""])
        setOtpError("")

        // Simulate resending OTP
        setTimeout(() => {
            // Focus first input after resend
            otpInputRefs.current[0]?.focus()
        }, 1000)
    }

    const handleBackToSignup = () => {
        setShowOtpVerification(false)
        setOtpValues(["", "", "", "", "", ""])
        setOtpError("")
        setOtpVerified(false)
    }

    return (
        <div className="modal">
            {view === 'login' ? (
                <div >
                    <Card className="w-full max-w-md shadow-lg border-orange-100 overflow-hidden">
                        <div className="relative">
                            {/* Main Auth Card */}
                            <div
                                className={`transition-transform duration-500 ease-in-out ${showOtpVerification ? "-translate-x-full" : "translate-x-0"
                                    }`}
                            >
                                <Tabs defaultValue="login" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 bg-orange-100">
                                        <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-orange-600">
                                            Login
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="signup"
                                            className="data-[state=active]:bg-white data-[state=active]:text-orange-600"
                                        >
                                            Sign Up
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Login Tab */}
                                    <TabsContent value="login">
                                        <CardHeader>
                                            <CardTitle className="text-2xl text-orange-700">Welcome back</CardTitle>
                                            <CardDescription>Sign in to your account to continue</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <form onSubmit={handleLogin} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="email" className="text-orange-800">
                                                        Email
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        placeholder="name@example.com"
                                                        value={loginEmail}
                                                        required
                                                        className="border-orange-200 focus-visible:ring-orange-500"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label htmlFor="password" className="text-orange-800">
                                                            Password
                                                        </Label>
                                                        <Button
                                                            variant="link"
                                                            className="p-0 text-sm font-medium text-orange-600 hover:text-orange-800"
                                                            onClick={() => setView('forgot')}
                                                            type="button"
                                                        >
                                                            Forgot password?
                                                        </Button>

                                                    </div>
                                                    <ForgotPasswordModal
                                                        open={showForgotPassword}
                                                        onClose={() => setShowForgotPassword(false)}
                                                    />
                                                    <Input
                                                        id="password"
                                                        type="password"
                                                        required
                                                        className="border-orange-200 focus-visible:ring-orange-500"
                                                        value={loginPassword}
                                                    />
                                                </div>
                                                <div className="flex items-center space-x-2 my-2">
                                                    <Checkbox
                                                        id="remember-me"
                                                        className="border-orange-300 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                                                    />
                                                    <label
                                                        htmlFor="remember-me"
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-orange-800"
                                                    >
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
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleSocialAuth("Google")}
                                                    className="w-full border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                                                >
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    <span className="sm:inline">Google</span>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleSocialAuth("Facebook")}
                                                    className="w-full border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                                                >
                                                    <Facebook className="mr-2 h-4 w-4" />
                                                    <span className="sm:inline">Facebook</span>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleSocialAuth("Instagram")}
                                                    className="w-full border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                                                >
                                                    <Instagram className="mr-2 h-4 w-4" />
                                                    <span className="sm:inline">Instagram</span>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </TabsContent>

                                    {/* Sign Up Tab */}
                                    <TabsContent value="signup">
                                        <CardHeader>
                                            <CardTitle className="text-2xl text-orange-700">Create an account</CardTitle>
                                            <CardDescription>Enter your details to get started</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <form onSubmit={handleSignup} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="username" className="text-orange-800">
                                                        Username
                                                    </Label>
                                                    <Input
                                                        id="username"
                                                        name="username"
                                                        required
                                                        className="border-orange-200 focus-visible:ring-orange-500"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email-signup" className="text-orange-800">
                                                        Email
                                                    </Label>
                                                    <Input
                                                        id="email-signup"
                                                        name="email"
                                                        type="email"
                                                        placeholder="name@example.com"
                                                        required
                                                        className="border-orange-200 focus-visible:ring-orange-500"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="password-signup" className="text-orange-800">
                                                        Password
                                                    </Label>
                                                    <Input
                                                        id="password-signup"
                                                        type="password"
                                                        required
                                                        className="border-orange-200 focus-visible:ring-orange-500"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="confirm-password" className="text-orange-800">
                                                        Confirm Password
                                                    </Label>
                                                    <Input
                                                        id="confirm-password"
                                                        type="password"
                                                        required
                                                        className="border-orange-200 focus-visible:ring-orange-500"
                                                    />
                                                </div>
                                                <div className="flex items-center space-x-2 my-2">
                                                    <Checkbox
                                                        id="terms"
                                                        required
                                                        className="border-orange-300 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                                                    />
                                                    <label
                                                        htmlFor="terms"
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-orange-800"
                                                    >
                                                        I agree to the{" "}
                                                        <Button variant="link" className="h-auto p-0 text-orange-600 hover:text-orange-800">
                                                            terms and conditions
                                                        </Button>
                                                    </label>
                                                </div>
                                                <Button
                                                    type="submit"
                                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                                                    disabled={isLoading}
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
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleSocialAuth("Google")}
                                                    className="w-full border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                                                >
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    <span className="sm:inline">Google</span>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleSocialAuth("Facebook")}
                                                    className="w-full border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                                                >
                                                    <Facebook className="mr-2 h-4 w-4" />
                                                    <span className="sm:inline">Facebook</span>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleSocialAuth("Instagram")}
                                                    className="w-full border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                                                >
                                                    <Instagram className="mr-2 h-4 w-4" />
                                                    <span className="sm:inline">Instagram</span>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </TabsContent>
                                </Tabs>
                            </div>

                            {/* OTP Verification Card */}
                            <div
                                className={`absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out ${showOtpVerification ? "translate-x-0" : "translate-x-full"
                                    }`}
                            >
                                <div className="h-full">
                                    <CardHeader>
                                        <Button
                                            variant="ghost"
                                            className="mb-2 w-fit p-0 text-orange-600 hover:bg-transparent hover:text-orange-800"
                                            onClick={handleBackToSignup}
                                            disabled={isLoading || otpVerified}
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Back
                                        </Button>
                                        <CardTitle className="text-2xl text-orange-700">Verify your email</CardTitle>
                                        <CardDescription>
                                            {otpVerified
                                                ? "Your email has been successfully verified!"
                                                : `We've sent a verification code to ${email}. Enter the code below to verify your account.`}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {!otpVerified ? (
                                            <div className="space-y-6">
                                                <div className="space-y-4">
                                                    <div className="flex justify-center space-x-2">
                                                        {otpValues.map((value, index) => (
                                                            <Input
                                                                key={index}
                                                                type="text"
                                                                inputMode="numeric"
                                                                maxLength={1}
                                                                pattern="[0-9]"
                                                                className="w-10 h-12 text-center text-lg border-orange-200 focus-visible:ring-orange-500"
                                                                value={value}
                                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                                ref={(el) => {
                                                                    otpInputRefs.current[index] = el;
                                                                }}
                                                                disabled={isLoading}
                                                            />
                                                        ))}
                                                    </div>
                                                    {otpError && <p className="text-sm text-red-500 text-center">{otpError}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <Button
                                                        onClick={handleVerifyOtp}
                                                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                                                        disabled={isLoading || otpValues.some((v) => !v)}
                                                    >
                                                        {isLoading ? "Verifying..." : "Verify"}
                                                    </Button>
                                                    <div className="text-center">
                                                        <Button
                                                            variant="link"
                                                            onClick={handleResendOtp}
                                                            className="text-orange-600 hover:text-orange-800"
                                                            disabled={isLoading}
                                                        >
                                                            Didn't receive a code? Resend
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center space-y-4 py-6">
                                                <div className="rounded-full bg-green-100 p-3">
                                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                                </div>
                                                <h3 className="text-xl font-medium text-green-800">Verification Successful</h3>
                                                <p className="text-center text-muted-foreground">
                                                    Your account has been successfully verified. You can now access all features.
                                                </p>
                                                <Button
                                                    onClick={() => router.push("/")}
                                                    className="mt-2 bg-orange-600 hover:bg-orange-700 text-white"
                                                >
                                                    Continue to Login
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            ) : (
                <div className="forgot-form">
                    <div>
                        <Card className="w-full max-w-md shadow-lg border-orange-100">
                            <CardHeader>
                                <Button
                                    variant="ghost"
                                    className="mb-2 w-fit p-0 text-orange-600 hover:bg-orange-50 hover:text-orange-800"
                                    onClick={() => setView('login')}
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
                                                onClick={() => setIsSubmitted(false)} // Reset to show form again
                                                variant="outline"
                                                className="w-full border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                                            >
                                                Try another email
                                            </Button>
                                            <Button
                                                onClick={() => setView('login')}
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

                </div>
            )}
        </div>
    )
}













