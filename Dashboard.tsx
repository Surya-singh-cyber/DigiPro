"use client"

import type React from "react"
import { DashboardStats } from "./DashboardStats"
import { RecentActivity } from "./RecentActivity"
import { QuickActions } from "./QuickActions"
import type { DashboardStats as StatsType } from "../../types"

interface DashboardProps {
  onSectionChange: (section: string) => void
}

export const Dashboard: React.FC<DashboardProps> = ({ onSectionChange }) => {
  // Mock data - would come from API in real app
  const stats: StatsType = {
    totalRevenue: 1250000,
    totalProfit: 325000,
    totalExpenses: 925000,
    inventoryValue: 450000,
    pendingInvoices: 12,
    lowStockItems: 8,
    overduePayments: 5,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your business performance</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <QuickActions onSectionChange={onSectionChange} />
      </div>
    </div>
  )
}
