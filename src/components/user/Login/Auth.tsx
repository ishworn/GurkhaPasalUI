"use client"

import type React from "react"

import { useState, useRef, useEffect, SyntheticEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Facebook, Mail, Instagram, ArrowLeft, CheckCircle, EyeOff, Eye } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

import ForgotPasswordPage from "./forgot-password-page"

import { toast, ToastContainer } from "react-toastify"
import { useCart } from "../context/CartContext"



interface AuthPageProps {
    onLoginSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {




    const [view, setView] = useState<'login' | 'forgot'>('login');
    const [forgotPassword, setForgotPassword] = useState(false)
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [showOtpVerification, setShowOtpVerification] = useState(false)
    const [email, setEmail] = useState<string>("")
    const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""])
    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])
    const [otpVerified, setOtpVerified] = useState(false)
    const [otpError, setOtpError] = useState<string>("")
    const [error, setError] = useState<string>("");



    const [isLoading, setIsLoading] = useState(false)




    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    // Signup states
    const [name, setName] = useState("")
    const [signupEmail, setSignupEmail] = useState("")
    const [signupPassword, setSignupPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")


    const searchParams = useSearchParams();
    const {

        addToCart,
        cartItems,
        updateQuantity,
        removeFromCart,
        handleCheckboxChange,
        selectedTotal,
        handleSelectAllChange,
        allSelected,
    } = useCart();

    // Initialize refs array
    useEffect(() => {
        otpInputRefs.current = otpInputRefs.current.slice(0, 6)
    }, [])







    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
    
        try {
            const response = await fetch("http://127.0.0.1:8000/api/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    email: loginEmail,
                    password: loginPassword,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                // Store JWT temporarily
                localStorage.setItem("jwt", data.jwt);
    
                // Fetch user details to get the role
                const userResponse = await fetch("http://127.0.0.1:8000/api/user/", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${data.jwt}`,
                    },
                });
    
                const userData = await userResponse.json();
    
                if (!userResponse.ok) {
                    throw new Error(userData.error || "Failed to retrieve user information.");
                }
    
                if (userData.role === "admin") {
                    localStorage.removeItem("jwt"); // Remove stored JWT
                    toast.error("Admins are not allowed to login here.", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                    return;
                }
    
                // ---- USER role is verified, proceed ----
                const redirectTo = localStorage.getItem("redirectAfterLogin");
                const productData = localStorage.getItem("productToBuy");
    
                if (productData) {
                    const product = JSON.parse(productData);
    
                    const existingProduct = cartItems.find((item) => item.id === product.id);
                    if (!existingProduct) {
                        addToCart(product);
                    }
    
                    handleCheckboxChange(product.id, true);
                    localStorage.removeItem("productToBuy");
                }
    
                onLoginSuccess();
    
                toast.success(`Login successful! Welcome back, ${userData.name || "User"}!`, {
                    position: "top-right",
                    autoClose: 3000,
                });
    
                if (redirectTo) {
                    localStorage.removeItem("redirectAfterLogin");
                    router.push(redirectTo);
                } else {
                    router.push("/");
                }
            } else {
                toast.error(data.error || "Login failed. Please check your credentials.", {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("An error occurred during login. Please try again.", {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setIsLoading(false);
        }
    };
    




    const handleSignup = async (e: SyntheticEvent) => {
        e.preventDefault()
        if (signupPassword !== confirmPassword) {
            alert("Passwords do not match!")
            return
        }

        setIsLoading(true)

        await fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                name,
                email: signupEmail,
                password: signupPassword,
            }),
        })

        setIsLoading(false)
        setShowOtpVerification(true) // Show OTP verification after signup
        // setShowOTPSection(true) // Show OTP section after signup
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



    const handleVerifyOtp = async () => {
        setIsLoading(true);
        setOtpError("");

        const otpCode = otpValues.join("");

        try {
            const response = await fetch("http://127.0.0.1:8000/api/verify_otp/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email: signupEmail,
                    otp: otpCode,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setOtpVerified(true); // switch to success UI
            } else {
                setOtpError(data.error || "Invalid OTP.");
            }
        } catch (error) {
            setOtpError("Server error. Please try again.");
        }

        setIsLoading(false);
    };






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

    const handleResendOtp = async () => {

        setOtpError("");

        try {
            const response = await fetch("http://127.0.0.1:8000/api/otp-resend/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email: signupEmail }),
            });

            const data = await response.json();

            if (!response.ok) {
                setOtpError(data.error || "Failed to resend OTP.");
            } else {
                // Optional: show confirmation message
                alert("New OTP sent to your email.");
            }
        } catch (error) {
            setOtpError("Error sending OTP. Please try again.");
        }


    };


    const handleBackToSignup = () => {
        setShowOtpVerification(false)
        setOtpValues(["", "", "", "", "", ""])
        setOtpError("")
        setOtpVerified(false)
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

    return (
        <div className="modal">

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
                                                    <Label htmlFor="password" className="text-orange-800">
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

                                                        required
                                                        type={showPassword ? "text" : "password"}
                                                        onChange={(e) => setLoginPassword(e.target.value)}
                                                        value={loginPassword}
                                                        className="border-orange-200 focus-visible:ring-orange-500"
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
                                        <CardTitle className="text-xl text-orange-700  ">Create an account</CardTitle>
                                        <CardDescription>Enter your details to get started</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <form onSubmit={handleSignup} className="space-y-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="username" className="text-orange-800">
                                                    Username
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

                                                        required
                                                        type={showPassword ? "text" : "password"}

                                                        className="border-orange-200 focus-visible:ring-orange-500 pr-10"
                                                        value={signupPassword}
                                                        onChange={(e) => setSignupPassword(e.target.value)}


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

                                                        required
                                                        className="border-orange-200 focus-visible:ring-orange-500"
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        value={confirmPassword}

                                                        type={showConfirmPassword ? "text" : "password"}



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
                                            {signupPassword && (
                                                <div className="space-y-2">
                                                    <p className="text-xs text-orange-700">Password requirements:</p>
                                                    <ul className="text-xs space-y-1 text-orange-600">
                                                        <li className={signupPassword.length >= 8 ? "text-green-600" : ""}>• At least 8 characters</li>
                                                        <li className={/[A-Z]/.test(signupPassword) ? "text-green-600" : ""}>• At least one uppercase letter</li>
                                                        <li className={/[0-9]/.test(signupPassword) ? "text-green-600" : ""}>• At least one number</li>
                                                        <li className={/[^A-Za-z0-9]/.test(signupPassword) ? "text-green-600" : ""}>
                                                            • At least one special character
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}




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
                                                type="button"
                                                onClick={handleBackToSignup}
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




        </div>
    )
}


export default AuthPage;
