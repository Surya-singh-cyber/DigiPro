"use client"

import { useState, useEffect } from "react"
import { useEnhancedAuth } from "../../contexts/EnhancedAuthContext"
import {
  Users,
  Building2,
  TrendingUp,
  AlertCircle,
  Settings,
  Database,
  Shield,
  Activity,
  DollarSign,
  FileText,
  BarChart3,
  UserCheck,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Download,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AdminStats {
  totalOrganizations: number
  activeOrganizations: number
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  monthlyRevenue: number
  pendingApprovals: number
  systemAlerts: number
}

interface OrganizationData {
  id: string
  name: string
  business_type: string
  subscription_plan: string
  user_count: number
  revenue: number
  status: "active" | "inactive" | "suspended"
  created_at: string
  last_activity: string
}

export const AdminDashboard = () => {
  const { user, isAdmin, adminRole } = useEnhancedAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [organizations, setOrganizations] = useState<OrganizationData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData()
    }
  }, [isAdmin])

  const fetchAdminData = async () => {
    try {
      setLoading(true)

      // Generate mock admin data for demo
      const mockStats: AdminStats = {
        totalOrganizations: 1247,
        activeOrganizations: 1156,
        totalUsers: 8934,
        activeUsers: 7821,
        totalRevenue: 12450000,
        monthlyRevenue: 1850000,
        pendingApprovals: 23,
        systemAlerts: 7,
      }

      const mockOrganizations: OrganizationData[] = [
        {
          id: "org_001",
          name: "AutoCare Solutions",
          business_type: "automobile",
          subscription_plan: "professional",
          user_count: 12,
          revenue: 125000,
          status: "active",
          created_at: "2024-01-15",
          last_activity: "2024-06-18",
        },
        {
          id: "org_002",
          name: "MediPlus Pharmacy",
          business_type: "pharmacy",
          subscription_plan: "enterprise",
          user_count: 8,
          revenue: 89000,
          status: "active",
          created_at: "2024-02-20",
          last_activity: "2024-06-17",
        },
        {
          id: "org_003",
          name: "Bright Future School",
          business_type: "school",
          subscription_plan: "professional",
          user_count: 25,
          revenue: 156000,
          status: "active",
          created_at: "2024-01-08",
          last_activity: "2024-06-18",
        },
        {
          id: "org_004",
          name: "Fashion Hub",
          business_type: "textile",
          subscription_plan: "basic",
          user_count: 5,
          revenue: 45000,
          status: "inactive",
          created_at: "2024-03-12",
          last_activity: "2024-05-20",
        },
        {
          id: "org_005",
          name: "City Medical Center",
          business_type: "medical",
          subscription_plan: "enterprise",
          user_count: 18,
          revenue: 234000,
          status: "active",
          created_at: "2024-01-25",
          last_activity: "2024-06-18",
        },
      ]

      setStats(mockStats)
      setOrganizations(mockOrganizations)
    } catch (error) {
      console.error("Error fetching admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getBusinessTypeIcon = (type: string) => {
    switch (type) {
      case "automobile":
        return "🚗"
      case "pharmacy":
        return "💊"
      case "school":
        return "🎓"
      case "textile":
        return "🧵"
      case "medical":
        return "🏥"
      case "retail":
        return "🏪"
      default:
        return "🏢"
    }
  }

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.business_type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || org.status === filterStatus
    return matchesSearch && matchesFilter
  })

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You don't have admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.name} • {adminRole?.replace("_", " ").toUpperCase()} Access
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm" onClick={fetchAdminData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrganizations}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats?.activeOrganizations}</span> active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{stats?.activeUsers}</span> active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</div>
            <p className="text-xs text-muted-foreground">{formatCurrency(stats?.monthlyRevenue || 0)} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.systemAlerts}</div>
            <p className="text-xs text-muted-foreground">{stats?.pendingApprovals} pending approvals</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system activities and events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <UserCheck className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New organization registered</p>
                    <p className="text-xs text-gray-500">AutoCare Solutions - 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Revenue milestone reached</p>
                    <p className="text-xs text-gray-500">₹1.2Cr total revenue - 5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">System maintenance scheduled</p>
                    <p className="text-xs text-gray-500">Tomorrow 2:00 AM - 4:00 AM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Organization
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate System Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  System Configuration
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Database Backup
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="organizations" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search organizations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Organization
            </Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Business Type</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrganizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getBusinessTypeIcon(org.business_type)}</span>
                        <div>
                          <div className="font-medium">{org.name}</div>
                          <div className="text-sm text-gray-500">ID: {org.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{org.business_type}</TableCell>
                    <TableCell className="capitalize">{org.subscription_plan}</TableCell>
                    <TableCell>{org.user_count}</TableCell>
                    <TableCell>{formatCurrency(org.revenue)}</TableCell>
                    <TableCell>{getStatusBadge(org.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
            <p className="text-gray-600">User management interface will be implemented here</p>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Analytics</h3>
            <p className="text-gray-600">Detailed analytics and reporting tools coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">System Monitoring</h3>
            <p className="text-gray-600">System health and monitoring tools will be available here</p>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">System Settings</h3>
            <p className="text-gray-600">Global system configuration options coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
