"use client"

import type React from "react"
import { useState } from "react"
import { User, Mail, Phone, Building2, FileText, ChevronDown, AlertCircle, Lock, Eye, EyeOff } from "lucide-react"
import { useEnhancedAuth } from "../../contexts/EnhancedAuthContext"
import type { BusinessType, SubscriptionPlan } from "../../types"

interface EnhancedRegisterFormProps {
  onBack?: () => void
  onLogin: () => void
  onOTPRequired?: (phone: string, verificationId: string) => void
}

const businessTypes: { value: BusinessType; label: string; description: string; icon: string }[] = [
  {
    value: "automobile",
    label: "Automobile Agency",
    description: "Car dealers, service centers, spare parts",
    icon: "🚗",
  },
  { value: "medical", label: "Medical Facility", description: "Hospitals, clinics, pharmacies", icon: "🏥" },
  { value: "retail", label: "Retail Store", description: "Clothing, electronics, general stores", icon: "🏪" },
  { value: "school", label: "Educational Institution", description: "Schools, colleges, coaching centers", icon: "🎓" },
  { value: "pharmacy", label: "Pharmacy", description: "Medical stores, drug stores", icon: "💊" },
  { value: "textile", label: "Textile Business", description: "Fabric stores, garment manufacturing", icon: "🧵" },
]

const subscriptionPlans: { value: SubscriptionPlan; label: string; price: string; features: string[] }[] = [
  {
    value: "basic",
    label: "Basic",
    price: "₹999/month",
    features: ["Up to 100 invoices/month", "Basic inventory", "GST compliance", "Email support"],
  },
  {
    value: "professional",
    label: "Professional",
    price: "₹1,999/month",
    features: ["Unlimited invoices", "Advanced inventory", "Analytics", "Priority support", "API access"],
  },
  {
    value: "enterprise",
    label: "Enterprise",
    price: "₹4,999/month",
    features: ["Everything in Professional", "Multi-location", "Custom integrations", "Dedicated support"],
  },
]

export const EnhancedRegisterForm: React.FC<EnhancedRegisterFormProps> = ({ onBack, onLogin, onOTPRequired }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    organization_name: "",
    business_type: "automobile" as BusinessType,
    subscription_plan: "professional" as SubscriptionPlan,
    gst_number: "",
  })
  const [error, setError] = useState("")
  const [showBusinessTypes, setShowBusinessTypes] = useState(false)
  const [showPlans, setShowPlans] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register, isLoading } = useEnhancedAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (currentStep < 3) {
      // Validate current step
      if (currentStep === 1) {
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone) {
          setError("Please fill in all required fields")
          return
        }

        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match")
          return
        }

        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters long")
          return
        }

        // Validate phone number
        const phoneRegex = /^[6-9]\d{9}$/
        const cleanPhone = formData.phone.replace(/\D/g, "")
        if (!phoneRegex.test(cleanPhone)) {
          setError("Please enter a valid 10-digit Indian mobile number")
          return
        }
      }

      if (currentStep === 2) {
        if (!formData.organization_name) {
          setError("Please enter your business name")
          return
        }
      }

      setCurrentStep(currentStep + 1)
      return
    }

    // Final submission
    try {
      console.log("📝 Submitting registration for:", formData.email)
      await register({
        ...formData,
        phone: formData.phone.replace(/\D/g, ""),
      })
      console.log("✅ Registration successful - redirecting to dashboard")
      // Don't need to do anything here, the auth context will handle the redirect
    } catch (err: any) {
      console.error("❌ Registration failed:", err.message)
      setError(err.message || "Registration failed. Please try again.")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const selectedBusinessType = businessTypes.find((bt) => bt.value === formData.business_type)
  const selectedPlan = subscriptionPlans.find((plan) => plan.value === formData.subscription_plan)

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">Create your account</p>
      </div>

      <div className="space-y-4">
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
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
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
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Only one account can be created per phone number</p>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Information</h2>
        <p className="text-gray-600">Tell us about your business</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="organization_name" className="block text-sm font-medium text-gray-700 mb-2">
            Business Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="organization_name"
              type="text"
              value={formData.organization_name}
              onChange={(e) => handleInputChange("organization_name", e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-3 text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{selectedBusinessType?.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">{selectedBusinessType?.label}</div>
                    <div className="text-sm text-gray-500">{selectedBusinessType?.description}</div>
                  </div>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform ${showBusinessTypes ? "rotate-180" : ""}`}
                />
              </div>
            </button>

            {showBusinessTypes && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {businessTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => {
                      handleInputChange("business_type", type.value)
                      setShowBusinessTypes(false)
                    }}
                    className="w-full text-left px-3 py-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{type.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900">{type.label}</div>
                        <div className="text-sm text-gray-500">{type.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="gst_number" className="block text-sm font-medium text-gray-700 mb-2">
            GST Number (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="gst_number"
              type="text"
              value={formData.gst_number}
              onChange={(e) => handleInputChange("gst_number", e.target.value.toUpperCase())}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="27AAAPZ2271G1ZW"
              maxLength={15}
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
        <p className="text-gray-600">Start with a 7-day free trial</p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="text-green-600 text-2xl">🎉</div>
          <div>
            <h3 className="font-semibold text-green-800">7-Day Free Trial</h3>
            <p className="text-green-700 text-sm">Try all features free for 7 days. No payment required to start!</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.value}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
              formData.subscription_plan === plan.value
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleInputChange("subscription_plan", plan.value)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    formData.subscription_plan === plan.value ? "border-blue-500 bg-blue-500" : "border-gray-300"
                  }`}
                >
                  {formData.subscription_plan === plan.value && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{plan.label}</h3>
                  <p className="text-blue-600 font-medium">{plan.price}</p>
                </div>
              </div>
              {plan.value === "professional" && (
                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">Recommended</span>
              )}
            </div>
            <ul className="space-y-1">
              {plan.features.map((feature, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-sm text-blue-800">
          <p className="font-medium">What happens after the trial?</p>
          <p className="mt-1">
            After 7 days, you can choose to subscribe to continue using all features. Your data will be safely stored
            during the trial period.
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600 p-3 rounded-xl">
            <Building2 className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started with BizFlow Pro</h1>
        <p className="text-gray-600">Create your account in 3 simple steps</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {step}
            </div>
            {step < 3 && <div className={`w-16 h-1 mx-2 ${step < currentStep ? "bg-blue-600" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        <div className="flex items-center justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
          )}

          <div className="flex-1" />

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {currentStep === 3 ? "Creating Account..." : "Processing..."}
              </>
            ) : (
              <>{currentStep === 3 ? "Create Account & Start Trial" : "Continue"}</>
            )}
          </button>
        </div>

        {currentStep === 1 && (
          <div className="text-center">
            <span className="text-gray-600">Already have an account? </span>
            <button type="button" onClick={onLogin} className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in here
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
