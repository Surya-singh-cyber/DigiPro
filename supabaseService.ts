import { supabase } from "../config/supabase"
import type { User, InventoryItem, Customer, Vehicle } from "../types"

export class SupabaseService {
  // User operations
  async createUser(userData: Partial<User>) {
    const { data, error } = await supabase.from("users").insert([userData]).select().single()

    if (error) throw error
    return data
  }

  async getUserByFirebaseId(firebaseId: string) {
    const { data, error } = await supabase.from("users").select("*").eq("firebase_id", firebaseId).single()

    if (error && error.code !== "PGRST116") throw error
    return data
  }

  async updateUser(id: string, userData: Partial<User>) {
    const { data, error } = await supabase.from("users").update(userData).eq("id", id).select().single()

    if (error) throw error
    return data
  }

  // Customer operations
  async getCustomers(userId: string) {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  async createCustomer(customerData: Partial<Customer>) {
    const { data, error } = await supabase.from("customers").insert([customerData]).select().single()

    if (error) throw error
    return data
  }

  async updateCustomer(id: string, customerData: Partial<Customer>) {
    const { data, error } = await supabase.from("customers").update(customerData).eq("id", id).select().single()

    if (error) throw error
    return data
  }

  async deleteCustomer(id: string) {
    const { error } = await supabase.from("customers").delete().eq("id", id)

    if (error) throw error
  }

  // Vehicle operations (for automobile business)
  async getVehicles(userId: string) {
    const { data, error } = await supabase
      .from("vehicles")
      .select(`
        *,
        customer:customers(*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  async createVehicle(vehicleData: Partial<Vehicle>) {
    const { data, error } = await supabase
      .from("vehicles")
      .insert([vehicleData])
      .select(`
        *,
        customer:customers(*)
      `)
      .single()

    if (error) throw error
    return data
  }

  async updateVehicle(id: string, vehicleData: Partial<Vehicle>) {
    const { data, error } = await supabase
      .from("vehicles")
      .update(vehicleData)
      .eq("id", id)
      .select(`
        *,
        customer:customers(*)
      `)
      .single()

    if (error) throw error
    return data
  }

  async deleteVehicle(id: string) {
    const { error } = await supabase.from("vehicles").delete().eq("id", id)

    if (error) throw error
  }

  // Inventory operations
  async getInventoryItems(userId: string) {
    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  async createInventoryItem(itemData: Partial<InventoryItem>) {
    const { data, error } = await supabase.from("inventory_items").insert([itemData]).select().single()

    if (error) throw error
    return data
  }

  async updateInventoryItem(id: string, itemData: Partial<InventoryItem>) {
    const { data, error } = await supabase.from("inventory_items").update(itemData).eq("id", id).select().single()

    if (error) throw error
    return data
  }

  async deleteInventoryItem(id: string) {
    const { error } = await supabase.from("inventory_items").delete().eq("id", id)

    if (error) throw error
  }

  // Invoice operations
  async getInvoices(userId: string) {
    const { data, error } = await supabase
      .from("invoices")
      .select(`
        *,
        customer:customers(*),
        invoice_items(*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  async createInvoice(invoiceData: any) {
    const { data, error } = await supabase
      .from("invoices")
      .insert([invoiceData])
      .select(`
        *,
        customer:customers(*),
        invoice_items(*)
      `)
      .single()

    if (error) throw error
    return data
  }

  async updateInvoice(id: string, invoiceData: any) {
    const { data, error } = await supabase
      .from("invoices")
      .update(invoiceData)
      .eq("id", id)
      .select(`
        *,
        customer:customers(*),
        invoice_items(*)
      `)
      .single()

    if (error) throw error
    return data
  }

  async deleteInvoice(id: string) {
    const { error } = await supabase.from("invoices").delete().eq("id", id)

    if (error) throw error
  }
}

export const supabaseService = new SupabaseService()
