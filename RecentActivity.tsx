"use client"

import type React from "react"
import { Clock, DollarSign, Package, User, AlertTriangle } from "lucide-react"

interface Activity {
  id: string
  type: "sale" | "inventory" | "customer" | "alert"
  title: string
  description: string
  amount?: number
  time: string
}

export const RecentActivity: React.FC = () => {
  const activities: Activity[] = [
    {
      id: "1",
      type: "sale",
      title: "New Invoice Generated",
      description: "Invoice #INV-2024-001 for Rajesh Kumar",
      amount: 15000,
      time: "2 minutes ago",
    },
    {
      id: "2",
      type: "inventory",
      title: "Stock Updated",
      description: "Added 50 units of Premium Shirt",
      time: "15 minutes ago",
    },
    {
      id: "3",
      type: "customer",
      title: "New Customer Added",
      description: "Priya Sharma registered as new customer",
      time: "1 hour ago",
    },
    {
      id: "4",
      type: "alert",
      title: "Low Stock Alert",
      description: "Cotton T-Shirt running low (5 units left)",
      time: "2 hours ago",
    },
    {
      id: "5",
      type: "sale",
      title: "Payment Received",
      description: "Payment for Invoice #INV-2024-002",
      amount: 8500,
      time: "3 hours ago",
    },
  ]

  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "sale":
        return <DollarSign className="h-5 w-5 text-emerald-600" />
      case "inventory":
        return <Package className="h-5 w-5 text-blue-600" />
      case "customer":
        return <User className="h-5 w-5 text-purple-600" />
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-amber-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getBgColor = (type: Activity["type"]) => {
    switch (type) {
      case "sale":
        return "bg-emerald-100"
      case "inventory":
        return "bg-blue-100"
      case "customer":
        return "bg-purple-100"
      case "alert":
        return "bg-amber-100"
      default:
        return "bg-gray-100"
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg flex-shrink-0 ${getBgColor(activity.type)}`}>{getIcon(activity.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                {activity.amount && (
                  <span className="text-sm font-semibold text-emerald-600">+₹{activity.amount.toLocaleString()}</span>
                )}
              </div>
              <p className="text-sm text-gray-600">{activity.description}</p>
              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">View All Activity</button>
    </div>
  )
}
