"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Save,
  Printer,
  User,
  Package,
  Plus,
  Trash2,
  Calculator,
  Car,
  Phone,
  Mail,
  MapPin,
  Search,
} from "lucide-react"
import { useEnhancedAuth } from "../../contexts/EnhancedAuthContext"

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  address: string
  gstin?: string
}

interface InventoryItem {
  id: string
  name: string
  category: string
  brand?: string
  model?: string
  sellingPrice: number
  gstRate: number
  engineNumber?: string
  chassisNumber?: string
  motorNumber?: string
  serialNumber?: string
}

interface InvoiceItem {
  id: string
  inventoryItemId?: string
  name: string
  description?: string
  quantity: number
  rate: number
  gstRate: number
  amount: number
  engineNumber?: string
  chassisNumber?: string
  motorNumber?: string
  serialNumber?: string
}

interface CreateAutomobileInvoiceProps {
  onBack: () => void
  editingInvoice?: any
}

export const CreateAutomobileInvoice: React.FC<CreateAutomobileInvoiceProps> = ({ onBack, editingInvoice }) => {
  const { user, organization } = useEnhancedAuth()
  const [loading, setLoading] = useState(false)

  // Customer data
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    gstin: "",
  })

  // Inventory data
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])

  // Invoice data
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([])
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0])
  const [dueDate, setDueDate] = useState("")

  // Additional charges
  const [rtoCharges, setRtoCharges] = useState(0)
  const [insuranceCharges, setInsuranceCharges] = useState(0)
  const [hypothecationCharges, setHypothecationCharges] = useState(0)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [notes, setNotes] = useState("")

  useEffect(() => {
    loadData()
    // Set default due date to 30 days from invoice date
    const defaultDueDate = new Date()
    defaultDueDate.setDate(defaultDueDate.getDate() + 30)
    setDueDate(defaultDueDate.toISOString().split("T")[0])
  }, [])

  const loadData = async () => {
    try {
      // Mock customers data
      const mockCustomers: Customer[] = [
        {
          id: "1",
          name: "Rajesh Kumar",
          phone: "+91-9876543210",
          email: "rajesh@example.com",
          address: "123 Main Street, Delhi - 110001",
          gstin: "07AAACH7409R1ZZ",
        },
        {
          id: "2",
          name: "Priya Sharma",
          phone: "+91-9876543211",
          email: "priya@example.com",
          address: "456 Park Avenue, Mumbai - 400001",
        },
        {
          id: "3",
          name: "Amit Singh",
          phone: "+91-9876543212",
          address: "789 Sector 15, Noida - 201301",
        },
      ]

      // Mock inventory data
      const mockInventory: InventoryItem[] = [
        {
          id: "1",
          name: "Maruti Swift VXI",
          category: "vehicle",
          brand: "Maruti Suzuki",
          model: "Swift VXI",
          sellingPrice: 650000,
          gstRate: 18,
          engineNumber: "G12B123456",
          chassisNumber: "MA3ERLF1S00123456",
          motorNumber: "MG12B789",
          serialNumber: "SWI2024001",
        },
        {
          id: "2",
          name: "Honda City ZX",
          category: "vehicle",
          brand: "Honda",
          model: "City ZX",
          sellingPrice: 1350000,
          gstRate: 18,
          engineNumber: "L15B789012",
          chassisNumber: "MRHGM1850N0234567",
          motorNumber: "HL15B456",
          serialNumber: "CTY2024002",
        },
        {
          id: "3",
          name: "Engine Oil 5W-30",
          category: "parts",
          brand: "Castrol",
          sellingPrice: 1200,
          gstRate: 18,
        },
        {
          id: "4",
          name: "Brake Pads Set",
          category: "parts",
          brand: "Bosch",
          sellingPrice: 2200,
          gstRate: 18,
        },
        {
          id: "5",
          name: "Tyre Set (4 pieces)",
          category: "parts",
          brand: "MRF",
          sellingPrice: 34000,
          gstRate: 18,
        },
      ]

      setCustomers(mockCustomers)
      setInventoryItems(mockInventory)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const addInvoiceItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      name: "",
      quantity: 1,
      rate: 0,
      gstRate: 18,
      amount: 0,
    }
    setInvoiceItems([...invoiceItems, newItem])
  }

  const updateInvoiceItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...invoiceItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    // Recalculate amount
    if (field === "quantity" || field === "rate") {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate
    }

    setInvoiceItems(updatedItems)
  }

  const removeInvoiceItem = (index: number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index))
  }

  const selectInventoryItem = (index: number, inventoryItem: InventoryItem) => {
    updateInvoiceItem(index, "inventoryItemId", inventoryItem.id)
    updateInvoiceItem(index, "name", inventoryItem.name)
    updateInvoiceItem(index, "rate", inventoryItem.sellingPrice)
    updateInvoiceItem(index, "gstRate", inventoryItem.gstRate)
    updateInvoiceItem(index, "amount", inventoryItem.sellingPrice)

    // Add vehicle-specific details if it's a vehicle
    if (inventoryItem.category === "vehicle") {
      updateInvoiceItem(index, "engineNumber", inventoryItem.engineNumber)
      updateInvoiceItem(index, "chassisNumber", inventoryItem.chassisNumber)
      updateInvoiceItem(index, "motorNumber", inventoryItem.motorNumber)
      updateInvoiceItem(index, "serialNumber", inventoryItem.serialNumber)
      updateInvoiceItem(index, "description", `${inventoryItem.brand} ${inventoryItem.model}`)
    }
  }

  // Calculations
  const subtotal = invoiceItems.reduce((sum, item) => sum + item.amount, 0)
  const totalGst = invoiceItems.reduce((sum, item) => sum + (item.amount * item.gstRate) / 100, 0)
  const totalCharges = rtoCharges + insuranceCharges + hypothecationCharges
  const grandTotal = subtotal + totalGst + totalCharges - discountAmount

  const handleCreateCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) {
      alert("Please fill in required fields")
      return
    }

    try {
      const customer: Customer = {
        id: `cust-${Date.now()}`,
        ...newCustomer,
      }

      setCustomers((prev) => [...prev, customer])
      setSelectedCustomer(customer)
      setShowCustomerForm(false)
      setNewCustomer({ name: "", phone: "", email: "", address: "", gstin: "" })
    } catch (error) {
      console.error("Error creating customer:", error)
    }
  }

  const handleSaveDraft = async () => {
    if (!selectedCustomer || invoiceItems.length === 0) {
      alert("Please select a customer and add at least one item")
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert("Invoice saved as draft!")
      onBack()
    } catch (error) {
      console.error("Error saving invoice:", error)
      alert("Error saving invoice")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAndPrint = async () => {
    if (!selectedCustomer || invoiceItems.length === 0) {
      alert("Please select a customer and add at least one item")
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert("Invoice saved and ready to print!")
      // This will trigger PDF generation
      generateInvoicePDF()
      onBack()
    } catch (error) {
      console.error("Error saving invoice:", error)
      alert("Error saving invoice")
    } finally {
      setLoading(false)
    }
  }

  const generateInvoicePDF = () => {
    // This will be implemented with the PDF component
    console.log("Generating PDF for invoice...")
    alert("PDF generation will be implemented next!")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {editingInvoice ? "Edit Invoice" : "Create New Invoice"}
            </h1>
            <p className="text-gray-600">Create a professional automobile invoice</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSaveDraft}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>Save as Draft</span>
          </button>
          <button
            onClick={handleSaveAndPrint}
            disabled={loading}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Printer className="h-4 w-4" />
            <span>Save & Print</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Customer Details</span>
              </h3>
              <button
                onClick={() => setShowCustomerForm(true)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add New Customer
              </button>
            </div>

            {showCustomerForm ? (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Customer Name *"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer((prev) => ({ ...prev, name: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer((prev) => ({ ...prev, phone: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer((prev) => ({ ...prev, email: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="GSTIN"
                    value={newCustomer.gstin}
                    onChange={(e) => setNewCustomer((prev) => ({ ...prev, gstin: e.target.value.toUpperCase() }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <textarea
                  placeholder="Address *"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                />
                <div className="flex space-x-3">
                  <button
                    onClick={handleCreateCustomer}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Customer
                  </button>
                  <button
                    onClick={() => setShowCustomerForm(false)}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={selectedCustomer?.id || ""}
                    onChange={(e) => {
                      const customer = customers.find((c) => c.id === e.target.value)
                      setSelectedCustomer(customer || null)
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCustomer && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{selectedCustomer.name}</span>
                    </h4>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3 w-3" />
                        <span>{selectedCustomer.phone}</span>
                      </div>
                      {selectedCustomer.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3 w-3" />
                          <span>{selectedCustomer.email}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3" />
                        <span>{selectedCustomer.address}</span>
                      </div>
                      {selectedCustomer.gstin && (
                        <div className="text-xs font-mono bg-white px-2 py-1 rounded">
                          GSTIN: {selectedCustomer.gstin}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Invoice Items */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Invoice Items</span>
              </h3>
              <button
                onClick={addInvoiceItem}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-4">
              {invoiceItems.map((item, index) => (
                <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    {/* Item Selection */}
                    <div className="md:col-span-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
                      <select
                        value={item.inventoryItemId || ""}
                        onChange={(e) => {
                          const inventoryItem = inventoryItems.find((inv) => inv.id === e.target.value)
                          if (inventoryItem) {
                            selectInventoryItem(index, inventoryItem)
                          } else {
                            updateInvoiceItem(index, "inventoryItemId", "")
                            updateInvoiceItem(index, "name", "")
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">Select from inventory</option>
                        {inventoryItems.map((invItem) => (
                          <option key={invItem.id} value={invItem.id}>
                            {invItem.name} - {formatCurrency(invItem.sellingPrice)}
                          </option>
                        ))}
                      </select>
                      {!item.inventoryItemId && (
                        <input
                          type="text"
                          placeholder="Or enter custom item name"
                          value={item.name}
                          onChange={(e) => updateInvoiceItem(index, "name", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm mt-2"
                        />
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateInvoiceItem(index, "quantity", Number.parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        min="1"
                      />
                    </div>

                    {/* Rate */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rate</label>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateInvoiceItem(index, "rate", Number.parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    {/* GST Rate */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">GST %</label>
                      <select
                        value={item.gstRate}
                        onChange={(e) => updateInvoiceItem(index, "gstRate", Number.parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value={0}>0%</option>
                        <option value={5}>5%</option>
                        <option value={12}>12%</option>
                        <option value={18}>18%</option>
                        <option value={28}>28%</option>
                      </select>
                    </div>

                    {/* Amount */}
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium">
                        {formatCurrency(item.amount)}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <div className="md:col-span-1 flex items-end">
                      <button
                        onClick={() => removeInvoiceItem(index)}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Vehicle Details (if applicable) */}
                  {item.engineNumber && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center space-x-2">
                        <Car className="h-4 w-4" />
                        <span>Vehicle Details</span>
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-gray-600">Engine:</span>
                          <div className="font-mono">{item.engineNumber}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Chassis:</span>
                          <div className="font-mono">{item.chassisNumber}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Motor:</span>
                          <div className="font-mono">{item.motorNumber}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Serial:</span>
                          <div className="font-mono">{item.serialNumber}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {invoiceItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No items added yet</p>
                  <button onClick={addInvoiceItem} className="mt-2 text-blue-600 hover:text-blue-700 font-medium">
                    Add your first item
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Additional Charges */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Charges</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">RTO Charges</label>
                <input
                  type="number"
                  value={rtoCharges}
                  onChange={(e) => setRtoCharges(Number.parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Charges</label>
                <input
                  type="number"
                  value={insuranceCharges}
                  onChange={(e) => setInsuranceCharges(Number.parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hypothecation Charges</label>
                <input
                  type="number"
                  value={hypothecationCharges}
                  onChange={(e) => setHypothecationCharges(Number.parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount Amount</label>
              <input
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(Number.parseFloat(e.target.value) || 0)}
                className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="0.01"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Any additional notes or instructions..."
              />
            </div>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>Invoice Summary</span>
            </h3>

            <div className="space-y-4">
              {/* Invoice Details */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">GST:</span>
                    <span className="font-medium">{formatCurrency(totalGst)}</span>
                  </div>

                  {rtoCharges > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">RTO Charges:</span>
                      <span className="font-medium">{formatCurrency(rtoCharges)}</span>
                    </div>
                  )}

                  {insuranceCharges > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Insurance:</span>
                      <span className="font-medium">{formatCurrency(insuranceCharges)}</span>
                    </div>
                  )}

                  {hypothecationCharges > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hypothecation:</span>
                      <span className="font-medium">{formatCurrency(hypothecationCharges)}</span>
                    </div>
                  )}

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount:</span>
                      <span className="font-medium">-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-blue-600">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* GST Breakdown */}
              {totalGst > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">GST Breakdown</h4>
                  <div className="space-y-1 text-xs">
                    {Array.from(new Set(invoiceItems.map((item) => item.gstRate))).map((rate) => {
                      const itemsWithRate = invoiceItems.filter((item) => item.gstRate === rate)
                      const taxableAmount = itemsWithRate.reduce((sum, item) => sum + item.amount, 0)
                      const gstAmount = (taxableAmount * rate) / 100

                      return (
                        <div key={rate} className="flex justify-between">
                          <span>GST {rate}%:</span>
                          <span>{formatCurrency(gstAmount)}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
