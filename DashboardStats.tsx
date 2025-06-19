"use client"

import type React from "react"
import { TrendingUp, TrendingDown, DollarSign, Package, AlertTriangle, Clock } from "lucide-react"
import type { DashboardStats as StatsType } from "../../types"

interface DashboardStatsProps {
  stats: StatsType
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "emerald",
    },
    {
      title: "Total Profit",
      value: `₹${stats.totalProfit.toLocaleString()}`,
      change: "+8.2%",
      trend: "up",
      icon: TrendingUp,
      color: "blue",
    },
    {
      title: "Inventory Value",
      value: `₹${stats.inventoryValue.toLocaleString()}`,
      change: "-2.1%",
      trend: "down",
      icon: Package,
      color: "purple",
    },
    {
      title: "Pending Invoices",
      value: stats.pendingInvoices.toString(),
      change: "+5 this week",
      trend: "neutral",
      icon: Clock,
      color: "amber",
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockItems.toString(),
      change: "Immediate attention",
      trend: "alert",
      icon: AlertTriangle,
      color: "red",
    },
    {
      title: "Overdue Payments",
      value: stats.overduePayments.toString(),
      change: "Follow up required",
      trend: "alert",
      icon: AlertTriangle,
      color: "orange",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((card, index) => {
        const Icon = card.icon

        return (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                <div className="flex items-center mt-2">
                  {card.trend === "up" && <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />}
                  {card.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500 mr-1" />}
                  <span
                    className={`text-sm ${
                      card.trend === "up"
                        ? "text-emerald-600"
                        : card.trend === "down"
                          ? "text-red-600"
                          : card.trend === "alert"
                            ? "text-amber-600"
                            : "text-gray-600"
                    }`}
                  >
                    {card.change}
                  </span>
                </div>
              </div>
              <div
                className={`p-3 rounded-xl ${
                  card.color === "emerald"
                    ? "bg-emerald-100"
                    : card.color === "blue"
                      ? "bg-blue-100"
                      : card.color === "purple"
                        ? "bg-purple-100"
                        : card.color === "amber"
                          ? "bg-amber-100"
                          : card.color === "red"
                            ? "bg-red-100"
                            : card.color === "orange"
                              ? "bg-orange-100"
                              : "bg-gray-100"
                }`}
              >
                <Icon
                  className={`h-6 w-6 ${
                    card.color === "emerald"
                      ? "text-emerald-600"
                      : card.color === "blue"
                        ? "text-blue-600"
                        : card.color === "purple"
                          ? "text-purple-600"
                          : card.color === "amber"
                            ? "text-amber-600"
                            : card.color === "red"
                              ? "text-red-600"
                              : card.color === "orange"
                                ? "text-orange-600"
                                : "text-gray-600"
                  }`}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
