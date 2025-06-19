"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Save, Send, User, Package, Plus, Trash2 } from "lucide-react"
import { supabaseService } from "../../services/supabaseService"
import { useEnhancedAuth } from "../../contexts/EnhancedAuthContext"
import type { Customer, InventoryItem } from "../../types"

interface CreateInvoiceProps {
  onBack: () => void
}

interface InvoiceItem {
  id: string
  inventory_item_id?: string
  name: string
  description?: string
  quantity: number
  price: number
  gst_rate: number
  amount: number
  motor_number?: string
  chassis_number?: string
  serial_model_number?: string
}

interface InvoiceData {
  customer_id: string
  vehicle_id?: string
  items: InvoiceItem[]
  subtotal: number
  gst_amount: number
  discount_amount: number
  hypothecation_charges: number
  rto_charges: number
  insurance_charges: number
  total: number
  notes?: string
  due_date: string
}

export const CreateInvoice: React.FC<CreateInvoiceProps> = ({ onBack }) => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([])
  const [loading, setLoading] = useState(false)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    gst_number: "",
  })

  // Invoice calculations
  const [discountAmount, setDiscountAmount] = useState(0)
  const [hypothecationCharges, setHypothecationCharges] = useState(0)
  const [rtoCharges, setRtoCharges] = useState(0)
  const [insuranceCharges, setInsuranceCharges] = useState(0)
  const [notes, setNotes] = useState("")
  const [dueDate, setDueDate] = useState("")

  const { user, isDemoMode } = useEnhancedAuth()

  useEffect(() => {
    if (user && !isDemoMode) {
      loadCustomers()
      loadInventoryItems()
    } else if (isDemoMode) {
      loadDemoData()
    }

    // Set default due date to 30 days from now
    const defaultDueDate = new Date()
    defaultDueDate.setDate(defaultDueDate.getDate() + 30)
    setDueDate(defaultDueDate.toISOString().split("T")[0])
  }, [user, isDemoMode])

  const loadCustomers = async () => {
    try {
      const data = await supabaseService.getCustomers(user!.uid)
      setCustomers(data)
    } catch (error) {
      console.error("Error loading customers:", error)
    }
  }

  const loadInventoryItems = async () => {
    try {
      const data = await supabaseService.getInventoryItems(user!.uid)
      setInventoryItems(data)
    } catch (error) {
      console.error("Error loading inventory:", error)
    }
  }

  const loadDemoData = () => {
    // Demo customers
    const demoCustomers: Customer[] = [
      {
        id: "cust-1",
        user_id: "demo",
        name: "Rajesh Kumar",
        phone: "+91-9876543210",
        email: "rajesh@example.com",
        address: "123 Main Street, Delhi",
        gst_number: "07AAACH7409R1ZZ",
      },
      {
        id: "cust-2",
        user_id: "demo",
        name: "Priya Sharma",
        phone: "+91-9876543211",
        email: "priya@example.com",
        address: "456 Park Avenue, Mumbai",
      },
    ]

    // Demo inventory
    const demoInventory: InventoryItem[] = [
      {
        id: "inv-1",
        user_id: "demo",
        name: "Maruti Swift VXI",
        category: "Vehicle",
        sku: "MSV-001",
        quantity: 5,
        price: 125000,
        gst_rate: 18,
        min_stock_level: 1,
        supplier: "Maruti Suzuki",
      },
      {
        id: "inv-2",
        user_id: "demo",
        name: "Honda City Engine Oil",
        category: "Parts",
        sku: "HCO-001",
        quantity: 50,
        price: 850,
        gst_rate: 18,
        min_stock_level: 10,
        supplier: "Honda Parts",
      },
      {
        id: "inv-3",
        user_id: "demo",
        name: "Brake Pads Set",
        category: "Parts",
        sku: "BPS-001",
        quantity: 25,
        price: 2500,
        gst_rate: 18,
        min_stock_level: 5,
        supplier: "Auto Parts Co",
      },
    ]

    setCustomers(demoCustomers)
    setInventoryItems(demoInventory)
  }

  const addInvoiceItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      name: "",
      quantity: 1,
      price: 0,
      gst_rate: 18,
      amount: 0,
    }
    setInvoiceItems([...invoiceItems, newItem])
  }

  const updateInvoiceItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...invoiceItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    // Recalculate amount
    if (field === "quantity" || field === "price") {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].price
    }

    setInvoiceItems(updatedItems)
  }

  const removeInvoiceItem = (index: number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index))
  }

  const selectInventoryItem = (index: number, inventoryItem: InventoryItem) => {
    updateInvoiceItem(index, "inventory_item_id", inventoryItem.id)
    updateInvoiceItem(index, "name", inventoryItem.name)
    updateInvoiceItem(index, "price", inventoryItem.price)
    updateInvoiceItem(index, "gst_rate", inventoryItem.gst_rate)
    updateInvoiceItem(index, "amount", inventoryItem.price)
  }

  // Calculations
  const subtotal = invoiceItems.reduce((sum, item) => sum + item.amount, 0)
  const totalGst = invoiceItems.reduce((sum, item) => sum + (item.amount * item.gst_rate) / 100, 0)
  const totalCharges = hypothecationCharges + rtoCharges + insuranceCharges
  const grandTotal = subtotal + totalGst + totalCharges - discountAmount

  const handleCreateCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) {
      alert("Please fill in required fields")
      return
    }

    try {
      let customer: Customer

      if (!isDemoMode) {
        customer = await supabaseService.createCustomer({
          ...newCustomer,
          user_id: user!.uid,
        })
        await loadCustomers()
      } else {
        // Demo mode: create mock customer
        customer = {
          id: `cust-${Date.now()}`,
          user_id: "demo",
          ...newCustomer,
        }
        setCustomers((prev) => [...prev, customer])
      }

      setSelectedCustomer(customer)
      setShowCustomerForm(false)
      setNewCustomer({ name: "", phone: "", email: "", address: "", gst_number: "" })
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
      const invoiceData: InvoiceData = {
        customer_id: selectedCustomer.id,
        items: invoiceItems,
        subtotal,
        gst_amount: totalGst,
        discount_amount: discountAmount,
        hypothecation_charges: hypothecationCharges,
        rto_charges: rtoCharges,
        insurance_charges: insuranceCharges,
        total: grandTotal,
        notes,
        due_date: dueDate,
      }

      if (!isDemoMode) {
        // Save to Supabase
        await supabaseService.createInvoice({
          ...invoiceData,
          user_id: user!.uid,
          invoice_number: `INV-${Date.now()}`,
          status: "draft",
        })
      }

      alert("Invoice saved as draft!")
      onBack()
    } catch (error) {
      console.error("Error saving invoice:", error)
      alert("Error saving invoice")
    } finally {
      setLoading(false)
    }
  }

  const handleSendInvoice = async () => {
    if (!selectedCustomer || invoiceItems.length === 0) {
      alert("Please select a customer and add at least one item")
      return
    }

    setLoading(true)
    try {
      const invoiceData: InvoiceData = {
        customer_id: selectedCustomer.id,
        items: invoiceItems,
        subtotal,
        gst_amount: totalGst,
        discount_amount: discountAmount,
        hypothecation_charges: hypothecationCharges,
        rto_charges: rtoCharges,
        insurance_charges: insuranceCharges,
        total: grandTotal,
        notes,
        due_date: dueDate,
      }

      if (!isDemoMode) {
        // Save to Supabase
        await supabaseService.createInvoice({
          ...invoiceData,
          user_id: user!.uid,
          invoice_number: `INV-${Date.now()}`,
          status: "sent",
        })
      }

      alert("Invoice sent successfully!")
      onBack()
    } catch (error) {
      console.error("Error sending invoice:", error)
      alert("Error sending invoice")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Invoice</h1>
            <p className="text-gray-600">Create a new invoice for your customer</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSaveDraft}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>Save Draft</span>
          </button>
          <button
            onClick={handleSendInvoice}
            disabled={loading}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            <span>Send Invoice</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Selection */}
        <div className="lg:col-span-2 space-y-6">
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
                    placeholder="GST Number"
                    value={newCustomer.gst_number}
                    onChange={(e) => setNewCustomer((prev) => ({ ...prev, gst_number: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <textarea
                  placeholder="Address"
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
              <select
                value={selectedCustomer?.id || ""}
                onChange={(e) => {
                  const customer = customers.find((c) => c.id === e.target.value)
                  setSelectedCustomer(customer || null)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.phone}
                  </option>
                ))}
              </select>
            )}

            {selectedCustomer && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-gray-900">{selectedCustomer.name}</h4>
                <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                {selectedCustomer.email && <p className="text-sm text-gray-600">{selectedCustomer.email}</p>}
                {selectedCustomer.address && <p className="text-sm text-gray-600">{selectedCustomer.address}</p>}
                {selectedCustomer.gst_number && (
                  <p className="text-sm text-gray-600">GST: {selectedCustomer.gst_number}</p>
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
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-4">
              {invoiceItems.map((item, index) => (
                <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                      <select
                        value={item.inventory_item_id || ""}
                        onChange={(e) => {
                          const inventoryItem = inventoryItems.find((inv) => inv.id === e.target.value)
                          if (inventoryItem) {
                            selectInventoryItem(index, inventoryItem)
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select from inventory</option>
                        {inventoryItems.map((invItem) => (
                          <option key={invItem.id} value={invItem.id}>
                            {invItem.name} - ₹{invItem.price}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Or enter custom item"
                        value={item.name}
                        onChange={(e) => updateInvoiceItem(index, "name", e.target.value)}
                        className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateInvoiceItem(index, "quantity", Number.parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => updateInvoiceItem(index, "price", Number.parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GST (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.gst_rate}
                        onChange={(e) => updateInvoiceItem(index, "gst_rate", Number.parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-end">
                      <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                        <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                          {item.amount.toLocaleString("en-IN")}
                        </div>
                      </div>
                      <button
                        onClick={() => removeInvoiceItem(index)}
                        className="ml-2 p-2 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Additional fields for vehicles */}
                  {item.name.toLowerCase().includes("vehicle") ||
                  item.name.toLowerCase().includes("car") ||
                  item.name.toLowerCase().includes("bike") ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <input
                        type="text"
                        placeholder="Engine Number"
                        value={item.motor_number || ""}
                        onChange={(e) => updateInvoiceItem(index, "motor_number", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Chassis Number"
                        value={item.chassis_number || ""}
                        onChange={(e) => updateInvoiceItem(index, "chassis_number", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Model Number"
                        value={item.serial_model_number || ""}
                        onChange={(e) => updateInvoiceItem(index, "serial_model_number", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  ) : null}
                </div>
              ))}

              {invoiceItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No items added yet. Click "Add Item" to get started.
                </div>
              )}
            </div>
          </div>

          {/* Additional Charges */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Charges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RTO Charges (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={rtoCharges}
                  onChange={(e) => setRtoCharges(Number.parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Charges (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={insuranceCharges}
                  onChange={(e) => setInsuranceCharges(Number.parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hypothecation Charges (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={hypothecationCharges}
                  onChange={(e) => setHypothecationCharges(Number.parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number.parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Notes and Due Date */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes or terms..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Summary</h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">GST Amount:</span>
                <span className="font-medium">₹{totalGst.toLocaleString("en-IN")}</span>
              </div>

              {rtoCharges > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">RTO Charges:</span>
                  <span className="font-medium">₹{rtoCharges.toLocaleString("en-IN")}</span>
                </div>
              )}

              {insuranceCharges > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Insurance:</span>
                  <span className="font-medium">₹{insuranceCharges.toLocaleString("en-IN")}</span>
                </div>
              )}

              {hypothecationCharges > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hypothecation:</span>
                  <span className="font-medium">₹{hypothecationCharges.toLocaleString("en-IN")}</span>
                </div>
              )}

              {discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-red-600">-₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-blue-600">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
