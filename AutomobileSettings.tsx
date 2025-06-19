"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Building2, FileText, Upload, Save, Camera, CreditCard, Shield, Bell } from "lucide-react"
import { useEnhancedAuth } from "../../contexts/EnhancedAuthContext"

interface AgencySettings {
  // Business Information
  agencyName: string
  ownerName: string
  gstin: string
  panNumber: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  email: string
  website: string

  // Bank Details
  bankName: string
  accountNumber: string
  ifscCode: string
  accountHolderName: string

  // Invoice Settings
  invoicePrefix: string
  invoiceStartNumber: number
  termsAndConditions: string
  footerText: string

  // Notification Settings
  emailNotifications: boolean
  smsNotifications: boolean
  lowStockAlerts: boolean
  paymentReminders: boolean

  // Files
  logoUrl?: string
  signatureUrl?: string
}

export const AutomobileSettings: React.FC = () => {
  const { user, organization } = useEnhancedAuth()
  const [activeTab, setActiveTab] = useState("business")
  const [loading, setLoading] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const signatureInputRef = useRef<HTMLInputElement>(null)

  const [settings, setSettings] = useState<AgencySettings>({
    agencyName: organization?.name || "Kumar Auto Agency",
    ownerName: user?.name || "Rajesh Kumar",
    gstin: "07AAACH7409R1ZZ",
    panNumber: "AAACH7409R",
    address: "Shop No. 15, Auto Market, Sector 18",
    city: "Noida",
    state: "Uttar Pradesh",
    pincode: "201301",
    phone: "+91-9876543210",
    email: user?.email || "kumar.auto@gmail.com",
    website: "www.kumarauto.com",
    bankName: "State Bank of India",
    accountNumber: "12345678901234",
    ifscCode: "SBIN0001234",
    accountHolderName: "Kumar Auto Agency",
    invoicePrefix: "KAA",
    invoiceStartNumber: 1001,
    termsAndConditions: `1. Payment is due within 30 days of invoice date.
2. Late payments may incur additional charges of 2% per month.
3. All disputes must be reported within 7 days of delivery.
4. Goods once sold will not be taken back.
5. Warranty terms apply as per manufacturer guidelines.
6. All legal disputes subject to Delhi jurisdiction.`,
    footerText: "Thank you for choosing Kumar Auto Agency - Your trusted automobile partner!",
    emailNotifications: true,
    smsNotifications: false,
    lowStockAlerts: true,
    paymentReminders: true,
  })

  const tabs = [
    { id: "business", label: "Business Info", icon: Building2 },
    { id: "invoice", label: "Invoice Settings", icon: FileText },
    { id: "bank", label: "Bank Details", icon: CreditCard },
    { id: "branding", label: "Logo & Signature", icon: Camera },
    { id: "notifications", label: "Notifications", icon: Bell },
  ]

  const handleSave = async (section: string) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert(`${section} settings saved successfully!`)
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Error saving settings. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (type: "logo" | "signature", file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (type === "logo") {
        setSettings((prev) => ({ ...prev, logoUrl: result }))
      } else {
        setSettings((prev) => ({ ...prev, signatureUrl: result }))
      }
    }
    reader.readAsDataURL(file)
  }

  const TabButton = ({ tab }: { tab: (typeof tabs)[0] }) => {
    const Icon = tab.icon
    return (
      <button
        onClick={() => setActiveTab(tab.id)}
        className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-left transition-colors ${
          activeTab === tab.id ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        <Icon className="h-5 w-5" />
        <span className="font-medium">{tab.label}</span>
      </button>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Agency Settings</h1>
        <p className="text-gray-600">Manage your automobile agency profile and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <TabButton key={tab.id} tab={tab} />
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            {/* Business Information */}
            {activeTab === "business" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Business Information</h2>
                  <button
                    onClick={() => handleSave("business")}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Agency Name *</label>
                    <input
                      type="text"
                      value={settings.agencyName}
                      onChange={(e) => setSettings((prev) => ({ ...prev, agencyName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name *</label>
                    <input
                      type="text"
                      value={settings.ownerName}
                      onChange={(e) => setSettings((prev) => ({ ...prev, ownerName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GSTIN *</label>
                    <input
                      type="text"
                      value={settings.gstin}
                      onChange={(e) => setSettings((prev) => ({ ...prev, gstin: e.target.value.toUpperCase() }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="07AAACH7409R1ZZ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number *</label>
                    <input
                      type="text"
                      value={settings.panNumber}
                      onChange={(e) => setSettings((prev) => ({ ...prev, panNumber: e.target.value.toUpperCase() }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="AAACH7409R"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={settings.phone}
                      onChange={(e) => setSettings((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      value={settings.website}
                      onChange={(e) => setSettings((prev) => ({ ...prev, website: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="www.yourwebsite.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <textarea
                    value={settings.address}
                    onChange={(e) => setSettings((prev) => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      value={settings.city}
                      onChange={(e) => setSettings((prev) => ({ ...prev, city: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <input
                      type="text"
                      value={settings.state}
                      onChange={(e) => setSettings((prev) => ({ ...prev, state: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code *</label>
                    <input
                      type="text"
                      value={settings.pincode}
                      onChange={(e) => setSettings((prev) => ({ ...prev, pincode: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Invoice Settings */}
            {activeTab === "invoice" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Invoice Settings</h2>
                  <button
                    onClick={() => handleSave("invoice")}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Prefix</label>
                    <input
                      type="text"
                      value={settings.invoicePrefix}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, invoicePrefix: e.target.value.toUpperCase() }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="KAA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Starting Invoice Number</label>
                    <input
                      type="number"
                      value={settings.invoiceStartNumber}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, invoiceStartNumber: Number.parseInt(e.target.value) }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Terms and Conditions</label>
                  <textarea
                    value={settings.termsAndConditions}
                    onChange={(e) => setSettings((prev) => ({ ...prev, termsAndConditions: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={8}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Footer Text</label>
                  <input
                    type="text"
                    value={settings.footerText}
                    onChange={(e) => setSettings((prev) => ({ ...prev, footerText: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Bank Details */}
            {activeTab === "bank" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Bank Details</h2>
                  <button
                    onClick={() => handleSave("bank")}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                    <input
                      type="text"
                      value={settings.bankName}
                      onChange={(e) => setSettings((prev) => ({ ...prev, bankName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                    <input
                      type="text"
                      value={settings.accountHolderName}
                      onChange={(e) => setSettings((prev) => ({ ...prev, accountHolderName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                    <input
                      type="text"
                      value={settings.accountNumber}
                      onChange={(e) => setSettings((prev) => ({ ...prev, accountNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
                    <input
                      type="text"
                      value={settings.ifscCode}
                      onChange={(e) => setSettings((prev) => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <Shield className="h-4 w-4 inline mr-2" />
                    Bank details will be displayed on invoices for customer payments. Ensure all information is
                    accurate.
                  </p>
                </div>
              </div>
            )}

            {/* Logo & Signature */}
            {activeTab === "branding" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Logo & Digital Signature</h2>
                  <button
                    onClick={() => handleSave("branding")}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Agency Logo</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {settings.logoUrl ? (
                        <div className="space-y-4">
                          <img
                            src={settings.logoUrl || "/placeholder.svg"}
                            alt="Agency Logo"
                            className="mx-auto h-24 w-auto object-contain"
                          />
                          <button
                            onClick={() => logoInputRef.current?.click()}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Change Logo
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                          <div>
                            <p className="text-gray-600 mb-2">Upload your agency logo</p>
                            <p className="text-sm text-gray-500">PNG, JPG up to 2MB</p>
                          </div>
                          <button
                            onClick={() => logoInputRef.current?.click()}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Choose File
                          </button>
                        </div>
                      )}
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload("logo", file)
                        }}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Signature Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Digital Signature</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {settings.signatureUrl ? (
                        <div className="space-y-4">
                          <img
                            src={settings.signatureUrl || "/placeholder.svg"}
                            alt="Digital Signature"
                            className="mx-auto h-16 w-auto object-contain bg-white border rounded"
                          />
                          <button
                            onClick={() => signatureInputRef.current?.click()}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Change Signature
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                          <div>
                            <p className="text-gray-600 mb-2">Upload your digital signature</p>
                            <p className="text-sm text-gray-500">PNG, JPG up to 1MB</p>
                          </div>
                          <button
                            onClick={() => signatureInputRef.current?.click()}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Choose File
                          </button>
                        </div>
                      )}
                      <input
                        ref={signatureInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload("signature", file)
                        }}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <Camera className="h-4 w-4 inline mr-2" />
                    Logo and signature will appear on all invoices and official documents. Use high-quality images for
                    best results.
                  </p>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                  <button
                    onClick={() => handleSave("notifications")}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings((prev) => ({ ...prev, emailNotifications: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                      <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.smsNotifications}
                      onChange={(e) => setSettings((prev) => ({ ...prev, smsNotifications: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Low Stock Alerts</h3>
                      <p className="text-sm text-gray-600">Get notified when inventory is running low</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.lowStockAlerts}
                      onChange={(e) => setSettings((prev) => ({ ...prev, lowStockAlerts: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Payment Reminders</h3>
                      <p className="text-sm text-gray-600">Send reminders for pending payments</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.paymentReminders}
                      onChange={(e) => setSettings((prev) => ({ ...prev, paymentReminders: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
