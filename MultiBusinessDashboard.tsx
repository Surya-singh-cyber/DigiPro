"use client"

import { useState, useEffect } from "react"
import { useEnhancedAuth } from "../../contexts/EnhancedAuthContext"
import { enhancedSupabaseService } from "../../services/enhancedSupabaseService"
import { exportService } from "../../services/exportService"
import { realtimeService } from "../../services/realtimeService"
import type { DashboardStats, BusinessMetrics } from "../../types"
import {
  TrendingUp,
  Users,
  Package,
  AlertCircle,
  DollarSign,
  Calendar,
  FileText,
  Truck,
  ShoppingBag,
  Pill,
  GraduationCap,
  Shirt,
  Car,
  Building2,
  Store,
  ArrowUpRight,
  Clock,
  Loader2,
  Download,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export const MultiBusinessDashboard = () => {
  const { user, organization } = useEnhancedAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (organization?.id) {
      fetchDashboardData()
      setupRealtimeUpdates()
    }
  }, [organization?.id])

  const fetchDashboardData = async () => {
    if (!organization?.id) return

    try {
      setLoading(true)
      const [dashboardStats, businessMetrics] = await Promise.all([
        enhancedSupabaseService.getDashboardStats(organization.id),
        enhancedSupabaseService.getBusinessMetrics(organization.id),
      ])

      setStats(dashboardStats)
      setMetrics(businessMetrics)
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const setupRealtimeUpdates = () => {
    if (!organization?.id) return

    // Subscribe to real-time updates for dashboard data
    const unsubscribeInvoices = realtimeService.subscribeToTable("invoices", organization.id, () => {
      console.log("🔄 Invoice data updated, refreshing dashboard")
      refreshDashboard()
    })

    const unsubscribeCustomers = realtimeService.subscribeToTable("customers", organization.id, () => {
      console.log("🔄 Customer data updated, refreshing dashboard")
      refreshDashboard()
    })

    const unsubscribeInventory = realtimeService.subscribeToTable("inventory_items", organization.id, () => {
      console.log("🔄 Inventory data updated, refreshing dashboard")
      refreshDashboard()
    })

    return () => {
      unsubscribeInvoices()
      unsubscribeCustomers()
      unsubscribeInventory()
    }
  }

  const refreshDashboard = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    setRefreshing(false)
  }

  const handleExportReport = async () => {
    if (!stats || !organization) return

    setExporting(true)
    try {
      await exportService.exportDashboardReport(stats, organization.name)
    } catch (error) {
      console.error("❌ Export failed:", error)
    } finally {
      setExporting(false)
    }
  }

  const getBusinessIcon = () => {
    switch (organization?.business_type) {
      case "pharmacy":
        return <Pill className="h-5 w-5" />
      case "school":
        return <GraduationCap className="h-5 w-5" />
      case "textile":
        return <Shirt className="h-5 w-5" />
      case "automobile":
        return <Car className="h-5 w-5" />
      case "medical":
        return <Building2 className="h-5 w-5" />
      case "retail":
      default:
        return <Store className="h-5 w-5" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getBusinessSpecificCards = () => {
    switch (organization?.business_type) {
      case "school":
        return (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total_students || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.new_customers_this_month} new admissions this month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats?.pending_fees || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(stats?.collected_fees_this_month || 0)} collected this month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Staff Salaries</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total_employees || 0} employees</div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(stats?.salary_paid_this_month || 0)} paid this month
                </p>
              </CardContent>
            </Card>
          </>
        )
      case "automobile":
        return (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total_vehicles || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.new_customers_this_month} new customers this month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Services Due</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.services_due || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.insurance_expiring || 0} insurance policies expiring soon
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Spare Parts</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats?.inventory_value || 0)}</div>
                <p className="text-xs text-muted-foreground">{stats?.low_stock_items || 0} items low in stock</p>
              </CardContent>
            </Card>
          </>
        )
      case "pharmacy":
        return (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Medicine Inventory</CardTitle>
                <Pill className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats?.inventory_value || 0)}</div>
                <p className="text-xs text-muted-foreground">{stats?.out_of_stock_items || 0} medicines out of stock</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.low_stock_items || 0} items</div>
                <p className="text-xs text-muted-foreground">Medicines expiring in next 30 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total_customers || 0}</div>
                <p className="text-xs text-muted-foreground">{stats?.new_customers_this_month || 0} new this month</p>
              </CardContent>
            </Card>
          </>
        )
      case "textile":
        return (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fabric Inventory</CardTitle>
                <Shirt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats?.inventory_value || 0)}</div>
                <p className="text-xs text-muted-foreground">{stats?.low_stock_items || 0} items low in stock</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pending_invoices || 0} pending</div>
                <p className="text-xs text-muted-foreground">{stats?.paid_invoices || 0} completed this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12 active</div>
                <p className="text-xs text-muted-foreground">3 orders pending delivery</p>
              </CardContent>
            </Card>
          </>
        )
      case "medical":
      case "retail":
      default:
        return (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats?.inventory_value || 0)}</div>
                <p className="text-xs text-muted-foreground">{stats?.low_stock_items || 0} items low in stock</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total_customers || 0}</div>
                <p className="text-xs text-muted-foreground">{stats?.new_customers_this_month || 0} new this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pending_invoices || 0}</div>
                <p className="text-xs text-muted-foreground">{stats?.overdue_invoices || 0} overdue</p>
              </CardContent>
            </Card>
          </>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-3">
          {getBusinessIcon()}
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Business Dashboard</h2>
            <p className="text-gray-600">{organization?.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={refreshDashboard} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExportReport} disabled={exporting}>
            <Download className="mr-2 h-4 w-4" />
            {exporting ? "Exporting..." : "Export Report"}
          </Button>
          <Button>
            <Calendar className="mr-2 h-4 w-4" /> Current Month
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats?.total_revenue || 0)}</div>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(stats?.monthly_revenue || 0)} this month
                  </p>
                  <span className="flex items-center text-xs text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    12%
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profit</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats?.total_profit || 0)}</div>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(stats?.monthly_profit || 0)} this month
                  </p>
                  <span className="flex items-center text-xs text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    8%
                  </span>
                </div>
              </CardContent>
            </Card>

            {getBusinessSpecificCards()}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Revenue",
                      color: "hsl(var(--chart-1))",
                    },
                    profit: {
                      label: "Profit",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="aspect-[4/3]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics?.revenue_trend || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--color-revenue)"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                      <Line type="monotone" dataKey="profit" stroke="var(--color-profit)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
                <CardDescription>Top 5 products by revenue this month</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Revenue",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="aspect-[4/3]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={metrics?.top_selling_items || []}
                      layout="vertical"
                      margin={{ top: 0, right: 0, bottom: 0, left: 80 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="item" type="category" width={80} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="revenue" fill="var(--color-revenue)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest business activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New invoice created</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Payment received</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Low stock alert</p>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common business tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="h-20 flex flex-col">
                    <FileText className="h-4 w-4 mb-2" />
                    New Invoice
                  </Button>
                  <Button variant="outline" size="sm" className="h-20 flex flex-col">
                    <Users className="h-4 w-4 mb-2" />
                    Add Customer
                  </Button>
                  <Button variant="outline" size="sm" className="h-20 flex flex-col">
                    <Package className="h-4 w-4 mb-2" />
                    Add Item
                  </Button>
                  <Button variant="outline" size="sm" className="h-20 flex flex-col">
                    <DollarSign className="h-4 w-4 mb-2" />
                    Record Payment
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alerts & Notifications</CardTitle>
                <CardDescription>Important business alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.low_stock_items && stats.low_stock_items > 0 && (
                    <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium text-orange-800">
                          {stats.low_stock_items} items low in stock
                        </p>
                        <p className="text-xs text-orange-600">Reorder soon</p>
                      </div>
                    </div>
                  )}
                  {stats?.overdue_invoices && stats.overdue_invoices > 0 && (
                    <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg">
                      <Clock className="h-4 w-4 text-red-600" />
                      <div>
                        <p className="text-sm font-medium text-red-800">{stats.overdue_invoices} overdue invoices</p>
                        <p className="text-xs text-red-600">Follow up required</p>
                      </div>
                    </div>
                  )}
                  {(!stats?.low_stock_items || stats.low_stock_items === 0) &&
                    (!stats?.overdue_invoices || stats.overdue_invoices === 0) && (
                      <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <p className="text-sm text-green-800">All systems running smoothly</p>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
                <CardDescription>New customers over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    new_customers: {
                      label: "New Customers",
                      color: "hsl(var(--chart-4))",
                    },
                  }}
                  className="aspect-[4/3]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics?.customer_growth || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="new_customers"
                        stroke="var(--color-new_customers)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
                <CardDescription>Invoice payment breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    amount: {
                      label: "Amount",
                      color: "hsl(var(--chart-5))",
                    },
                  }}
                  className="aspect-[4/3]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics?.payment_status || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="amount" fill="var(--color-amount)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Sales Report</CardTitle>
                <CardDescription>Monthly sales summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Sales:</span>
                    <span className="font-medium">{formatCurrency(stats?.monthly_revenue || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Profit:</span>
                    <span className="font-medium">{formatCurrency(stats?.monthly_profit || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Profit Margin:</span>
                    <span className="font-medium">
                      {stats?.monthly_revenue
                        ? ((stats.monthly_profit / stats.monthly_revenue) * 100).toFixed(1) + "%"
                        : "0%"}
                    </span>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Download Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>GST Summary</CardTitle>
                <CardDescription>Tax calculations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Output Tax:</span>
                    <span className="font-medium">{formatCurrency(metrics?.gst_summary?.output_tax || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Input Tax:</span>
                    <span className="font-medium">{formatCurrency(metrics?.gst_summary?.input_tax || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tax Payable:</span>
                    <span className="font-medium">{formatCurrency(metrics?.gst_summary?.tax_payable || 0)}</span>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  File GST Return
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Report</CardTitle>
                <CardDescription>Stock analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Value:</span>
                    <span className="font-medium">{formatCurrency(stats?.inventory_value || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Low Stock:</span>
                    <span className="font-medium">{stats?.low_stock_items || 0} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Out of Stock:</span>
                    <span className="font-medium">{stats?.out_of_stock_items || 0} items</span>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Stock Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Notifications</CardTitle>
              <CardDescription>Important updates and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-medium">Welcome to DigiPro!</h4>
                  <p className="text-sm text-muted-foreground">
                    Your business management system is ready to use. Start by adding your first customer or inventory
                    item.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Just now</p>
                </div>

                {stats?.low_stock_items && stats.low_stock_items > 0 && (
                  <div className="border-l-4 border-orange-500 pl-4 py-2">
                    <h4 className="font-medium">Low Stock Alert</h4>
                    <p className="text-sm text-muted-foreground">
                      {stats.low_stock_items} items are running low on stock. Consider reordering soon.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                )}

                {stats?.overdue_invoices && stats.overdue_invoices > 0 && (
                  <div className="border-l-4 border-red-500 pl-4 py-2">
                    <h4 className="font-medium">Overdue Invoices</h4>
                    <p className="text-sm text-muted-foreground">
                      {stats.overdue_invoices} invoices are overdue. Follow up with customers for payment.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                  </div>
                )}

                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="font-medium">System Update</h4>
                  <p className="text-sm text-muted-foreground">
                    New features have been added to improve your business workflow. Check out the updated invoice
                    templates.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
