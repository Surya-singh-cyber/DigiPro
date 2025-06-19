import { supabase } from "../config/supabase"
import type { Organization, User, Customer, InventoryItem, Invoice, DashboardStats, PaginatedResponse } from "../types"

export class EnhancedSupabaseService {
  private isDemoMode(): boolean {
    // Check if we're in demo mode (no real Supabase connection)
    return (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") ||
      (typeof window !== "undefined" && window.location.hostname === "localhost")
    )
  }

  private getMockDashboardStats(organizationId: string): DashboardStats {
    return {
      total_revenue: 450000,
      total_profit: 112500,
      total_expenses: 337500,
      monthly_revenue: 67000,
      monthly_profit: 20000,
      inventory_value: 850000,
      low_stock_items: 3,
      out_of_stock_items: 1,
      total_customers: 45,
      new_customers_this_month: 8,
      pending_invoices: 12,
      overdue_invoices: 3,
      paid_invoices: 28,
      total_students: 0,
      pending_fees: 0,
      collected_fees_this_month: 0,
      total_employees: 0,
      salary_paid_this_month: 0,
      pending_salaries: 0,
      total_vehicles: 156,
      services_due: 8,
      insurance_expiring: 5,
    }
  }

  private getMockInvoices(organizationId: string): Invoice[] {
    return [
      {
        id: "1",
        organization_id: organizationId,
        customer_id: "cust1",
        invoice_number: "INV-2024-001",
        invoice_type: "sale",
        invoice_date: "2024-01-15",
        due_date: "2024-02-15",
        subtotal: 125000,
        discount_amount: 5000,
        discount_percentage: 4,
        tax_amount: 21600,
        shipping_charges: 0,
        other_charges: 2500,
        round_off: 0,
        total_amount: 144100,
        paid_amount: 144100,
        balance_amount: 0,
        status: "paid",
        payment_terms: "30 days",
        payment_method: "Bank Transfer",
        payment_status: "paid",
        created_at: "2024-01-15",
        customer: {
          id: "cust1",
          organization_id: organizationId,
          name: "Rajesh Kumar",
          phone: "+91-9876543210",
          email: "rajesh@example.com",
          address: "123 Main Street, Delhi",
          customer_type: "individual",
          credit_limit: 0,
          outstanding_balance: 0,
          is_active: true,
        },
      },
      {
        id: "2",
        organization_id: organizationId,
        customer_id: "cust2",
        invoice_number: "INV-2024-002",
        invoice_type: "sale",
        invoice_date: "2024-01-18",
        due_date: "2024-02-18",
        subtotal: 85000,
        discount_amount: 0,
        discount_percentage: 0,
        tax_amount: 15300,
        shipping_charges: 0,
        other_charges: 1500,
        round_off: 0,
        total_amount: 101800,
        paid_amount: 0,
        balance_amount: 101800,
        status: "sent",
        payment_terms: "30 days",
        payment_status: "pending",
        created_at: "2024-01-18",
        customer: {
          id: "cust2",
          organization_id: organizationId,
          name: "Priya Sharma",
          phone: "+91-9876543211",
          email: "priya@example.com",
          address: "456 Park Avenue, Mumbai",
          customer_type: "individual",
          credit_limit: 0,
          outstanding_balance: 101800,
          is_active: true,
        },
      },
    ]
  }
  // Organization operations
  async createOrganization(orgData: Partial<Organization>): Promise<Organization> {
    console.log("📝 Creating organization in Supabase:", orgData.name)
    const { data, error } = await supabase.from("organizations").insert([orgData]).select().single()

    if (error) {
      console.error("❌ Error creating organization:", error)
      throw error
    }
    console.log("✅ Organization created:", data.id)
    return data
  }

  async getOrganization(id: string): Promise<Organization> {
    console.log("🔍 Fetching organization:", id)
    const { data, error } = await supabase.from("organizations").select("*").eq("id", id).single()

    if (error) {
      console.error("❌ Error fetching organization:", error)
      throw error
    }
    console.log("✅ Organization fetched:", data.name)
    return data
  }

  async updateOrganization(id: string, orgData: Partial<Organization>): Promise<Organization> {
    console.log("📝 Updating organization:", id)
    const { data, error } = await supabase.from("organizations").update(orgData).eq("id", id).select().single()

    if (error) {
      console.error("❌ Error updating organization:", error)
      throw error
    }
    console.log("✅ Organization updated:", data.name)
    return data
  }

