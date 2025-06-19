"use client"

import type React from "react"
import { useState } from "react"
import { Search, Filter, Plus, Edit2, Trash2, AlertTriangle } from "lucide-react"
import type { InventoryItem } from "../../types"

export const InventoryList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  // Mock data - would come from API in real app
  const [items] = useState<InventoryItem[]>([
    {
      id: "1",
      name: "Premium Cotton Shirt",
      category: "Clothing",
      sku: "CLT-001",
      quantity: 45,
      price: 1200,
      gstRate: 12,
      minStockLevel: 10,
      supplier: "Fashion Hub Ltd.",
      lastUpdated: new Date(),
    },
    {
      id: "2",
      name: "Designer Jeans",
      category: "Clothing",
      sku: "CLT-002",
      quantity: 8,
      price: 2500,
      gstRate: 12,
      minStockLevel: 15,
      supplier: "Denim Works",
      lastUpdated: new Date(),
    },
    {
      id: "3",
      name: "Leather Wallet",
      category: "Accessories",
      sku: "ACC-001",
      quantity: 23,
      price: 800,
      gstRate: 18,
      minStockLevel: 5,
      supplier: "Leather Craft Co.",
      lastUpdated: new Date(),
    },
  ])

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const isLowStock = (item: InventoryItem) => item.quantity <= item.minStockLevel

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage your products and stock levels</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4 mb-6">
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
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-5 w-5 text-gray-400" />
            <span>Filter</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">SKU</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Stock</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">GST</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Supplier</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{item.name}</span>
                      {isLowStock(item) && <AlertTriangle className="h-4 w-4 text-amber-500" title="Low stock" />}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{item.sku}</td>
                  <td className="py-4 px-4 text-gray-600">{item.category}</td>
                  <td className="py-4 px-4">
                    <span className={`font-medium ${isLowStock(item) ? "text-amber-600" : "text-gray-900"}`}>
                      {item.quantity}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">units</span>
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900">₹{item.price.toLocaleString()}</td>
                  <td className="py-4 px-4 text-gray-600">{item.gstRate}%</td>
                  <td className="py-4 px-4 text-gray-600">{item.supplier}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
