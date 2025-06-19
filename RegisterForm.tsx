"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { User, Mail, Phone, Building2, FileText, ChevronDown, AlertCircle, Rocket } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import type { BusinessType } from "../../types"

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

const businessTypes: { value: BusinessType; label: string; description: string }[] = [
  { value: "automobile", label: "Automobile Agency", description: "Car dealers, service centers, spare parts" },
  { value: "medical", label: "Medical Facility", description: "Hospitals, clinics, pharmacies" },
  { value: "retail", label: "Retail Store", description: "Clothing, electronics, general stores" },
  { value: "school", label: "Educational Institution", description: "Schools, colleges, coaching centers" },
]

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "automobile" as BusinessType,
    gstNumber: "",
  })
  const [error, setError] = useState("")
  const [showBusinessTypes, setShowBusinessTypes] = useState(false)
  const [clientDemoMode, setClientDemoMode] = useState(false)
  const { register, isLoading, isDemoMode } = useAuth()

  // Check demo mode on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname
      const isDemo =
        hostname.includes("v0.dev") ||
        hostname.includes("vercel.app") ||
        hostname === "localhost" ||
        hostname.includes("preview") ||
        hostname.includes("127.0.0.1") ||
        hostname.includes("stackblitz") ||
        hostname.includes("webcontainer")

      setClientDemoMode(isDemo)
      console.log("🚀 RegisterForm client demo mode:", { hostname, isDemo })
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.email || !formData.phone || !formData.businessName) {
      setError("Please fill in all required fields")
      return
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/
    const cleanPhone = formData.phone.replace(/\D/g, "")
    if (!phoneRegex.test(cleanPhone)) {
      setError("Please enter a valid 10-digit Indian mobile number")
      return
    }

    try {
      console.log("🚀 RegisterForm submitting with demo mode:", clientDemoMode || isDemoMode)
      await register({
        ...formData,
        phone: cleanPhone,
      })
    } catch (err: any) {
      console.error("🚀 Registration error:", err)
      setError(err.message || "Registration failed. Please try again.")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const selectedBusinessType = businessTypes.find((bt) => bt.value === formData.businessType)
  const showDemoNotice = clientDemoMode || isDemoMode

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-emerald-600 p-3 rounded-xl">
            <Building2 className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h1>
        <p className="text-gray-600">Create your BizFlow Pro account</p>
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
                Use OTP code{" "}
                <span className="font-mono bg-blue-100 px-2 py-1 rounded font-bold text-blue-900">123456</span> for
                verification
              </p>
              <p className="text-blue-600 text-xs mt-1">No real SMS will be sent • Perfect for testing</p>
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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {showDemoNotice ? "Demo mode: Any valid number works" : "OTP will be sent to this number for verification"}
          </p>
        </div>

        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
            Business Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="businessName"
              type="text"
              value={formData.businessName}
              onChange={(e) => handleInputChange("businessName", e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="Enter your business name"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Type *</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowBusinessTypes(!showBusinessTypes)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-3 text-left focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{selectedBusinessType?.label}</div>
                  <div className="text-sm text-gray-500">{selectedBusinessType?.description}</div>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform ${showBusinessTypes ? "rotate-180" : ""}`}
                />
              </div>
            </button>

            {showBusinessTypes && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                {businessTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => {
                      handleInputChange("businessType", type.value)
                      setShowBusinessTypes(false)
                    }}
                    className="w-full text-left px-3 py-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="font-medium text-gray-900">{type.label}</div>
                    <div className="text-sm text-gray-500">{type.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700 mb-2">
            GST Number (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="gstNumber"
              type="text"
              value={formData.gstNumber}
              onChange={(e) => handleInputChange("gstNumber", e.target.value.toUpperCase())}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="27AAAPZ2271G1ZW"
              maxLength={15}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Sending OTP...
            </>
          ) : (
            <>
              {showDemoNotice && <Rocket className="h-4 w-4" />}
              Create Account & Send OTP
            </>
          )}
        </button>

        <div className="text-center">
          <span className="text-gray-600">Already have an account? </span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Sign in here
          </button>
        </div>
      </form>
    </div>
  )
}
