"use client"

import { useState, useEffect } from "react"
import { EnhancedAuthProvider } from "./contexts/EnhancedAuthContext"
import { EnhancedLandingPage } from "./components/Landing/EnhancedLandingPage"
import { useEnhancedAuth } from "./contexts/EnhancedAuthContext"
import { AutomobileMain } from "./components/Automobile/AutomobileMain"
import { Sidebar } from "./components/Layout/Sidebar"
import { Header } from "./components/Layout/Header"

function AppContent() {
  const { user, organization, isAuthenticated, isLoading } = useEnhancedAuth()
  const [showLanding, setShowLanding] = useState(true)

  useEffect(() => {
    console.log("🔄 App state changed:", {
      isAuthenticated,
      hasUser: !!user,
      hasOrganization: !!organization,
      isLoading,
    })

    if (isAuthenticated && user && organization) {
      console.log("✅ User authenticated, showing dashboard")
      setShowLanding(false)
    } else if (!isLoading) {
      console.log("ℹ️ User not authenticated, showing landing page")
      setShowLanding(true)
    }
  }, [isAuthenticated, user, organization, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading DigiPro...</p>
        </div>
      </div>
    )
  }

  if (showLanding) {
    return <EnhancedLandingPage />
  }

  if (isAuthenticated && user && organization) {
    // Show profession-specific dashboard
    if (organization.business_type === "automobile") {
      return (
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-6">
              <AutomobileMain />
            </main>
          </div>
        </div>
      )
    } else {
      // Generic dashboard for other business types
      return (
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-6">
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to DigiPro!</h1>
                <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {organization.business_type.charAt(0).toUpperCase() + organization.business_type.slice(1)} Dashboard
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your {organization.business_type} business management dashboard is ready. Start managing your
                    business with DigiPro's powerful tools.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-800">Invoicing</h3>
                      <p className="text-blue-600 text-sm">Create and manage invoices</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800">Inventory</h3>
                      <p className="text-green-600 text-sm">Track your stock levels</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-800">Analytics</h3>
                      <p className="text-purple-600 text-sm">View business insights</p>
                    </div>
                  </div>
                  <div className="mt-6 text-sm text-gray-500">
                    Trial Days Remaining: <span className="font-semibold text-blue-600">7 days</span>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      )
    }
  }

  return <EnhancedLandingPage />
}

// Main component with proper default export
export default function HomePage() {
  return (
    <EnhancedAuthProvider>
      <AppContent />
    </EnhancedAuthProvider>
  )
}
