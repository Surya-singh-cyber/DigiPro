// Enhanced types for multi-tenant SaaS application

export interface Organization {
  id: string
  name: string
  business_type: BusinessType
  subscription_plan: SubscriptionPlan
  gst_number?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  phone?: string
  email?: string
  website?: string
  logo_url?: string
  signature_url?: string
  is_active: boolean
  trial_end_date?: string // 7 days free trial
  subscription_status: "trial" | "active" | "expired" | "cancelled"
  settings: Record<string, any>
  created_at?: string
  updated_at?: string
}

export type BusinessType = "automobile" | "medical" | "retail" | "school" | "pharmacy" | "textile"

export type SubscriptionPlan = "basic" | "professional" | "enterprise"

export interface User {
  id: string
  organization_id: string
  firebase_id: string
  name: string
  email: string
  phone: string
  role: UserRole
  permissions: Record<string, boolean>
  is_verified: boolean
  is_active: boolean
  last_login?: string
  created_at?: string
  updated_at?: string
  organization?: Organization
}

export type UserRole = "owner" | "admin" | "manager" | "staff" | "accountant"

export interface AuthState {
  user: User | null
  organization: Organization | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface Subscription {
  id: string
  organization_id: string
  plan_name: string
  status: "active" | "cancelled" | "expired" | "suspended" | "trial"
  start_date: string
  end_date: string
  trial_end_date?: string
  amount: number
  currency: string
  payment_method?: string
  features: Record<string, any>
  created_at?: string
  updated_at?: string
}

export interface Customer {
  id: string
  organization_id: string
  customer_code?: string
  name: string
  phone: string
  email?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  gst_number?: string
  pan_number?: string
  customer_type: "individual" | "business" | "government"
  credit_limit: number
  outstanding_balance: number
  is_active: boolean
  tags?: string[]
  notes?: string
  created_by?: string
  created_at?: string
  updated_at?: string
}

export interface Student {
  id: string
  organization_id: string
  student_id: string
  roll_number?: string
  name: string
  class: string
  section?: string
  date_of_birth?: string
  gender?: "male" | "female" | "other"
  father_name?: string
  mother_name?: string
  guardian_name?: string
  phone: string
  email?: string
  address?: string
  admission_date: string
  academic_year?: string
  fee_structure?: FeeStructure
  total_fees: number
  paid_fees: number
  pending_fees: number
  is_active: boolean
  photo_url?: string
  documents?: Record<string, any>
  created_at?: string
  updated_at?: string
}

export interface FeeStructure {
  tuition_fee: number
  exam_fee: number
  library_fee: number
  sports_fee: number
  transport_fee?: number
  hostel_fee?: number
  other_fees?: number
  total: number
}

export interface FeePayment {
  id: string
  organization_id: string
  student_id: string
  receipt_number: string
  payment_date: string
  amount: number
  payment_method: string
  fee_type: string
  academic_year?: string
  month_year?: string
  late_fee: number
  discount: number
  remarks?: string
  created_by?: string
  created_at?: string
  student?: Student
}

export interface Employee {
  id: string
  organization_id: string
  employee_id: string
  name: string
  designation?: string
  department?: string
  phone: string
  email?: string
  address?: string
  date_of_joining?: string
  salary?: number
  bank_account?: string
  pan_number?: string
  aadhar_number?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface SalaryPayment {
  id: string
  organization_id: string
  employee_id: string
  month_year: string
  basic_salary: number
  allowances: number
  deductions: number
  overtime_amount: number
  bonus: number
  net_salary: number
  payment_date?: string
  payment_method?: string
  status: "pending" | "paid" | "cancelled"
  remarks?: string
  created_by?: string
  created_at?: string
  employee?: Employee
}

export interface Vehicle {
  id: string
  organization_id: string
  customer_id: string
  vehicle_number: string
  make: string
  model: string
  year: number
  color?: string
  fuel_type: "petrol" | "diesel" | "electric" | "hybrid" | "cng"
  transmission: "manual" | "automatic"
  engine_number?: string
  chassis_number?: string
  registration_date?: string
  insurance_company?: string
  insurance_policy_number?: string
  insurance_expiry?: string
  pollution_certificate_expiry?: string
  last_service_date?: string
  next_service_due?: string
  mileage?: number
  purchase_price?: number
  current_value?: number
  status: "active" | "sold" | "scrapped"
  created_at?: string
  updated_at?: string
  customer?: Customer
}

export interface InventoryItem {
  id: string
  organization_id: string
  item_code: string
  name: string
  description?: string
  category: string
  subcategory?: string
  brand?: string
  unit: string
  hsn_code?: string
  gst_rate: number
  purchase_price?: number
  selling_price: number
  mrp?: number
  current_stock: number
  min_stock_level: number
  max_stock_level?: number
  reorder_point?: number
  location?: string
  supplier_name?: string
  supplier_contact?: string
  expiry_date?: string
  batch_number?: string
  barcode?: string
  is_active: boolean
  tags?: string[]
  images?: string[]
  created_by?: string
  created_at?: string
  updated_at?: string
}

export interface StockMovement {
  id: string
  organization_id: string
  inventory_item_id: string
  movement_type: "in" | "out" | "adjustment"
  quantity: number
  reference_type?: string
  reference_id?: string
  notes?: string
  created_by?: string
  created_at?: string
  inventory_item?: InventoryItem
}

export interface Invoice {
  id: string
  organization_id: string
  customer_id: string
  vehicle_id?: string
  invoice_number: string
  invoice_type: "sale" | "purchase" | "return" | "estimate"
  invoice_date: string
  due_date?: string
  subtotal: number
  discount_amount: number
  discount_percentage: number
  tax_amount: number
  shipping_charges: number
  other_charges: number
  round_off: number
  total_amount: number
  paid_amount: number
  balance_amount: number
  status: "draft" | "sent" | "paid" | "partial" | "overdue" | "cancelled"
  payment_terms?: string
  payment_method?: string
  payment_status: "pending" | "partial" | "paid" | "overdue"
  notes?: string
  terms_conditions?: string
  created_by?: string
  created_at?: string
  updated_at?: string
  customer?: Customer
  vehicle?: Vehicle
  invoice_items?: InvoiceItem[]
  payments?: Payment[]
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  inventory_item_id?: string
  item_name: string
  item_description?: string
  hsn_code?: string
  quantity: number
  unit?: string
  rate: number
  discount_percentage: number
  discount_amount: number
  taxable_amount: number
  gst_rate: number
  cgst_amount: number
  sgst_amount: number
  igst_amount: number
  total_amount: number
  created_at?: string
  inventory_item?: InventoryItem
}

export interface Payment {
  id: string
  organization_id: string
  invoice_id: string
  payment_number: string
  payment_date: string
  amount: number
  payment_method: string
  reference_number?: string
  bank_name?: string
  cheque_number?: string
  cheque_date?: string
  utr_number?: string
  notes?: string
  created_by?: string
  created_at?: string
  invoice?: Invoice
}

export interface GSTReturn {
  id: string
  organization_id: string
  return_type: "GSTR1" | "GSTR3B" | "GSTR9"
  period: string
  financial_year: string
  total_sales: number
  total_purchases: number
  output_tax: number
  input_tax: number
  tax_payable: number
  tax_paid: number
  status: "draft" | "filed" | "revised"
  filing_date?: string
  acknowledgment_number?: string
  return_data?: Record<string, any>
  created_by?: string
  created_at?: string
  updated_at?: string
}

export interface Notification {
  id: string
  organization_id: string
  user_id: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  category: "payment" | "stock" | "gst" | "general" | "reminder" | "trial"
  is_read: boolean
  action_url?: string
  scheduled_at?: string
  sent_at?: string
  created_at?: string
}

export interface AuditLog {
  id: string
  organization_id: string
  user_id?: string
  action: string
  table_name?: string
  record_id?: string
  old_values?: Record<string, any>
  new_values?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at?: string
  user?: User
}

export interface DashboardStats {
  // Financial metrics
  total_revenue: number
  total_profit: number
  total_expenses: number
  monthly_revenue: number
  monthly_profit: number

