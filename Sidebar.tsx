"use client"

import type React from "react"
import { useState } from "react"
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  Car,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
  CreditCard,
  BarChart3,
  Wrench,
} from "lucide-react"
import { useEnhancedAuth } from "../../contexts/EnhancedAuthContext"

export const Sidebar: React.FC = () => {
  const { user, organization, logout } = useEnhancedAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const getMenuItems = () => {
    if (!organization) return []

    const baseItems = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "#dashboard",
        active: true,
      },
    ]

    // Business type specific menu items
    switch (organization.business_type) {
      case "automobile":
        return [
          ...baseItems,
          {
            icon: Package,
            label: "Inventory",
            href: "#inventory",
          },
          {
            icon: FileText,
            label: "Invoices",
            href: "#invoices",
          },
          {
            icon: Car,
            label: "Vehicles",
            href: "#vehicles",
          },
          {
            icon: Users,
            label: "Customers",
            href: "#customers",
          },
          {
            icon: Wrench,
            label: "Service Records",
            href: "#service",
          },
          {
            icon: BarChart3,
            label: "Reports",
            href: "#reports",
          },
          {
            icon: Settings,
            label: "Settings",
            href: "#settings",
          },
        ]

      case "medical":
        return [
          ...baseItems,
          {
            icon: Users,
            label: "Patients",
            href: "#patients",
          },
          {
            icon: FileText,
            label: "Prescriptions",
            href: "#prescriptions",
          },
          {
            icon: Package,
            label: "Medicine Inventory",
            href: "#inventory",
          },
          {
            icon: CreditCard,
            label: "Billing",
            href: "#billing",
          },
          {
            icon: Settings,
            label: "Settings",
            href: "#settings",
          },
        ]

      case "school":
        return [
          ...baseItems,
          {
            icon: Users,
            label: "Students",
            href: "#students",
          },
          {
            icon: FileText,
            label: "Fee Management",
            href: "#fees",
          },
          {
            icon: Building2,
            label: "Classes",
            href: "#classes",
          },
          {
            icon: BarChart3,
            label: "Reports",
            href: "#reports",
          },
          {
            icon: Settings,
            label: "Settings",
            href: "#settings",
          },
        ]

      default:
        return [
          ...baseItems,
          {
            icon: Package,
            label: "Inventory",
            href: "#inventory",
          },
          {
            icon: FileText,
            label: "Invoices",
            href: "#invoices",
          },
          {
            icon: Users,
            label: "Customers",
            href: "#customers",
          },
          {
            icon: Settings,
            label: "Settings",
            href: "#settings",
          },
        ]
    }
  }

  const menuItems = getMenuItems()

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{organization?.name}</h2>
                <p className="text-sm text-gray-500 capitalize">{organization?.business_type}</p>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronLeft className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              return (
                <li key={index}>
                  <a
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      item.active
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"}`}>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={logout}
              className="w-full mt-3 flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
