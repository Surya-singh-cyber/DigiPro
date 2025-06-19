"use client"

import type React from "react"
import { Bell, Search, User, LogOut, Download, Settings } from "lucide-react"
import { useEnhancedAuth } from "../../contexts/EnhancedAuthContext"
import { DigiProLogo } from "./DigiProLogo"
import { exportService } from "../../services/exportService"
import { enhancedSupabaseService } from "../../services/enhancedSupabaseService"
import { useState } from "react"

export const Header: React.FC = () => {
  const { user, organization, logout } = useEnhancedAuth()
  const [isExporting, setIsExporting] = useState(false)

  const handleExportBackup = async () => {
    if (!organization?.id) return

    setIsExporting(true)
    try {
      // Fetch all data for backup
      const [customersData, inventoryData, invoicesData, stats] = await Promise.all([
        enhancedSupabaseService.getCustomers(organization.id, 1, 1000),
        enhancedSupabaseService.getInventoryItems(organization.id, 1, 1000),
        enhancedSupabaseService.getInvoices(organization.id, 1, 1000),
        enhancedSupabaseService.getDashboardStats(organization.id),
      ])

      await exportService.exportFullBackup({
        customers: customersData.data,
        inventory: inventoryData.data,
        invoices: invoicesData.data,
        stats,
      })
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <DigiProLogo size="md" />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers, invoices, items..."
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleExportBackup}
              disabled={isExporting}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
              title="Export Backup"
            >
              <Download className="h-5 w-5" />
              {isExporting && <span className="text-xs">Exporting...</span>}
            </button>

            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                {organization && <p className="text-xs text-blue-600">{organization.name}</p>}
              </div>
              <div className="relative">
                <button className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                </button>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" title="Settings">
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
