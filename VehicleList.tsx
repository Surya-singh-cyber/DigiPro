"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Filter, Plus, Edit2, Trash2, Car, Calendar, AlertTriangle, Eye } from "lucide-react"
import { supabaseService } from "../../services/supabaseService"
import { useAuth } from "../../contexts/AuthContext"
import type { Vehicle } from "../../types"

export const VehicleList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadVehicles()
    }
  }, [user])

  const loadVehicles = async () => {
    try {
      setLoading(true)
      const data = await supabaseService.getVehicles(user!.id)
      setVehicles(data)
    } catch (error) {
      console.error("Error loading vehicles:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.registration_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const isServiceDue = (vehicle: Vehicle) => {
    if (!vehicle.next_service_due) return false
    const dueDate = new Date(vehicle.next_service_due)
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 // Service due within 30 days
  }

  const isInsuranceExpiring = (vehicle: Vehicle) => {
    if (!vehicle.insurance_expiry) return false
    const expiryDate = new Date(vehicle.insurance_expiry)
    const today = new Date()
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 // Insurance expiring within 30 days
  }

  const getFuelTypeColor = (fuelType: string) => {
    switch (fuelType) {
      case "petrol":
        return "bg-blue-100 text-blue-800"
      case "diesel":
        return "bg-green-100 text-green-800"
      case "electric":
        return "bg-purple-100 text-purple-800"
      case "hybrid":
        return "bg-orange-100 text-orange-800"
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Management</h1>
          <p className="text-gray-600">Manage customer vehicles and service records</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
            </div>
            <Car className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Service Due</p>
              <p className="text-2xl font-bold text-amber-600">{vehicles.filter(isServiceDue).length}</p>
            </div>
            <Calendar className="h-8 w-8 text-amber-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Insurance Expiring</p>
              <p className="text-2xl font-bold text-red-600">{vehicles.filter(isInsuranceExpiring).length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Electric Vehicles</p>
              <p className="text-2xl font-bold text-green-600">
                {vehicles.filter((v) => v.fuel_type === "electric").length}
              </p>
            </div>
            <Car className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search vehicles..."
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
                <th className="text-left py-3 px-4 font-medium text-gray-900">Vehicle</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Owner</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Registration</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Fuel Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Mileage</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Next Service</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Car className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {vehicle.make} {vehicle.model}
                        </div>
                        <div className="text-sm text-gray-500">{vehicle.year}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{vehicle.customer?.name}</div>
                      <div className="text-sm text-gray-500">{vehicle.customer?.phone}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium text-blue-600">{vehicle.registration_number}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getFuelTypeColor(vehicle.fuel_type)}`}
                    >
                      {vehicle.fuel_type}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : "N/A"}
                  </td>
                  <td className="py-4 px-4">
                    {vehicle.next_service_due ? (
                      <div
                        className={`text-sm ${isServiceDue(vehicle) ? "text-amber-600 font-medium" : "text-gray-600"}`}
                      >
                        {new Date(vehicle.next_service_due).toLocaleDateString("en-IN")}
                      </div>
                    ) : (
                      <span className="text-gray-400">Not set</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1">
                      {isServiceDue(vehicle) && (
                        <AlertTriangle className="h-4 w-4 text-amber-500" title="Service due" />
                      )}
                      {isInsuranceExpiring(vehicle) && (
                        <AlertTriangle className="h-4 w-4 text-red-500" title="Insurance expiring" />
                      )}
                      {!isServiceDue(vehicle) && !isInsuranceExpiring(vehicle) && (
                        <span className="text-green-600 text-sm">Good</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="View Details">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-8">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No vehicles found matching your search.</p>
            <button onClick={() => setShowAddForm(true)} className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
              Add your first vehicle
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
