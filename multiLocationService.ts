import { enhancedSupabaseService } from "./enhancedSupabaseService"
import type {
  Location,
  LocationInventory,
  StockTransfer,
  LocationAnalytics,
  MultiLocationStats,
  LocationComparison,
  PaginatedResponse,
} from "../types"

export const multiLocationService = {
  // Location Management
  async getLocations(organizationId: string): Promise<Location[]> {
    try {
      const { data, error } = await enhancedSupabaseService.supabase
        .from("locations")
        .select(`
        *,
        manager:users(id, name, email, phone)
      `)
        .eq("organization_id", organizationId)
        .eq("is_active", true)
        .order("is_headquarters", { ascending: false })
        .order("name")

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching locations:", error)
      throw error
    }
  },

  async createLocation(locationData: Partial<Location>): Promise<Location> {
    // Generate location code if not provided
    if (!locationData.code) {
      const { count } = await enhancedSupabaseService.supabase
        .from("locations")
        .select("*", { count: "exact" })
        .eq("organization_id", locationData.organization_id!)

      locationData.code = `LOC${String((count || 0) + 1).padStart(3, "0")}`
    }

    try {
      const { data, error } = await enhancedSupabaseService.supabase
        .from("locations")
        .insert([locationData])
        .select(`
        *,
        manager:users(id, name, email, phone)
      `)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating location:", error)
      throw error
    }
  },

  async updateLocation(id: string, locationData: Partial<Location>): Promise<Location> {
    try {
      const { data, error } = await enhancedSupabaseService.supabase
        .from("locations")
        .update({ ...locationData, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select(`
        *,
        manager:users(id, name, email, phone)
      `)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error updating location:", error)
      throw error
    }
  },

  async deleteLocation(id: string): Promise<void> {
    try {
      const { error } = await enhancedSupabaseService.supabase
        .from("locations")
        .update({ is_active: false })
        .eq("id", id)

      if (error) throw error
    } catch (error) {
      console.error("Error deleting location:", error)
      throw error
    }
  },

  // Location inventory management
  async getLocationInventory(
    organizationId: string,
    locationId?: string,
    page = 1,
    limit = 50,
  ): Promise<PaginatedResponse<LocationInventory>> {
    let query = enhancedSupabaseService.supabase
      .from("location_inventory")
      .select(
        `
        *,
        location:locations(id, name, code),
        inventory_item:inventory_items(*)
      `,
        { count: "exact" },
      )
      .eq("organization_id", organizationId)

    if (locationId) {
      query = query.eq("location_id", locationId)
    }

    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order("last_updated", { ascending: false })

    if (error) throw error

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      total_pages: Math.ceil((count || 0) / limit),
    }
  },

  async updateLocationStock(
    locationId: string,
    inventoryItemId: string,
    quantity: number,
    operation: "add" | "subtract" | "set" = "set",
  ): Promise<LocationInventory> {
    // Get current stock
    const { data: currentStock } = await enhancedSupabaseService.supabase
      .from("location_inventory")
      .select("current_stock")
      .eq("location_id", locationId)
      .eq("inventory_item_id", inventoryItemId)
      .single()

    let newQuantity = quantity
    if (operation === "add" && currentStock) {
      newQuantity = currentStock.current_stock + quantity
    } else if (operation === "subtract" && currentStock) {
      newQuantity = Math.max(0, currentStock.current_stock - quantity)
    }

    const { data, error } = await enhancedSupabaseService.supabase
      .from("location_inventory")
      .upsert({
        location_id: locationId,
        inventory_item_id: inventoryItemId,
        current_stock: newQuantity,
        last_updated: new Date().toISOString(),
      })
      .select(`
        *,
        location:locations(id, name, code),
        inventory_item:inventory_items(*)
      `)
      .single()

    if (error) throw error
    return data
  },

  // Stock transfer management
  async getStockTransfers(
    organizationId: string,
    locationId?: string,
    status?: string,
    page = 1,
    limit = 50,
  ): Promise<PaginatedResponse<StockTransfer>> {
    let query = enhancedSupabaseService.supabase
      .from("stock_transfers")
      .select(
        `
        *,
        from_location:locations!from_location_id(id, name, code),
        to_location:locations!to_location_id(id, name, code),
        creator:users!created_by(id, name),
        transfer_items:stock_transfer_items(
          *,
          inventory_item:inventory_items(*)
        )
      `,
        { count: "exact" },
      )
      .eq("organization_id", organizationId)

    if (locationId) {
      query = query.or(`from_location_id.eq.${locationId},to_location_id.eq.${locationId}`)
    }

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order("created_at", { ascending: false })

    if (error) throw error

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      total_pages: Math.ceil((count || 0) / limit),
    }
  },

  async createStockTransfer(transferData: Partial<StockTransfer>): Promise<StockTransfer> {
    // Generate transfer number if not provided
    if (!transferData.transfer_number) {
      const { count } = await enhancedSupabaseService.supabase
        .from("stock_transfers")
        .select("*", { count: "exact" })
        .eq("organization_id", transferData.organization_id!)

      transferData.transfer_number = `ST${String((count || 0) + 1).padStart(6, "0")}`
    }

    const { data, error } = await enhancedSupabaseService.supabase
      .from("stock_transfers")
      .insert([transferData])
      .select(`
        *,
        from_location:locations!from_location_id(id, name, code),
        to_location:locations!to_location_id(id, name, code),
        creator:users!created_by(id, name)
      `)
      .single()

    if (error) throw error
    return data
  },

  async updateStockTransferStatus(
    id: string,
    status: StockTransfer["status"],
    userId?: string,
  ): Promise<StockTransfer> {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (status === "approved" && userId) {
      updateData.approved_by = userId
    } else if (status === "completed" && userId) {
      updateData.received_by = userId
      updateData.completed_date = new Date().toISOString()
    }

    const { data, error } = await enhancedSupabaseService.supabase
      .from("stock_transfers")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        from_location:locations!from_location_id(id, name, code),
        to_location:locations!to_location_id(id, name, code),
        transfer_items:stock_transfer_items(
          *,
          inventory_item:inventory_items(*)
        )
      `)
      .single()

    if (error) throw error

    // If completing transfer, update inventory levels
    if (status === "completed" && data.transfer_items) {
      await this.processStockTransferCompletion(data)
    }

    return data
  },

  async processStockTransferCompletion(transfer: StockTransfer): Promise<void> {
    if (!transfer.transfer_items) return

    const promises = transfer.transfer_items.map(async (item) => {
      // Reduce stock from source location
      if (transfer.from_location_id) {
        await this.updateLocationStock(
          transfer.from_location_id,
          item.inventory_item_id,
          item.transferred_quantity,
          "subtract",
        )
      }

      // Add stock to destination location
      await this.updateLocationStock(transfer.to_location_id, item.inventory_item_id, item.received_quantity, "add")
    })

    await Promise.all(promises)
  },

  // Analytics and reporting
  async getMultiLocationStats(organizationId: string): Promise<MultiLocationStats> {
    try {
      // This would typically involve complex queries across multiple tables
      // For now, returning mock data structure
      const locations = await this.getLocations(organizationId)

      return {
        total_locations: locations.length,
        active_locations: locations.filter((l) => l.is_active).length,
        total_revenue_all_locations: 0,
        total_profit_all_locations: 0,
        best_performing_location: null,
        worst_performing_location: null,
        pending_transfers: 0,
        low_stock_alerts: [],
      }
    } catch (error) {
      console.error("Error fetching multi-location stats:", error)
      throw error
    }
  },

  async getLocationAnalytics(
    organizationId: string,
    locationId?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<LocationAnalytics[]> {
    let query = enhancedSupabaseService.supabase
      .from("location_analytics")
      .select(`
        *,
        location:locations(id, name, code)
      `)
      .eq("organization_id", organizationId)

    if (locationId) {
      query = query.eq("location_id", locationId)
    }

    if (startDate) {
      query = query.gte("date", startDate)
    }

    if (endDate) {
      query = query.lte("date", endDate)
    }

    const { data, error } = await query.order("date", { ascending: false })

    if (error) throw error
    return data || []
  },

  async getLocationComparison(organizationId: string): Promise<LocationComparison[]> {
    try {
      const locations = await this.getLocations(organizationId)

      // This would typically involve complex analytics queries
      // For now, returning empty array
      return []
    } catch (error) {
      console.error("Error fetching location comparison:", error)
      throw error
    }
  },

  async getLowStockAlerts(organizationId: string): Promise<
    Array<{
      location: Location
      item: any
      current_stock: number
      min_stock_level: number
    }>
  > {
    const { data, error } = await enhancedSupabaseService.supabase
      .from("location_inventory")
      .select(`
        current_stock,
        min_stock_level,
        location:locations(id, name, code),
        inventory_item:inventory_items(*)
      `)
      .eq("organization_id", organizationId)
      .filter("current_stock", "lte", "min_stock_level")
      .order("current_stock")

    if (error) throw error

    return (data || []).map((item) => ({
      location: item.location,
      item: item.inventory_item,
      current_stock: item.current_stock,
      min_stock_level: item.min_stock_level,
    }))
  },

  // Bulk operations
  async bulkUpdateLocationInventory(
    updates: Array<{
      location_id: string
      inventory_item_id: string
      current_stock: number
    }>,
  ): Promise<void> {
    const { error } = await enhancedSupabaseService.supabase.from("location_inventory").upsert(
      updates.map((update) => ({
        ...update,
        last_updated: new Date().toISOString(),
      })),
    )

    if (error) throw error
  },

  async syncInventoryAcrossLocations(
    organizationId: string,
    inventoryItemId: string,
    sourceLocationId: string,
  ): Promise<void> {
    // Get source location stock
    const { data: sourceStock } = await enhancedSupabaseService.supabase
      .from("location_inventory")
      .select("current_stock, min_stock_level, max_stock_level")
      .eq("location_id", sourceLocationId)
      .eq("inventory_item_id", inventoryItemId)
      .single()

    if (!sourceStock) return

    // Get all other locations for this organization
    const locations = await this.getLocations(organizationId)
    const otherLocations = locations.filter((loc) => loc.id !== sourceLocationId)

    // Update inventory settings for all other locations
    const updates = otherLocations.map((location) => ({
      location_id: location.id,
      inventory_item_id: inventoryItemId,
      min_stock_level: sourceStock.min_stock_level,
      max_stock_level: sourceStock.max_stock_level,
      current_stock: 0, // Don't sync actual stock, only settings
    }))

    await this.bulkUpdateLocationInventory(updates)
  },
}
