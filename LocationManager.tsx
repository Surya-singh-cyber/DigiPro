"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useEnhancedAuth } from "../../contexts/EnhancedAuthContext"
import { multiLocationService } from "../../services/multiLocationService"
import type { Location } from "../../types"
import { ArrowLeft, MapPin, Phone, Building, Save, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LocationManagerProps {
  location?: Location
  onBack: () => void
  onSave: (location: Location) => void
}

export const LocationManager = ({ location, onBack, onSave }: LocationManagerProps) => {
  const { organization, isDemoMode } = useEnhancedAuth()
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
    is_headquarters: false,
    is_active: true,
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditing = !!location

  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name,
        code: location.code,
        address: location.address,
        city: location.city,
        state: location.state,
        pincode: location.pincode,
        phone: location.phone,
        email: location.email,
        is_headquarters: location.is_headquarters,
        is_active: location.is_active,
      })
    }
  }, [location])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Location name is required"
    }

    if (!formData.code.trim()) {
      newErrors.code = "Location code is required"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required"
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      if (isDemoMode) {
        // Demo mode: simulate save
        const savedLocation: Location = {
          id: location?.id || `loc_${Date.now()}`,
          organization_id: organization?.id || "demo_org",
          ...formData,
          settings: location?.settings || {},
        }

        setTimeout(() => {
          onSave(savedLocation)
          setLoading(false)
        }, 1000)
        return
      }

      // Production mode: save to database
      if (!organization?.id) {
        throw new Error("Organization not found")
      }

      let savedLocation: Location

      if (isEditing && location) {
        savedLocation = await multiLocationService.updateLocation(location.id, {
          ...formData,
          organization_id: organization.id,
        })
      } else {
        savedLocation = await multiLocationService.createLocation({
          ...formData,
          organization_id: organization.id,
          settings: {},
        })
      }

      onSave(savedLocation)
    } catch (error: any) {
      console.error("Error saving location:", error)
      setErrors({ submit: error.message || "Failed to save location" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!location || !confirm("Are you sure you want to delete this location?")) {
      return
    }

    setLoading(true)

    try {
      if (isDemoMode) {
        // Demo mode: simulate delete
        setTimeout(() => {
          onBack()
          setLoading(false)
        }, 1000)
        return
      }

      await multiLocationService.deleteLocation(location.id)
      onBack()
    } catch (error: any) {
      console.error("Error deleting location:", error)
      setErrors({ submit: error.message || "Failed to delete location" })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{isEditing ? "Edit Location" : "Add New Location"}</h1>
            <p className="text-gray-600">{isEditing ? "Update location details" : "Create a new business location"}</p>
          </div>
        </div>
        {isEditing && (
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Location
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Basic Information</span>
            </CardTitle>
            <CardDescription>Enter the basic details for this location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Location Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Main Store, Branch Office"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="code">Location Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                  placeholder="e.g., MAIN, BR01"
                  className={errors.code ? "border-red-500" : ""}
                />
                {errors.code && <p className="text-sm text-red-500 mt-1">{errors.code}</p>}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_headquarters"
                checked={formData.is_headquarters}
                onCheckedChange={(checked) => handleInputChange("is_headquarters", checked)}
              />
              <Label htmlFor="is_headquarters">This is the headquarters location</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange("is_active", checked)}
              />
              <Label htmlFor="is_active">Location is active</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Address Information</span>
            </CardTitle>
            <CardDescription>Enter the complete address for this location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Street Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter complete street address"
                className={errors.address ? "border-red-500" : ""}
                rows={3}
              />
              {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="City"
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
              </div>

              <div>
                <Label htmlFor="state">State *</Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                  <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Karnataka">Karnataka</SelectItem>
                    <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="Gujarat">Gujarat</SelectItem>
                    <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                    <SelectItem value="West Bengal">West Bengal</SelectItem>
                    <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                  </SelectContent>
                </Select>
                {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
              </div>

              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  placeholder="Pincode"
                  className={errors.pincode ? "border-red-500" : ""}
                />
                {errors.pincode && <p className="text-sm text-red-500 mt-1">{errors.pincode}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Contact Information</span>
            </CardTitle>
            <CardDescription>Enter contact details for this location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+91-9876543210"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="location@company.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{errors.submit}</p>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isEditing ? "Update Location" : "Create Location"}
          </Button>
        </div>
      </form>
    </div>
  )
}
