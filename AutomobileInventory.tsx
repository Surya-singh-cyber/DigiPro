"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Filter, Plus, Edit2, Trash2, Package, Car, Save, X, AlertTriangle } from "lucide-react"
import { useEnhancedAuth } from "../../contexts/EnhancedAuthContext"

interface AutomobileProduct {
  id: string
  organization_id: string
  item_code: string
  name: string
  description?: string
  category: string
  brand?: string
  model?: string
  year?: number
  color?: string
  fuel_type?: string
  transmission?: string
  engine_number?: string
  chassis_number?: string
  motor_number?: string
  serial_number?: string
  purchase_price: number
  selling_price: number
  gst_rate: number
  current_stock: number
  min_stock_level: number
  is_active: boolean
  created_at?: string
}

export const AutomobileInventory: React.FC = () => {
  const { user, organization } = useEnhancedAuth()
  const [products, setProducts] = useState<AutomobileProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<AutomobileProduct[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<AutomobileProduct | null>(null)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState<Partial<AutomobileProduct>>({
    name: "",
    description: "",
    category: "vehicle",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    fuel_type: "petrol",
    transmission: "manual",
    engine_number: "",
    chassis_number: "",
    motor_number: "",
    serial_number: "",
    purchase_price: 0,
    selling_price: 0,
    gst_rate: 18,
    current_stock: 1,
    min_stock_level: 1,
  })

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "vehicle", label: "Vehicles" },
    { value: "parts", label: "Spare Parts" },
    { value: "accessories", label: "Accessories" },
    { value: "service", label: "Service Items" },
  ]

  const fuelTypes = [
    { value: "petrol", label: "Petrol" },
    { value: "diesel", label: "Diesel" },
    { value: "electric", label: "Electric" },
    { value: "hybrid", label: "Hybrid" },
    { value: "cng", label: "CNG" },
  ]

  const transmissionTypes = [
    { value: "manual", label: "Manual" },
    { value: "automatic", label: "Automatic" },
    { value: "cvt", label: "CVT" },
  ]

  useEffect(() => {
    if (organization) {
      loadProducts()
    }
  }, [organization])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, selectedCategory])

  const loadProducts = async () => {
    try {
      setLoading(true)
      // For demo, using mock data
      const mockProducts: AutomobileProduct[] = [
        {
          id: "1",
          organization_id: organization!.id,
          item_code: "VEH-001",
          name: "Maruti Swift VXI",
          description: "2024 Model Maruti Swift VXI",
          category: "vehicle",
          brand: "Maruti Suzuki",
          model: "Swift VXI",
          year: 2024,
          color: "Pearl White",
          fuel_type: "petrol",
          transmission: "manual",
          engine_number: "G12B123456",
          chassis_number: "MA3ERLF1S00123456",
          motor_number: "MG12B789",
          serial_number: "SWI2024001",
          purchase_price: 550000,
          selling_price: 650000,
          gst_rate: 18,
          current_stock: 3,
          min_stock_level: 1,
          is_active: true,
          created_at: "2024-01-15",
        },
        {
          id: "2",
          organization_id: organization!.id,
          item_code: "VEH-002",
          name: "Honda City ZX",
          description: "2024 Model Honda City ZX CVT",
          category: "vehicle",
          brand: "Honda",
          model: "City ZX",
          year: 2024,
          color: "Metallic Blue",
          fuel_type: "petrol",
          transmission: "cvt",
          engine_number: "L15B789012",
          chassis_number: "MRHGM1850N0234567",
          motor_number: "HL15B456",
          serial_number: "CTY2024002",
          purchase_price: 1200000,
          selling_price: 1350000,
          gst_rate: 18,
          current_stock: 2,
          min_stock_level: 1,
          is_active: true,
          created_at: "2024-01-18",
        },
        {
          id: "3",
          organization_id: organization!.id,
          item_code: "PRT-001",
          name: "Engine Oil 5W-30",
          description: "Synthetic Engine Oil 5W-30 - 4L",
          category: "parts",
          brand: "Castrol",
          model: "GTX",
          purchase_price: 800,
          selling_price: 1200,
          gst_rate: 18,
          current_stock: 25,
          min_stock_level: 10,
          is_active: true,
          created_at: "2024-01-20",
        },
        {
          id: "4",
          organization_id: organization!.id,
          item_code: "PRT-002",
          name: "Brake Pads Set",
          description: "Front Brake Pads Set for Swift/Baleno",
          category: "parts",
          brand: "Bosch",
          model: "BP1234",
          purchase_price: 1500,
          selling_price: 2200,
          gst_rate: 18,
          current_stock: 8,
          min_stock_level: 5,
          is_active: true,
          created_at: "2024-01-22",
        },
      ]
      setProducts(mockProducts)
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.item_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.model?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    setFilteredProducts(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingProduct) {
        // Update existing product
        const updatedProducts = products.map((p) => (p.id === editingProduct.id ? { ...p, ...formData } : p))
        setProducts(updatedProducts)
      } else {
        // Add new product
        const newProduct: AutomobileProduct = {
          id: Date.now().toString(),
          organization_id: organization!.id,
          item_code: `${formData.category?.toUpperCase().slice(0, 3)}-${String(products.length + 1).padStart(3, "0")}`,
          ...(formData as AutomobileProduct),
          is_active: true,
          created_at: new Date().toISOString(),
        }
        setProducts([...products, newProduct])
      }

      resetForm()
    } catch (error) {
      console.error("Error saving product:", error)
    }
  }

  const handleEdit = (product: AutomobileProduct) => {
    setEditingProduct(product)
    setFormData(product)
    setShowAddForm(true)
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      setProducts(products.filter((p) => p.id !== productId))
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "vehicle",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      color: "",
      fuel_type: "petrol",
      transmission: "manual",
      engine_number: "",
      chassis_number: "",
      motor_number: "",
      serial_number: "",
      purchase_price: 0,
      selling_price: 0,
      gst_rate: 18,
      current_stock: 1,
      min_stock_level: 1,
    })
    setEditingProduct(null)
    setShowAddForm(false)
  }

  const isLowStock = (product: AutomobileProduct) => product.current_stock <= product.min_stock_level

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
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
          <h1 className="text-2xl font-bold text-gray-900">Automobile Inventory</h1>
          <p className="text-gray-600">Manage your vehicles, parts, and accessories</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vehicles</p>
              <p className="text-2xl font-bold text-green-600">
                {products.filter((p) => p.category === "vehicle").length}
              </p>
            </div>
            <Car className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-orange-600">{products.filter(isLowStock).length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(products.reduce((sum, p) => sum + p.selling_price * p.current_stock, 0))}
              </p>
            </div>
            <Package className="h-8 w-8 text-purple-600" />
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
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-5 w-5 text-gray-400" />
            <span>More Filters</span>
          </button>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Stock</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Purchase Price</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Selling Price</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">GST</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.item_code}</div>
                        {product.brand && (
                          <div className="text-xs text-gray-400">
                            {product.brand} {product.model}
                          </div>
                        )}
                      </div>
                      {isLowStock(product) && <AlertTriangle className="h-4 w-4 text-orange-500" title="Low stock" />}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="capitalize text-gray-600">{product.category}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`font-medium ${isLowStock(product) ? "text-orange-600" : "text-gray-900"}`}>
                      {product.current_stock}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">units</span>
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900">{formatCurrency(product.purchase_price)}</td>
                  <td className="py-4 px-4 font-medium text-gray-900">{formatCurrency(product.selling_price)}</td>
                  <td className="py-4 px-4 text-gray-600">{product.gst_rate}%</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
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

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No products found matching your criteria.</p>
            <button onClick={() => setShowAddForm(true)} className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
              Add your first product
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button onClick={resetForm} className="p-2 text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      {categories.slice(1).map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => setFormData((prev) => ({ ...prev, model: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Specific Fields */}
              {formData.category === "vehicle" && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                      <input
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData((prev) => ({ ...prev, year: Number.parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1990"
                        max={new Date().getFullYear() + 1}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                      <select
                        value={formData.fuel_type}
                        onChange={(e) => setFormData((prev) => ({ ...prev, fuel_type: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {fuelTypes.map((fuel) => (
                          <option key={fuel.value} value={fuel.value}>
                            {fuel.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                      <select
                        value={formData.transmission}
                        onChange={(e) => setFormData((prev) => ({ ...prev, transmission: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {transmissionTypes.map((trans) => (
                          <option key={trans.value} value={trans.value}>
                            {trans.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Engine Number</label>
                      <input
                        type="text"
                        value={formData.engine_number}
                        onChange={(e) => setFormData((prev) => ({ ...prev, engine_number: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Chassis Number</label>
                      <input
                        type="text"
                        value={formData.chassis_number}
                        onChange={(e) => setFormData((prev) => ({ ...prev, chassis_number: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Motor Number</label>
                      <input
                        type="text"
                        value={formData.motor_number}
                        onChange={(e) => setFormData((prev) => ({ ...prev, motor_number: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
                      <input
                        type="text"
                        value={formData.serial_number}
                        onChange={(e) => setFormData((prev) => ({ ...prev, serial_number: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing and Stock */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing & Stock</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price *</label>
                    <input
                      type="number"
                      value={formData.purchase_price}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, purchase_price: Number.parseFloat(e.target.value) }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price *</label>
                    <input
                      type="number"
                      value={formData.selling_price}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, selling_price: Number.parseFloat(e.target.value) }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GST Rate (%) *</label>
                    <select
                      value={formData.gst_rate}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, gst_rate: Number.parseFloat(e.target.value) }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value={0}>0%</option>
                      <option value={5}>5%</option>
                      <option value={12}>12%</option>
                      <option value={18}>18%</option>
                      <option value={28}>28%</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Stock *</label>
                    <input
                      type="number"
                      value={formData.current_stock}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, current_stock: Number.parseInt(e.target.value) }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Stock Level *</label>
                    <input
                      type="number"
                      value={formData.min_stock_level}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, min_stock_level: Number.parseInt(e.target.value) }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingProduct ? "Update Product" : "Add Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