  // User operations with organization context
  async createUser(userData: Partial<User>): Promise<User> {
    console.log("👤 Creating user in Supabase:", userData.email)
    const { data, error } = await supabase
      .from("users")
      .insert([userData])
      .select(`
        *,
        organization:organizations(*)
      `)
      .single()

    if (error) {
      console.error("❌ Error creating user:", error)
      throw error
    }
    console.log("✅ User created:", data.id)
    return data
  }

  async getUserByFirebaseId(firebaseId: string): Promise<User | null> {
    console.log("🔍 Fetching user by Firebase ID:", firebaseId)
    const { data, error } = await supabase
      .from("users")
      .select(`
        *,
        organization:organizations(*)
      `)
      .eq("firebase_id", firebaseId)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("❌ Error fetching user:", error)
      throw error
    }

    if (data) {
      console.log("✅ User found:", data.email)
    } else {
      console.log("ℹ️ User not found in Supabase")
    }
    return data
  }

  // Add method to check if phone number exists
  async getUserByPhone(phone: string): Promise<User | null> {
    console.log("🔍 Checking if phone exists:", phone)
    const { data, error } = await supabase
      .from("users")
      .select(`
        *,
        organization:organizations(*)
      `)
      .eq("phone", phone)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("❌ Error checking phone:", error)
      throw error
    }

    if (data) {
      console.log("⚠️ Phone number already exists")
    } else {
      console.log("✅ Phone number available")
    }
    return data
  }

  async getOrganizationUsers(organizationId: string): Promise<User[]> {
    console.log("👥 Fetching organization users:", organizationId)
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Error fetching users:", error)
      throw error
    }
    console.log("✅ Users fetched:", data?.length || 0)
    return data || []
  }

  // Customer operations
  async getCustomers(
    organizationId: string,
    page = 1,
    limit = 50,
    search?: string,
  ): Promise<PaginatedResponse<Customer>> {
    console.log("👥 Fetching customers for organization:", organizationId)
    let query = supabase
      .from("customers")
      .select("*", { count: "exact" })
      .eq("organization_id", organizationId)
      .eq("is_active", true)

    if (search) {
      query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Error fetching customers:", error)
      throw error
    }

    console.log("✅ Customers fetched:", data?.length || 0)
    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      total_pages: Math.ceil((count || 0) / limit),
    }
  }

  async createCustomer(customerData: Partial<Customer>): Promise<Customer> {
    console.log("👤 Creating customer:", customerData.name)

    // Generate customer code if not provided
    if (!customerData.customer_code) {
      const { count } = await supabase
        .from("customers")
        .select("*", { count: "exact" })
        .eq("organization_id", customerData.organization_id!)

      customerData.customer_code = `CUST${String((count || 0) + 1).padStart(4, "0")}`
    }

    const { data, error } = await supabase.from("customers").insert([customerData]).select().single()

    if (error) {
      console.error("❌ Error creating customer:", error)
      throw error
    }
    console.log("✅ Customer created:", data.id)
    return data
  }

  async updateCustomer(id: string, customerData: Partial<Customer>): Promise<Customer> {
    console.log("📝 Updating customer:", id)
    const { data, error } = await supabase.from("customers").update(customerData).eq("id", id).select().single()

    if (error) {
      console.error("❌ Error updating customer:", error)
      throw error
    }
    console.log("✅ Customer updated:", data.name)
    return data
  }

  async deleteCustomer(id: string): Promise<void> {
    console.log("🗑️ Deleting customer:", id)
    const { error } = await supabase.from("customers").update({ is_active: false }).eq("id", id)

    if (error) {
      console.error("❌ Error deleting customer:", error)
      throw error
    }
    console.log("✅ Customer deleted")
  }

  // Inventory operations
  async getInventoryItems(
    organizationId: string,
    page = 1,
    limit = 50,
    search?: string,
    category?: string,
  ): Promise<PaginatedResponse<InventoryItem>> {
    console.log("📦 Fetching inventory items for organization:", organizationId)
    let query = supabase
      .from("inventory_items")
      .select("*", { count: "exact" })
      .eq("organization_id", organizationId)
      .eq("is_active", true)

    if (search) {
      query = query.or(`name.ilike.%${search}%,item_code.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (category) {
      query = query.eq("category", category)
    }

    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Error fetching inventory:", error)
      throw error
    }

    console.log("✅ Inventory items fetched:", data?.length || 0)
    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      total_pages: Math.ceil((count || 0) / limit),
    }
  }

  async createInventoryItem(itemData: Partial<InventoryItem>): Promise<InventoryItem> {
    console.log("📦 Creating inventory item:", itemData.name)

    // Generate item code if not provided
    if (!itemData.item_code) {
      const { count } = await supabase
        .from("inventory_items")
        .select("*", { count: "exact" })
        .eq("organization_id", itemData.organization_id!)

      itemData.item_code = `ITEM${String((count || 0) + 1).padStart(4, "0")}`
    }

    const { data, error } = await supabase.from("inventory_items").insert([itemData]).select().single()

    if (error) {
      console.error("❌ Error creating inventory item:", error)
      throw error
    }
    console.log("✅ Inventory item created:", data.id)
    return data
  }

  async updateInventoryItem(id: string, itemData: Partial<InventoryItem>): Promise<InventoryItem> {
    console.log("📝 Updating inventory item:", id)
    const { data, error } = await supabase.from("inventory_items").update(itemData).eq("id", id).select().single()

    if (error) {
      console.error("❌ Error updating inventory item:", error)
      throw error
    }
    console.log("✅ Inventory item updated:", data.name)
    return data
  }

  async deleteInventoryItem(id: string): Promise<void> {
    console.log("🗑️ Deleting inventory item:", id)
    const { error } = await supabase.from("inventory_items").update({ is_active: false }).eq("id", id)

    if (error) {
      console.error("❌ Error deleting inventory item:", error)
      throw error
    }
    console.log("✅ Inventory item deleted")
  }

  // Invoice operations
  async getInvoices(
    organizationId: string,
    page = 1,
    limit = 50,
    status?: string,
    search?: string,
  ): Promise<PaginatedResponse<Invoice>> {
    console.log("📄 Fetching invoices for organization:", organizationId)

    // Return mock data in demo mode
    if (this.isDemoMode()) {
      console.log("🎭 Demo mode: Returning mock invoices")
      await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate API delay

      const mockInvoices = this.getMockInvoices(organizationId)
      let filteredInvoices = mockInvoices

      if (status && status !== "all") {
        filteredInvoices = mockInvoices.filter((inv) => inv.status === status)
      }

      if (search) {
        filteredInvoices = filteredInvoices.filter((inv) =>
          inv.invoice_number.toLowerCase().includes(search.toLowerCase()),
        )
      }

      return {
        data: filteredInvoices.slice((page - 1) * limit, page * limit),
        total: filteredInvoices.length,
        page,
        limit,
        total_pages: Math.ceil(filteredInvoices.length / limit),
      }
    }

    let query = supabase
      .from("invoices")
      .select(
        `
        *,
        customer:customers(*),
        vehicle:vehicles(*),
        invoice_items(*),
        payments(*)
      `,
        { count: "exact" },
      )
      .eq("organization_id", organizationId)

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (search) {
      query = query.or(`invoice_number.ilike.%${search}%`)
    }

    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Error fetching invoices:", error)
      throw error
    }

    console.log("✅ Invoices fetched:", data?.length || 0)
    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      total_pages: Math.ceil((count || 0) / limit),
    }
  }

  async createInvoice(invoiceData: any): Promise<Invoice> {
    console.log("📄 Creating invoice for customer:", invoiceData.customer_id)

    // Generate invoice number if not provided
    if (!invoiceData.invoice_number) {
      const { count } = await supabase
        .from("invoices")
        .select("*", { count: "exact" })
        .eq("organization_id", invoiceData.organization_id)

      invoiceData.invoice_number = `INV${String((count || 0) + 1).padStart(6, "0")}`
    }

    const { data, error } = await supabase
      .from("invoices")
      .insert([invoiceData])
      .select(`
        *,
        customer:customers(*),
        vehicle:vehicles(*),
        invoice_items(*),
        payments(*)
      `)
      .single()

    if (error) {
      console.error("❌ Error creating invoice:", error)
      throw error
    }
    console.log("✅ Invoice created:", data.invoice_number)
    return data
  }

  async updateInvoice(id: string, invoiceData: any): Promise<Invoice> {
    console.log("📝 Updating invoice:", id)
    const { data, error } = await supabase
      .from("invoices")
      .update(invoiceData)
      .eq("id", id)
      .select(`
        *,
        customer:customers(*),
        vehicle:vehicles(*),
        invoice_items(*),
        payments(*)
      `)
      .single()

    if (error) {
      console.error("❌ Error updating invoice:", error)
      throw error
    }
    console.log("✅ Invoice updated:", data.invoice_number)
    return data
  }

  // Dashboard stats
  async getDashboardStats(organizationId: string): Promise<DashboardStats> {
    console.log("📊 Fetching dashboard stats for organization:", organizationId)

    // Return mock data in demo mode
    if (this.isDemoMode()) {
      console.log("🎭 Demo mode: Returning mock dashboard stats")
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay
      return this.getMockDashboardStats(organizationId)
    }

    // Get current month start and end
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Parallel queries for better performance
    const [invoicesResult, customersResult, inventoryResult, vehiclesResult] = await Promise.all([
      // Invoice stats
      supabase
        .from("invoices")
        .select("total_amount, status, created_at")
        .eq("organization_id", organizationId)
        .neq("status", "cancelled"),

      // Customer stats
      supabase
        .from("customers")
        .select("id, created_at")
        .eq("organization_id", organizationId)
        .eq("is_active", true),

      // Inventory stats
      supabase
        .from("inventory_items")
        .select("current_stock, min_stock_level, selling_price")
        .eq("organization_id", organizationId)
        .eq("is_active", true),

      // Vehicle stats
      supabase
        .from("vehicles")
        .select("next_service_due, insurance_expiry")
        .eq("organization_id", organizationId)
        .eq("status", "active"),
    ])

    const invoices = invoicesResult.data || []
    const customers = customersResult.data || []
    const inventory = inventoryResult.data || []
    const vehicles = vehiclesResult.data || []

    // Calculate metrics
    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0)
    const monthlyRevenue = invoices
      .filter((inv) => new Date(inv.created_at) >= monthStart && new Date(inv.created_at) <= monthEnd)
      .reduce((sum, inv) => sum + (inv.total_amount || 0), 0)

    const inventoryValue = inventory.reduce((sum, item) => sum + (item.current_stock * item.selling_price || 0), 0)
    const lowStockItems = inventory.filter((item) => item.current_stock <= item.min_stock_level).length
    const outOfStockItems = inventory.filter((item) => item.current_stock === 0).length

    const newCustomersThisMonth = customers.filter(
      (customer) => new Date(customer.created_at) >= monthStart && new Date(customer.created_at) <= monthEnd,
    ).length

    const pendingInvoices = invoices.filter((inv) => inv.status === "sent" || inv.status === "partial").length
    const overdueInvoices = invoices.filter((inv) => inv.status === "overdue").length
    const paidInvoices = invoices.filter((inv) => inv.status === "paid").length

    const totalVehicles = vehicles.length
    const servicesDue = vehicles.filter((vehicle) => {
      if (!vehicle.next_service_due) return false
      const dueDate = new Date(vehicle.next_service_due)
      const today = new Date()
      return dueDate <= new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000) // Due within 30 days
    }).length

    const insuranceExpiring = vehicles.filter((vehicle) => {
      if (!vehicle.insurance_expiry) return false
      const expiryDate = new Date(vehicle.insurance_expiry)
      const today = new Date()
      return expiryDate <= new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000) // Expiring within 30 days
    }).length

    const stats = {
      total_revenue: totalRevenue,
      total_profit: totalRevenue * 0.25, // Estimated 25% profit margin
      total_expenses: totalRevenue * 0.75, // Estimated 75% expenses
      monthly_revenue: monthlyRevenue,
      monthly_profit: monthlyRevenue * 0.25,
      inventory_value: inventoryValue,
      low_stock_items: lowStockItems,
      out_of_stock_items: outOfStockItems,
      total_customers: customers.length,
      new_customers_this_month: newCustomersThisMonth,
      pending_invoices: pendingInvoices,
      overdue_invoices: overdueInvoices,
      paid_invoices: paidInvoices,
      total_students: 0,
      pending_fees: 0,
      collected_fees_this_month: 0,
      total_employees: 0,
      salary_paid_this_month: 0,
      pending_salaries: 0,
      total_vehicles: totalVehicles,
      services_due: servicesDue,
      insurance_expiring: insuranceExpiring,
    }

    console.log("✅ Dashboard stats calculated:", stats)
    return stats
  }

  // Bulk operations for invoice items
  async bulkCreateInvoiceItems(items: any[]): Promise<void> {
    console.log("📄 Creating invoice items:", items.length)
    const { error } = await supabase.from("invoice_items").insert(items)
    if (error) {
      console.error("❌ Error creating invoice items:", error)
      throw error
    }
    console.log("✅ Invoice items created")
  }

  // Utility methods
  async generateInvoiceNumber(organizationId: string, prefix = "INV"): Promise<string> {
    const { count } = await supabase
      .from("invoices")
      .select("*", { count: "exact" })
      .eq("organization_id", organizationId)

    return `${prefix}${String((count || 0) + 1).padStart(6, "0")}`
  }
}

export const enhancedSupabaseService = new EnhancedSupabaseService()
