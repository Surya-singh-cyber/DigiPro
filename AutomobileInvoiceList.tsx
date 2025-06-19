"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  Plus,
  Eye,
  Download,
  Send,
  Edit2,
  Trash2,
  FileText,
  IndianRupee,
  Printer,
  Mail,
  Phone,
} from "lucide-react"
import { useEnhancedAuth } from "../../contexts/EnhancedAuthContext"

interface AutomobileInvoice {
  id: string
  invoiceNumber: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  customerAddress: string
  vehicleDetails?: {
    make: string
    model: string
    year: number
    registrationNumber?: string
  }
  items: Array<{
    name: string
    quantity: number
    rate: number
    gstRate: number
    amount: number
  }>
  subtotal: number
  gstAmount: number
  rtoCharges: number
  insuranceCharges: number
  hypothecationCharges: number
  totalAmount: number
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  invoiceDate: string
  dueDate: string
  createdAt: string
}

interface AutomobileInvoiceListProps {
  onCreateInvoice: () => void
  onEditInvoice: (invoice: AutomobileInvoice) => void
}

export const AutomobileInvoiceList: React.FC<AutomobileInvoiceListProps> = ({ onCreateInvoice, onEditInvoice }) => {
  const { user, organization } = useEnhancedAuth()
  const [invoices, setInvoices] = useState<AutomobileInvoice[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<AutomobileInvoice[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInvoices()
  }, [])

  useEffect(() => {
    filterInvoices()
  }, [invoices, searchTerm, statusFilter, dateFilter])

  const loadInvoices = async () => {
    try {
      setLoading(true)
      // Mock data for demonstration
      const mockInvoices: AutomobileInvoice[] = [
        {
          id: "1",
          invoiceNumber: "KAA-1001",
          customerName: "Rajesh Kumar",
          customerPhone: "+91-9876543210",
          customerEmail: "rajesh@example.com",
          customerAddress: "123 Main Street, Delhi - 110001",
          vehicleDetails: {
            make: "Maruti Suzuki",
            model: "Swift VXI",
            year: 2024,
            registrationNumber: "DL-01-AB-1234",
          },
          items: [
            {
              name: "Maruti Swift VXI 2024",
              quantity: 1,
              rate: 650000,
              gstRate: 18,
              amount: 650000,
            },
          ],
          subtotal: 650000,
          gstAmount: 117000,
          rtoCharges: 15000,
          insuranceCharges: 25000,
          hypothecationCharges: 5000,
          totalAmount: 812000,
          status: "paid",
          invoiceDate: "2024-01-15",
          dueDate: "2024-02-15",
          createdAt: "2024-01-15T10:30:00Z",
        },
        {
          id: "2",
          invoiceNumber: "KAA-1002",
          customerName: "Priya Sharma",
          customerPhone: "+91-9876543211",
          customerEmail: "priya@example.com",
          customerAddress: "456 Park Avenue, Mumbai - 400001",
          vehicleDetails: {
            make: "Honda",
            model: "City ZX",
            year: 2024,
          },
          items: [
            {
              name: "Honda City ZX CVT 2024",
              quantity: 1,
              rate: 1350000,
              gstRate: 18,
              amount: 1350000,
            },
          ],
          subtotal: 1350000,
          gstAmount: 243000,
          rtoCharges: 20000,
          insuranceCharges: 35000,
          hypothecationCharges: 8000,
          totalAmount: 1656000,
          status: "sent",
          invoiceDate: "2024-01-18",
          dueDate: "2024-02-18",
          createdAt: "2024-01-18T14:20:00Z",
        },
        {
          id: "3",
          invoiceNumber: "KAA-1003",
          customerName: "Amit Singh",
          customerPhone: "+91-9876543212",
          customerAddress: "789 Sector 15, Noida - 201301",
          items: [
            {
              name: "Engine Oil Change",
              quantity: 1,
              rate: 2500,
              gstRate: 18,
              amount: 2500,
            },
            {
              name: "Brake Pads Replacement",
              quantity: 1,
              rate: 4500,
              gstRate: 18,
              amount: 4500,
            },
          ],
          subtotal: 7000,
          gstAmount: 1260,
          rtoCharges: 0,
          insuranceCharges: 0,
          hypothecationCharges: 0,
          totalAmount: 8260,
          status: "draft",
          invoiceDate: "2024-01-20",
          dueDate: "2024-02-20",
          createdAt: "2024-01-20T09:15:00Z",
        },
        {
          id: "4",
          invoiceNumber: "KAA-1004",
          customerName: "Sunita Devi",
          customerPhone: "+91-9876543213",
          customerAddress: "321 Civil Lines, Gurgaon - 122001",
          items: [
            {
              name: "Tyre Replacement (Set of 4)",
              quantity: 4,
              rate: 8500,
              gstRate: 18,
              amount: 34000,
            },
          ],
          subtotal: 34000,
          gstAmount: 6120,
          rtoCharges: 0,
          insuranceCharges: 0,
          hypothecationCharges: 0,
          totalAmount: 40120,
          status: "overdue",
          invoiceDate: "2024-01-10",
          dueDate: "2024-02-10",
          createdAt: "2024-01-10T16:45:00Z",
        },
      ]
      setInvoices(mockInvoices)
    } catch (error) {
      console.error("Error loading invoices:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterInvoices = () => {
    let filtered = invoices

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.customerPhone.includes(searchTerm),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter)
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0)
          filtered = filtered.filter((invoice) => new Date(invoice.invoiceDate) >= filterDate)
          break
        case "week":
          filterDate.setDate(now.getDate() - 7)
          filtered = filtered.filter((invoice) => new Date(invoice.invoiceDate) >= filterDate)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          filtered = filtered.filter((invoice) => new Date(invoice.invoiceDate) >= filterDate)
          break
      }
    }

    setFilteredInvoices(filtered)
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
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handlePrintInvoice = (invoice: AutomobileInvoice) => {
    // This will be implemented with the PDF generation
    console.log("Print invoice:", invoice.invoiceNumber)
    alert(`Printing invoice ${invoice.invoiceNumber}...`)
  }

  const handleDownloadInvoice = (invoice: AutomobileInvoice) => {
    // This will be implemented with the PDF generation
    console.log("Download invoice:", invoice.invoiceNumber)
    alert(`Downloading invoice ${invoice.invoiceNumber}...`)
  }

  const handleSendInvoice = (invoice: AutomobileInvoice) => {
    console.log("Send invoice:", invoice.invoiceNumber)
    alert(`Sending invoice ${invoice.invoiceNumber} to ${invoice.customerEmail || invoice.customerPhone}...`)
  }

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return

    try {
      setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId))
    } catch (error) {
      console.error("Error deleting invoice:", error)
    }
  }

  const handleStatusChange = async (invoiceId: string, newStatus: string) => {
    try {
      setInvoices((prev) => prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: newStatus as any } : inv)))
    } catch (error) {
      console.error("Error updating invoice status:", error)
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
          <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
          <p className="text-gray-600">Manage all your automobile invoices</p>
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
              <p className="text-sm font-medium text-gray-600">Paid Invoices</p>
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
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-orange-600">
                {invoices.filter((inv) => inv.status === "sent").length}
              </p>
            </div>
            <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
              <div className="h-4 w-4 bg-orange-600 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(invoices.reduce((sum, inv) => sum + inv.totalAmount, 0))}
              </p>
            </div>
            <IndianRupee className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-5 w-5 text-gray-400" />
            <span>More Filters</span>
          </button>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Invoice #</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Vehicle/Items</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-medium text-blue-600">{invoice.invoiceNumber}</div>
                    <div className="text-xs text-gray-500">
                      Due: {new Date(invoice.dueDate).toLocaleDateString("en-IN")}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{invoice.customerName}</div>
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        <Phone className="h-3 w-3" />
                        <span>{invoice.customerPhone}</span>
                      </div>
                      {invoice.customerEmail && (
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          <Mail className="h-3 w-3" />
                          <span>{invoice.customerEmail}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {invoice.vehicleDetails ? (
                      <div>
                        <div className="font-medium text-gray-900">
                          {invoice.vehicleDetails.make} {invoice.vehicleDetails.model}
                        </div>
                        <div className="text-sm text-gray-500">
                          {invoice.vehicleDetails.year}
                          {invoice.vehicleDetails.registrationNumber &&
                            ` • ${invoice.vehicleDetails.registrationNumber}`}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium text-gray-900">
                          {invoice.items.length} item{invoice.items.length > 1 ? "s" : ""}
                        </div>
                        <div className="text-sm text-gray-500">
                          {invoice.items[0]?.name}
                          {invoice.items.length > 1 && ` +${invoice.items.length - 1} more`}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{formatCurrency(invoice.totalAmount)}</div>
                    <div className="text-sm text-gray-500">GST: {formatCurrency(invoice.gstAmount)}</div>
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={invoice.status}
                      onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(invoice.status)}`}
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-900">
                      {new Date(invoice.invoiceDate).toLocaleDateString("en-IN")}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(invoice.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => console.log("View invoice:", invoice.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {invoice.status === "draft" && (
                        <button
                          onClick={() => onEditInvoice(invoice)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handlePrintInvoice(invoice)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Print"
                      >
                        <Printer className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDownloadInvoice(invoice)}
                        className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </button>

                      {invoice.status !== "paid" && invoice.customerEmail && (
                        <button
                          onClick={() => handleSendInvoice(invoice)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Send Email"
                        >
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
