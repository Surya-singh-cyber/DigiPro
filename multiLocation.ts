export interface Location {
  id: string
  organization_id: string
  name: string
  code: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  email: string
  is_headquarters: boolean
  is_active: boolean
  settings: Record<string, any>
  created_at?: string
  updated_at?: string
}

export interface LocationPerformance {
  location: Location
  revenue: number
  profit: number
}

export interface MultiLocationStats {
  total_locations: number
  active_locations: number
  total_revenue_all_locations: number
  total_profit_all_locations: number
  best_performing_location: LocationPerformance | null
  worst_performing_location: LocationPerformance | null
  pending_transfers: number
  low_stock_alerts: any[]
}

export interface LocationMetrics {
  revenue: number
  profit: number
  orders: number
  customers: number
}

export interface LocationGrowth {
  revenue_growth: number
  profit_growth: number
  order_growth: number
  customer_growth: number
}

export interface LocationComparison {
  location: Location
  current_month: LocationMetrics
  previous_month: LocationMetrics
  growth: LocationGrowth
}

export interface StockTransfer {
  id: string
  organization_id: string
  from_location_id: string
  to_location_id: string
  product_id: string
  quantity: number
  status: "pending" | "approved" | "in_transit" | "completed" | "cancelled"
  requested_by: string
  approved_by?: string
  notes?: string
  created_at: string
  updated_at: string
}
