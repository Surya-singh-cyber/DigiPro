"use client"

import { useState, useEffect } from "react"
import { useEnhancedAuth } from "../../contexts/EnhancedAuthContext"
import { multiLocationService } from "../../services/multiLocationService"
import type { Location, MultiLocationStats, LocationComparison } from "../../types"
import {
  Building2,
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Settings,
  BarChart3,
  Truck,
  Store,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface MultiLocationDashboardProps {
  onCreateLocation: () => void
  onManageLocation: (location: Location) => void
  onViewAnalytics: (location: Location) => void
}

export const MultiLocationDashboard = ({
  onCreateLocation,
  onManageLocation,
  onViewAnalytics,
}: MultiLocationDashboardProps) => {
  const { organization, isDemoMode } = useEnhancedAuth()
  const [locations, setLocations] = useState<Location[]>([])
  const [stats, setStats] = useState<MultiLocationStats | null>(null)
  const [comparison, setComparison] = useState<LocationComparison[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<string>("all")

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isDemoMode) {
          setLocations(generateMockLocations())
          setStats(generateMockStats())
          setComparison(generateMockComparison())
          setLoading(false)
          return
        }

        if (!organization?.id) return

        const [locationsData, statsData, comparisonData] = await Promise.all([
          multiLocationService.getLocations(organization.id),
          multiLocationService.getMultiLocationStats(organization.id),
          multiLocationService.getLocationComparison(organization.id),
        ])

        setLocations(locationsData)
        setStats(statsData)
        setComparison(comparisonData)
      } catch (error) {
        console.error("Error fetching multi-location data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [organization?.id, isDemoMode])

  const generateMockLocations = (): Location[] => [
    {
      id: "1",
      organization_id: "org1",
      name: "Main Store",
      code: "MAIN",
      address: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      phone: "+91-9876543210",
      email: "main@store.com",
      is_headquarters: true,
      is_active: true,
      settings: {},
    },
    {
      id: "2",
      organization_id: "org1",
      name: "Branch Store",
      code: "BR01",
      address: "456 Branch Road",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      phone: "+91-9876543211",
      email: "branch@store.com",
      is_headquarters: false,
      is_active: true,
      settings: {},
    },
    {
      id: "3",
      organization_id: "org1",
      name: "Outlet Store",
      code: "OUT1",
      address: "789 Outlet Avenue",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      phone: "+91-9876543212",
      email: "outlet@store.com",
      is_headquarters: false,
      is_active: true,
      settings: {},
    },
  ]

  const generateMockStats = (): MultiLocationStats => ({
    total_locations: 3,
    active_locations: 3,
    total_revenue_all_locations: 2500000,
    total_profit_all_locations: 625000,
    best_performing_location: {
      location: generateMockLocations()[0],
      revenue: 1200000,
      profit: 300000,
    },
    worst_performing_location: {
      location: generateMockLocations()[2],
      revenue: 650000,
      profit: 162500,
    },
    pending_transfers: 5,
    low_stock_alerts: [],
  })

  const generateMockComparison = (): LocationComparison[] => [
    {
      location: generateMockLocations()[0],
      current_month: { revenue: 120000, profit: 30000, orders: 150, customers: 85 },
      previous_month: { revenue: 110000, profit: 27500, orders: 140, customers: 80 },
      growth: { revenue_growth: 9.1, profit_growth: 9.1, order_growth: 7.1, customer_growth: 6.3 },
    },
    {
      location: generateMockLocations()[1],
      current_month: { revenue: 95000, profit: 23750, orders: 120, customers: 70 },
      previous_month: { revenue: 100000, profit: 25000, orders: 125, customers: 75 },
      growth: { revenue_growth: -5.0, profit_growth: -5.0, order_growth: -4.0, customer_growth: -6.7 },
    },
    {
      location: generateMockLocations()[2],
      current_month: { revenue: 65000, profit: 16250, orders: 80, customers: 50 },
      previous_month: { revenue: 60000, profit: 15000, orders: 75, customers: 45 },
      growth: { revenue_growth: 8.3, profit_growth: 8.3, order_growth: 6.7, customer_growth: 11.1 },
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Multi-Location Management</h1>
          <p className="text-gray-600">Manage all your business locations from one dashboard</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics Report
          </Button>
          <Button onClick={onCreateLocation}>
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_locations || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.active_locations || 0} active locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.total_revenue_all_locations || 0)}</div>
            <p className="text-xs text-muted-foreground">Across all locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Transfers</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pending_transfers || 0}</div>
            <p className="text-xs text-muted-foreground">Stock transfers pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.low_stock_alerts?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Low stock items</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="transfers">Stock Transfers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Location Performance Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Location Performance Comparison</CardTitle>
              <CardDescription>Monthly performance across all locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comparison.map((loc) => (
                  <div key={loc.location.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Store className="h-5 w-5 text-gray-400" />
                        <div>
                          <h3 className="font-medium">{loc.location.name}</h3>
                          <p className="text-sm text-gray-500">
                            {loc.location.city}, {loc.location.state}
                          </p>
                        </div>
                        {loc.location.is_headquarters && <Badge variant="secondary">HQ</Badge>}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-6 text-center">
                      <div>
                        <p className="text-sm text-gray-500">Revenue</p>
                        <p className="font-medium">{formatCurrency(loc.current_month.revenue)}</p>
                        <div
                          className={`flex items-center justify-center text-xs ${
                            loc.growth.revenue_growth >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {loc.growth.revenue_growth >= 0 ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                          )}
                          {formatPercentage(loc.growth.revenue_growth)}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Profit</p>
                        <p className="font-medium">{formatCurrency(loc.current_month.profit)}</p>
                        <div
                          className={`flex items-center justify-center text-xs ${
                            loc.growth.profit_growth >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {loc.growth.profit_growth >= 0 ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                          )}
                          {formatPercentage(loc.growth.profit_growth)}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Orders</p>
                        <p className="font-medium">{loc.current_month.orders}</p>
                        <div
                          className={`flex items-center justify-center text-xs ${
                            loc.growth.order_growth >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {loc.growth.order_growth >= 0 ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                          )}
                          {formatPercentage(loc.growth.order_growth)}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Customers</p>
                        <p className="font-medium">{loc.current_month.customers}</p>
                        <div
                          className={`flex items-center justify-center text-xs ${
                            loc.growth.customer_growth >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {loc.growth.customer_growth >= 0 ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                          )}
                          {formatPercentage(loc.growth.customer_growth)}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => onViewAnalytics(loc.location)}>
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onManageLocation(loc.location)}>
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Best vs Worst Performing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Best Performing Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{stats?.best_performing_location?.location?.name}</h3>
                    <p className="text-sm text-gray-500">{stats?.best_performing_location?.location?.city}</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(stats?.best_performing_location?.revenue || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Needs Attention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingDown className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{stats?.worst_performing_location?.location?.name}</h3>
                    <p className="text-sm text-gray-500">{stats?.worst_performing_location?.location?.city}</p>
                    <p className="text-lg font-bold text-orange-600">
                      {formatCurrency(stats?.worst_performing_location?.revenue || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => (
              <Card key={location.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5" />
                      <span>{location.name}</span>
                    </CardTitle>
                    {location.is_headquarters && <Badge variant="default">Headquarters</Badge>}
                  </div>
                  <CardDescription>{location.code}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">{location.address}</p>
                    <p className="text-sm text-gray-600">
                      {location.city}, {location.state} - {location.pincode}
                    </p>
                    <p className="text-sm text-gray-600">{location.phone}</p>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => onViewAnalytics(location)}>
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Analytics
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onManageLocation(location)}>
                      <Settings className="h-4 w-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transfers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Transfers</CardTitle>
              <CardDescription>Manage inventory transfers between locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No stock transfers found</p>
                <Button>Create Stock Transfer</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Comparison</CardTitle>
              <CardDescription>Monthly revenue comparison across locations</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location.name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="current_month.revenue" fill="var(--color-revenue)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