  // Inventory metrics
  inventory_value: number
  low_stock_items: number
  out_of_stock_items: number

  // Customer metrics
  total_customers: number
  new_customers_this_month: number

  // Invoice metrics
  pending_invoices: number
  overdue_invoices: number
  paid_invoices: number

  // School specific metrics
  total_students?: number
  pending_fees?: number
  collected_fees_this_month?: number

  // Employee metrics
  total_employees?: number
  salary_paid_this_month?: number
  pending_salaries?: number

  // Vehicle metrics (automobile)
  total_vehicles?: number
  services_due?: number
  insurance_expiring?: number

  // Trial/Subscription metrics
  trial_days_remaining?: number
  subscription_status?: "trial" | "active" | "expired" | "cancelled"
}

export interface BusinessMetrics {
  revenue_trend: Array<{ month: string; revenue: number; profit: number }>
  top_selling_items: Array<{ item: string; quantity: number; revenue: number }>
  customer_growth: Array<{ month: string; new_customers: number; total_customers: number }>
  payment_status: Array<{ status: string; count: number; amount: number }>
  gst_summary: {
    output_tax: number
    input_tax: number
    tax_payable: number
    returns_filed: number
  }
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}

// Form types
export interface RegisterFormData {
  name: string
  email: string
  password: string
  phone: string
  organization_name: string
  business_type: BusinessType
  gst_number?: string
  subscription_plan: SubscriptionPlan
}

export interface LoginFormData {
  email: string
  password: string
}

export interface ForgotPasswordFormData {
  email?: string
  phone?: string
  resetMethod: "email" | "phone"
}

export interface InvoiceFormData {
  customer_id: string
  vehicle_id?: string
  invoice_date: string
  due_date?: string
  items: InvoiceItemFormData[]
  discount_percentage: number
  discount_amount: number
  shipping_charges: number
  other_charges: number
  notes?: string
  terms_conditions?: string
}

export interface InvoiceItemFormData {
  inventory_item_id?: string
  item_name: string
  item_description?: string
  hsn_code?: string
  quantity: number
  unit?: string
  rate: number
  discount_percentage: number
  gst_rate: number
}

// Settings types
export interface OrganizationSettings {
  invoice_settings: {
    prefix: string
    starting_number: number
    terms_conditions: string
    footer_text: string
    show_bank_details: boolean
    bank_details?: {
      bank_name: string
      account_number: string
      ifsc_code: string
      account_holder_name: string
    }
  }
  notification_settings: {
    email_notifications: boolean
    sms_notifications: boolean
    low_stock_alerts: boolean
    payment_reminders: boolean
    gst_filing_reminders: boolean
    trial_reminders: boolean
  }
  gst_settings: {
    auto_generate_returns: boolean
    filing_frequency: "monthly" | "quarterly"
    composition_scheme: boolean
  }
}
