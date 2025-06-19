import { realtimeSupabase } from "../config/supabase"
import type { RealtimeChannel } from "@supabase/supabase-js"

class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map()

  subscribeToTable(
    tableName: string,
    organizationId: string,
    callback: (payload: any) => void,
    filter?: string,
  ): () => void {
    const channelName = `${tableName}_${organizationId}`

    // Remove existing channel if it exists
    if (this.channels.has(channelName)) {
      this.unsubscribe(channelName)
    }

    const channel = realtimeSupabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: tableName,
          filter: filter || `organization_id=eq.${organizationId}`,
        },
        (payload) => {
          console.log(`🔄 Real-time update for ${tableName}:`, payload)
          callback(payload)
        },
      )
      .subscribe((status) => {
        console.log(`📡 Subscription status for ${tableName}:`, status)
      })

    this.channels.set(channelName, channel)

    // Return unsubscribe function
    return () => this.unsubscribe(channelName)
  }

  subscribeToUserTable(tableName: string, userId: string, callback: (payload: any) => void): () => void {
    const channelName = `${tableName}_user_${userId}`

    if (this.channels.has(channelName)) {
      this.unsubscribe(channelName)
    }

    const channel = realtimeSupabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: tableName,
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log(`🔄 Real-time update for user ${tableName}:`, payload)
          callback(payload)
        },
      )
      .subscribe()

    this.channels.set(channelName, channel)

    return () => this.unsubscribe(channelName)
  }

  subscribeToInvoices(organizationId: string, callback: (payload: any) => void): () => void {
    return this.subscribeToTable("invoices", organizationId, callback)
  }

  subscribeToCustomers(organizationId: string, callback: (payload: any) => void): () => void {
    return this.subscribeToTable("customers", organizationId, callback)
  }

  subscribeToInventory(organizationId: string, callback: (payload: any) => void): () => void {
    return this.subscribeToTable("inventory_items", organizationId, callback)
  }

  subscribeToPayments(organizationId: string, callback: (payload: any) => void): () => void {
    return this.subscribeToTable("payments", organizationId, callback)
  }

  subscribeToStockTransfers(organizationId: string, callback: (payload: any) => void): () => void {
    return this.subscribeToTable("stock_transfers", organizationId, callback)
  }

  subscribeToLocationInventory(locationId: string, callback: (payload: any) => void): () => void {
    const channelName = `location_inventory_${locationId}`

    if (this.channels.has(channelName)) {
      this.unsubscribe(channelName)
    }

    const channel = realtimeSupabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "location_inventory",
          filter: `location_id=eq.${locationId}`,
        },
        (payload) => {
          console.log(`🔄 Real-time update for location inventory:`, payload)
          callback(payload)
        },
      )
      .subscribe()

    this.channels.set(channelName, channel)

    return () => this.unsubscribe(channelName)
  }

  private unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName)
    if (channel) {
      realtimeSupabase.removeChannel(channel)
      this.channels.delete(channelName)
      console.log(`🔌 Unsubscribed from ${channelName}`)
    }
  }

  unsubscribeAll() {
    this.channels.forEach((channel, channelName) => {
      realtimeSupabase.removeChannel(channel)
      console.log(`🔌 Unsubscribed from ${channelName}`)
    })
    this.channels.clear()
  }

  getConnectionStatus() {
    return realtimeSupabase.realtime.isConnected()
  }

  async reconnect() {
    try {
      await realtimeSupabase.realtime.connect()
      console.log("🔄 Realtime reconnected")
    } catch (error) {
      console.error("❌ Failed to reconnect realtime:", error)
    }
  }

  // Get active subscriptions count
  getActiveSubscriptionsCount(): number {
    return this.channels.size
  }

  // Get subscription details for debugging
  getSubscriptionDetails(): Array<{ channelName: string; status: string }> {
    const details: Array<{ channelName: string; status: string }> = []
    this.channels.forEach((channel, channelName) => {
      details.push({
        channelName,
        status: channel.state || "unknown",
      })
    })
    return details
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService()

// Export class for testing or custom instances
export { RealtimeService }
