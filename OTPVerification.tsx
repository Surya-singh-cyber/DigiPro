"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Shield, ArrowRight, RefreshCw, AlertCircle, Rocket } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

export const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(60)
  const [error, setError] = useState("")
  const [canResend, setCanResend] = useState(false)
  const [clientDemoMode, setClientDemoMode] = useState(true)
  const { user, verifyOTP, sendOTP, isLoading, firebaseUser, isDemoMode } = useAuth()

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  // Check demo mode on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDemo =
        window.location.hostname.includes("v0.dev") ||
        window.location.hostname.includes("vercel.app") ||
        window.location.hostname === "localhost" ||
        window.location.hostname.includes("preview")

      setClientDemoMode(isDemo)
      console.log("🚀 OTP Verification client demo mode:", isDemo)
    }
  }, [])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const otpString = otp.join("")
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    try {
      console.log("🚀 Submitting OTP verification:", otpString)
      await verifyOTP(otpString)
    } catch (err: any) {
      console.error("🚀 OTP verification error:", err)
      setError(err.message || "Invalid OTP. Please try again.")
      // Clear OTP inputs on error
      setOtp(["", "", "", "", "", ""])
      const firstInput = document.getElementById("otp-0")
      firstInput?.focus()
    }
  }

  const handleResendOTP = async () => {
    if (!canResend) return

    try {
      setError("")
      const phoneNumber = firebaseUser?.phoneNumber || user?.phone
      if (phoneNumber) {
        console.log("🚀 Resending OTP to:", phoneNumber)
        await sendOTP(phoneNumber)
        setTimeLeft(60)
        setCanResend(false)
        setOtp(["", "", "", "", "", ""])

        // Focus first input
        const firstInput = document.getElementById("otp-0")
        firstInput?.focus()
      }
    } catch (err: any) {
      console.error("🚀 Resend OTP error:", err)
      setError(err.message || "Failed to resend OTP. Please try again.")
    }
  }

  const formatPhoneNumber = (phone: string) => {
    if (phone.startsWith("+91")) {
      return phone.replace("+91", "+91-")
    }
    return `+91-${phone}`
  }

  const displayPhone = firebaseUser?.phoneNumber || user?.phone || "your phone"
  const showDemoNotice = clientDemoMode || isDemoMode

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-amber-600 p-3 rounded-xl">
            <Shield className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Phone</h1>
        <p className="text-gray-600">Enter the 6-digit code sent to</p>
        <p className="text-gray-900 font-medium">{formatPhoneNumber(displayPhone)}</p>
      </div>

      {/* Demo Mode Notice */}
      {showDemoNotice && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-1 rounded-full">
              <Rocket className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-sm">
              <p className="text-blue-800 font-bold flex items-center gap-1">🚀 Demo Mode Active</p>
              <p className="text-blue-700 mt-1">
                Enter <span className="font-mono bg-blue-100 px-2 py-1 rounded font-bold text-blue-900">123456</span> to
                continue
              </p>
              <p className="text-blue-600 text-xs mt-1">No real SMS verification required</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">Enter OTP Code</label>
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.join("").length !== 6}
          className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Verifying...</span>
            </>
          ) : (
            <>
              {showDemoNotice && <Rocket className="h-4 w-4" />}
              <span>Verify & Continue</span>
              {!showDemoNotice && <ArrowRight className="h-5 w-5" />}
            </>
          )}
        </button>

        <div className="text-center">
          {!canResend ? (
            <p className="text-gray-600">
              Resend code in <span className="text-amber-600 font-medium">{timeLeft}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isLoading}
              className="text-amber-600 hover:text-amber-700 font-medium flex items-center justify-center space-x-1 mx-auto disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Resend OTP</span>
            </button>
          )}
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            {showDemoNotice
              ? "Demo mode: Use 123456 as OTP code"
              : "Didn't receive the code? Check your SMS or try resending."}
          </p>
        </div>
      </form>
    </div>
  )
}
