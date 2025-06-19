"use client"

import type React from "react"
import { FileText, Package, User, GraduationCap, DollarSign } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

interface QuickActionsProps {
  onSectionChange: (section: string) => void
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onSectionChange }) => {
  const { user } = useAuth()

  const getActions = () => {
    const baseActions = [
      {
        id: "new-invoice",
        title: "New Invoice",
        description: "Create billing invoice",
        icon: FileText,
        color: "blue",
        section: "billing",
      },
      {
        id: "add-inventory",
        title: "Add Product",
        description: "Add to inventory",
        icon: Package,
        color: "emerald",
        section: "inventory",
      },
      {
        id: "record-payment",
        title: "Record Payment",
        description: "Log new payment",
        icon: DollarSign,
        color: "purple",
        section: "billing",
      },
    ]

    if (user?.businessType === "school") {
      baseActions.splice(1, 0, {
        id: "add-student",
        title: "Add Student",
        description: "New admission",
        icon: GraduationCap,
        color: "amber",
        section: "students",
      })
    } else {
      baseActions.splice(1, 0, {
        id: "add-customer",
        title: "Add Customer",
        description: "New customer",
        icon: User,
        color: "amber",
        section: "customers",
      })
    }

    return baseActions
  }

  const actions = getActions()

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon

          return (
            <button
              key={action.id}
              onClick={() => onSectionChange(action.section)}
              className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="text-center">
                <div
                  className={`mx-auto w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                    action.color === "blue"
                      ? "bg-blue-100 group-hover:bg-blue-200"
                      : action.color === "emerald"
                        ? "bg-emerald-100 group-hover:bg-emerald-200"
                        : action.color === "purple"
                          ? "bg-purple-100 group-hover:bg-purple-200"
                          : action.color === "amber"
                            ? "bg-amber-100 group-hover:bg-amber-200"
                            : "bg-gray-100 group-hover:bg-gray-200"
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${
                      action.color === "blue"
                        ? "text-blue-600"
                        : action.color === "emerald"
                          ? "text-emerald-600"
                          : action.color === "purple"
                            ? "text-purple-600"
                            : action.color === "amber"
                              ? "text-amber-600"
                              : "text-gray-600"
                    }`}
                  />
                </div>
                <h4 className="text-sm font-medium text-gray-900">{action.title}</h4>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
