"use client"

import type React from "react"
import { useState } from "react"
import { User, Building2, FileText, Bell, Shield, CreditCard, Save, Upload, Eye, EyeOff } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

export const Settings: React.FC = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [showApiKey, setShowApiKey] = useState(false)

  // Form states
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    businessName: user?.businessName || "",
    gstNumber: user?.gstNumber || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    website: "",
  })

  const [invoiceSettings, setInvoiceSettings] = useState({
    invoicePrefix: "INV",
    invoiceStartNumber: 1,
    termsAndConditions:
      "1. Payment is due within 30 days of invoice date.\n2. Late payments may incur additional charges.\n3. All disputes must be reported within 7 days.",
    footerText: "Thank you for your business!",
    showBankDetails: true,
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    lowStockAlerts: true,
    paymentReminders: true,
    invoiceDueAlerts: true,
  })

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "business", label: "Business", icon: Building2 },
    { id: "invoice", label: "Invoice Settings", icon: FileText },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
  ]

  const handleSave = async (section: string) => {
    // In a real app, this would save to the database
    console.log(`Saving ${section} settings...`)
    alert(`${section} settings saved successfully!`)
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
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and application preferences</p>
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
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  <button
                    onClick={() => handleSave("profile")}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, website: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={profileData.address}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Enter your complete address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, city: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      value={profileData.state}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, state: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
                    <input
                      type="text"
                      value={profileData.pincode}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, pincode: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "business" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Business Information</h2>
                  <button
                    onClick={() => handleSave("business")}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                    <input
                      type="text"
                      value={profileData.businessName}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, businessName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
                    <input
                      type="text"
                      value={profileData.gstNumber}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, gstNumber: e.target.value.toUpperCase() }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="27AAAPZ2271G1ZW"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Logo</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Upload your business logo</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 2MB</p>
                    <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Choose File
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Digital Signature</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Upload your digital signature</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 1MB</p>
                    <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Choose File
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "invoice" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Invoice Settings</h2>
                  <button
                    onClick={() => handleSave("invoice")}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Prefix</label>
                    <input
                      type="text"
                      value={invoiceSettings.invoicePrefix}
                      onChange={(e) => setInvoiceSettings((prev) => ({ ...prev, invoicePrefix: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="INV"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Starting Number</label>
                    <input
                      type="number"
                      value={invoiceSettings.invoiceStartNumber}
                      onChange={(e) =>
                        setInvoiceSettings((prev) => ({ ...prev, invoiceStartNumber: Number.parseInt(e.target.value) }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Terms and Conditions</label>
                  <textarea
                    value={invoiceSettings.termsAndConditions}
                    onChange={(e) => setInvoiceSettings((prev) => ({ ...prev, termsAndConditions: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Footer Text</label>
                  <input
                    type="text"
                    value={invoiceSettings.footerText}
                    onChange={(e) => setInvoiceSettings((prev) => ({ ...prev, footerText: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <input
                      type="checkbox"
                      id="showBankDetails"
                      checked={invoiceSettings.showBankDetails}
                      onChange={(e) => setInvoiceSettings((prev) => ({ ...prev, showBankDetails: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="showBankDetails" className="text-sm font-medium text-gray-700">
                      Show Bank Details on Invoice
                    </label>
                  </div>

                  {invoiceSettings.showBankDetails && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                        <input
                          type="text"
                          value={invoiceSettings.bankName}
                          onChange={(e) => setInvoiceSettings((prev) => ({ ...prev, bankName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                        <input
                          type="text"
                          value={invoiceSettings.accountHolderName}
                          onChange={(e) =>
                            setInvoiceSettings((prev) => ({ ...prev, accountHolderName: e.target.value }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                        <input
                          type="text"
                          value={invoiceSettings.accountNumber}
                          onChange={(e) => setInvoiceSettings((prev) => ({ ...prev, accountNumber: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
                        <input
                          type="text"
                          value={invoiceSettings.ifscCode}
                          onChange={(e) =>
                            setInvoiceSettings((prev) => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                  <button
                    onClick={() => handleSave("notifications")}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
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
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) =>
                        setNotificationSettings((prev) => ({ ...prev, emailNotifications: e.target.checked }))
                      }
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
                      checked={notificationSettings.smsNotifications}
                      onChange={(e) =>
                        setNotificationSettings((prev) => ({ ...prev, smsNotifications: e.target.checked }))
                      }
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
                      checked={notificationSettings.lowStockAlerts}
                      onChange={(e) =>
                        setNotificationSettings((prev) => ({ ...prev, lowStockAlerts: e.target.checked }))
                      }
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
                      checked={notificationSettings.paymentReminders}
                      onChange={(e) =>
                        setNotificationSettings((prev) => ({ ...prev, paymentReminders: e.target.checked }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Invoice Due Alerts</h3>
                      <p className="text-sm text-gray-600">Get alerts for upcoming invoice due dates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.invoiceDueAlerts}
                      onChange={(e) =>
                        setNotificationSettings((prev) => ({ ...prev, invoiceDueAlerts: e.target.checked }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>

                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">API Access</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Use this API key to integrate with third-party applications
                    </p>
                    <div className="flex items-center space-x-3">
                      <input
                        type={showApiKey ? "text" : "password"}
                        value="sk_live_abcd1234567890"
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        {showApiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Regenerate
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to your account</p>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Enable 2FA
                    </button>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Login Sessions</h3>
                    <p className="text-sm text-gray-600 mb-4">Manage your active login sessions</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Current Session</p>
                          <p className="text-sm text-gray-600">Chrome on Windows • Mumbai, India</p>
                        </div>
                        <span className="text-green-600 text-sm font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Billing & Subscription</h2>

                <div className="p-6 border border-blue-200 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">Professional Plan</h3>
                      <p className="text-blue-700">₹1,999/month • Next billing: Jan 15, 2024</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Manage Plan
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Payment Methods</h3>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                          <p className="text-sm text-gray-600">Expires 12/25</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Update</button>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    + Add Payment Method
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Billing History</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Dec 15, 2023</p>
                        <p className="text-sm text-gray-600">Professional Plan</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">₹1,999</p>
                        <button className="text-blue-600 hover:text-blue-700 text-sm">Download</button>
                      </div>
                    </div>
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
