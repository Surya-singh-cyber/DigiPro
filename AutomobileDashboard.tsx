"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Car,
  TrendingUp,
  FileText,
  Package,
  Users,
  IndianRupee,
  Plus,
  Eye,
  Download,
  Calendar,
  BarChart3,
} from "lucide-react"
import { useEnhancedAuth } from "../../contexts/EnhancedAuthContext"
import { enhancedSupabaseService } from "../../services/enhancedSupabaseService"
import type { DashboardStats, Invoice } from "../../types"

interface AutomobileDashboardProps {
  onNavigate: (screen: string) => void
}

export const AutomobileDashboard: React.FC<AutomobileDashboardProps> = ({ onNavigate }) => {
  const { user, organization, trialDaysRemaining, subscriptionStatus } = useEnhancedAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [revenueData, setRevenueData] = useState([
    { month: "Jan", revenue: 45000, profit: 12000 },
    { month: "Feb", revenue: 52000, profit: 15000 },
    { month: "Mar", revenue: 48000, profit: 13500 },
    { month: "Apr", revenue: 61000, profit: 18000 },
    { month: "May", revenue: 55000, profit: 16500 },
    { month: "Jun", revenue: 67000, profit: 20000 },
  ])

  useEffect(() => {
    if (user && organization) {
      loadDashboardData()
    }
  }, [user, organization])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      console.log("🔄 Loading dashboard data...")

      // Load dashboard stats
      const dashboardStats = await enhancedSupabaseService.getDashboardStats(organization!.id)
      setStats(dashboardStats)
      console.log("✅ Dashboard stats loaded:", dashboardStats)

      // Load recent invoices
      const invoicesResponse = await enhancedSupabaseService.getInvoices(organization!.id, 1, 5)
      setRecentInvoices(invoicesResponse.data)
      console.log("✅ Recent invoices loaded:", invoicesResponse.data.length)
    } catch (error) {
      console.error("❌ Error loading dashboard data:", error)
      console.log("🎭 Falling back to demo data...")

      // Fallback to demo data
      setStats({
        total_revenue: 450000,
        total_profit: 112500,
        total_expenses: 337500,
        monthly_revenue: 67000,
        monthly_profit: 20000,
        inventory_value: 850000,
        low_stock_items: 3,
        out_of_stock_items: 1,
        total_customers: 45,
        new_customers_this_month: 8,
        pending_invoices: 12,
        overdue_invoices: 3,
        paid_invoices: 28,
        total_students: 0,
        pending_fees: 0,
        collected_fees_this_month: 0,
        total_employees: 0,
        salary_paid_this_month: 0,
        pending_salaries: 0,
        total_vehicles: 156,
        services_due: 8,
        insurance_expiring: 5,
      })

      setRecentInvoices([
        {
          id: "1",
          organization_id: organization!.id,
          customer_id: "cust1",
          invoice_number: "INV-2024-001",
          invoice_type: "sale",
          invoice_date: "2024-01-15",
          due_date: "2024-02-15",
          subtotal: 125000,
          discount_amount: 5000,
          discount_percentage: 4,
          tax_amount: 21600,
          shipping_charges: 0,
          other_charges: 2500,
          round_off: 0,
          total_amount: 144100,
          paid_amount: 144100,
          balance_amount: 0,
          status: "paid",
          payment_terms: "30 days",
          payment_method: "Bank Transfer",
          payment_status: "paid",
          created_at: "2024-01-15",
          customer: {
            id: "cust1",
            organization_id: organization!.id,
            name: "Rajesh Kumar",
            phone: "+91-9876543210",
            email: "rajesh@example.com",
            address: "123 Main Street, Delhi",
            customer_type: "individual",
            credit_limit: 0,
            outstanding_balance: 0,
            is_active: true,
          },
        },
        {
          id: "2",
          organization_id: organization!.id,
          customer_id: "cust2",
          invoice_number: "INV-2024-002",
          invoice_type: "sale",
          invoice_date: "2024-01-18",
          due_date: "2024-02-18",
          subtotal: 85000,
          discount_amount: 0,
          discount_percentage: 0,
          tax_amount: 15300,
          shipping_charges: 0,
          other_charges: 1500,
          round_off: 0,
          total_amount: 101800,
          paid_amount: 0,
          balance_amount: 101800,
          status: "sent",
          payment_terms: "30 days",
          payment_status: "pending",
          created_at: "2024-01-18",
          customer: {
            id: "cust2",
            organization_id: organization!.id,
            name: "Priya Sharma",
            phone: "+91-9876543211",
            email: "priya@example.com",
            address: "456 Park Avenue, Mumbai",
            customer_type: "individual",
            credit_limit: 0,
            outstanding_balance: 101800,
            is_active: true,
          },
        },
      ])

      console.log("✅ Demo data loaded successfully")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "sent":
        return "bg-blue-100 text-blue-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automobile Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {subscriptionStatus === "trial" && trialDaysRemaining !== null && (
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                Trial: {trialDaysRemaining} days left
              </span>
            )}
          </p>
          <p className="text-sm font-medium text-gray-900">
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate("create-invoice")}
          className="bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700 transition-colors text-left"
        >
          <div className="flex items-center space-x-3">
            <Plus className="h-8 w-8" />
            <div>
              <h3 className="font-semibold">Create Invoice</h3>
              <p className="text-blue-100 text-sm">Generate new invoice</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate("inventory")}
          className="bg-green-600 text-white p-6 rounded-xl hover:bg-green-700 transition-colors text-left"
        >
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8" />
            <div>
              <h3 className="font-semibold">Manage Inventory</h3>
              <p className="text-green-100 text-sm">Add/Edit products</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate("invoice-list")}
          className="bg-purple-600 text-white p-6 rounded-xl hover:bg-purple-700 transition-colors text-left"
        >
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8" />
            <div>
              <h3 className="font-semibold">View Invoices</h3>
              <p className="text-purple-100 text-sm">Manage all invoices</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate("settings")}
          className="bg-orange-600 text-white p-6 rounded-xl hover:bg-orange-700 transition-colors text-left"
        >
          <div className="flex items-center space-x-3">
            <Car className="h-8 w-8" />
            <div>
              <h3 className="font-semibold">Agency Settings</h3>
              <p className="text-orange-100 text-sm">Update profile</p>
            </div>
          </div>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.total_revenue || 0)}</p>
              <p className="text-sm text-green-600 mt-1">+12% from last month</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <IndianRupee className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.monthly_revenue || 0)}</p>
              <p className="text-sm text-green-600 mt-1">+8% from last month</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_vehicles || 0}</p>
              <p className="text-sm text-blue-600 mt-1">{stats?.services_due || 0} services due</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Car className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_customers || 0}</p>
              <p className="text-sm text-green-600 mt-1">+{stats?.new_customers_this_month || 0} this month</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {revenueData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{item.month}</span>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(item.revenue / 70000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-16 text-right">
                    {formatCurrency(item.revenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
            <button
              onClick={() => onNavigate("invoice-list")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900">{invoice.invoice_number}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{invoice.customer?.name}</p>
                  <p className="text-xs text-gray-500">{new Date(invoice.invoice_date).toLocaleDateString("en-IN")}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(invoice.total_amount)}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <button className="p-1 text-gray-400 hover:text-blue-600">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-green-600">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invoice Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Invoices</p>
              <p className="text-2xl font-bold text-orange-600">{stats?.pending_invoices || 0}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid Invoices</p>
              <p className="text-2xl font-bold text-green-600">{stats?.paid_invoices || 0}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue Invoices</p>
              <p className="text-2xl font-bold text-red-600">{stats?.overdue_invoices || 0}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
