"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Filter, Plus, Eye, Download, Send, Edit2, Trash2, FileText } from "lucide-react"
import { supabaseService } from "../../services/supabaseService"
import { useAuth } from "../../contexts/AuthContext"
import type { Invoice } from "../../types"

interface InvoiceListProps {
  onCreateInvoice: () => void
}

export const InvoiceList: React.FC<InvoiceListProps> = ({ onCreateInvoice }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const { user, isDemoMode } = useAuth()

  useEffect(() => {
    if (user && !isDemoMode) {
      loadInvoices()
    } else if (isDemoMode) {
      loadDemoInvoices()
    }
  }, [user, isDemoMode])

  const loadInvoices = async () => {
    try {
      setLoading(true)
      const data = await supabaseService.getInvoices(user!.id)
      setInvoices(data)
    } catch (error) {
      console.error("Error loading invoices:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadDemoInvoices = () => {
    // Demo data for preview
    const demoInvoices: Invoice[] = [
      {
        id: "INV-2024-001",
        user_id: "demo",
        customer_id: "cust-1",
        invoice_number: "INV-2024-001",
        subtotal: 125000,
        gst_amount: 22500,
        total: 147500,
        status: "paid",
        due_date: "2024-02-15",
        created_at: "2024-01-15",
        customer: {
          id: "cust-1",
          user_id: "demo",
          name: "Rajesh Kumar",
          phone: "+91-9876543210",
          email: "rajesh@example.com",
          address: "123 Main Street, Delhi",
        },
        invoice_items: [
          {
            id: "item-1",
            invoice_id: "INV-2024-001",
            name: "Maruti Swift VXI",
            quantity: 1,
            price: 125000,
            gst_rate: 18,
            amount: 125000,
          },
        ],
      },
      {
        id: "INV-2024-002",
        user_id: "demo",
        customer_id: "cust-2",
        invoice_number: "INV-2024-002",
        subtotal: 85000,
        gst_amount: 15300,
        total: 100300,
        status: "draft",
        due_date: "2024-02-20",
        created_at: "2024-01-18",
        customer: {
          id: "cust-2",
          user_id: "demo",
          name: "Priya Sharma",
          phone: "+91-9876543211",
          email: "priya@example.com",
          address: "456 Park Avenue, Mumbai",
        },
        invoice_items: [
          {
            id: "item-2",
            invoice_id: "INV-2024-002",
            name: "Honda City Engine Oil",
            quantity: 5,
            price: 17000,
            gst_rate: 18,
            amount: 85000,
          },
        ],
      },
    ]
    setInvoices(demoInvoices)
    setLoading(false)
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer?.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || invoice.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "bg-emerald-100 text-emerald-800"
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

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return

    try {
      if (!isDemoMode) {
        await supabaseService.deleteInvoice(invoiceId)
        await loadInvoices()
      } else {
        // Demo mode: just remove from local state
        setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId))
      }
    } catch (error) {
      console.error("Error deleting invoice:", error)
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600">Manage your billing and invoices</p>
        </div>
        <button
          onClick={onCreateInvoice}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-green-600">
                {invoices.filter((inv) => inv.status === "paid").length}
              </p>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="h-4 w-4 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-gray-600">
                {invoices.filter((inv) => inv.status === "draft").length}
              </p>
            </div>
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
              <div className="h-4 w-4 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{invoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}
              </p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="h-4 w-4 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>

          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-5 w-5 text-gray-400" />
            <span>More Filters</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Invoice #</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Due Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-blue-600">{invoice.invoice_number}</td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{invoice.customer?.name}</div>
                      <div className="text-sm text-gray-500">{invoice.customer?.phone}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900">₹{invoice.total.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                        invoice.status,
                      )}`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {new Date(invoice.created_at || "").toLocaleDateString("en-IN")}
                  </td>
                  <td className="py-4 px-4 text-gray-600">{new Date(invoice.due_date).toLocaleDateString("en-IN")}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      {invoice.status === "draft" && (
                        <button
                          onClick={onCreateInvoice}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                      <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors" title="Download">
                        <Download className="h-4 w-4" />
                      </button>
                      {invoice.status !== "paid" && (
                        <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors" title="Send">
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No invoices found matching your criteria.</p>
            <button onClick={onCreateInvoice} className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
              Create your first invoice
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
