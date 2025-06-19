"use client"

import type React from "react"
import { useState } from "react"
import { AutomobileDashboard } from "./AutomobileDashboard"
import { AutomobileInventory } from "./AutomobileInventory"
import { AutomobileSettings } from "./AutomobileSettings"
import { AutomobileInvoiceList } from "./AutomobileInvoiceList"
import { CreateAutomobileInvoice } from "./CreateAutomobileInvoice"

export const AutomobileMain: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState("dashboard")
  const [editingInvoice, setEditingInvoice] = useState(null)

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen)
    if (screen !== "create-invoice") {
      setEditingInvoice(null)
    }
  }

  const handleEditInvoice = (invoice: any) => {
    setEditingInvoice(invoice)
    setCurrentScreen("create-invoice")
  }

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "dashboard":
        return <AutomobileDashboard onNavigate={handleNavigate} />
      case "inventory":
        return <AutomobileInventory />
      case "settings":
        return <AutomobileSettings />
      case "invoice-list":
        return (
          <AutomobileInvoiceList
            onCreateInvoice={() => handleNavigate("create-invoice")}
            onEditInvoice={handleEditInvoice}
          />
        )
      case "create-invoice":
        return <CreateAutomobileInvoice onBack={() => handleNavigate("invoice-list")} editingInvoice={editingInvoice} />
      default:
        return <AutomobileDashboard onNavigate={handleNavigate} />
    }
  }

  return <div className="min-h-screen bg-gray-50">{renderCurrentScreen()}</div>
}
