import { createClient } from "@supabase/supabase-js"

// Validate URL format
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return url.startsWith("https://") && url.includes(".supabase.co")
  } catch {
    return false
  }
}

// Get environment variables with validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate environment variables
const isConfigured = supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl)

// Create mock client for development/demo mode
const createMockClient = () => ({
  from: (table: string) => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
    upsert: () => Promise.resolve({ data: null, error: null }),
  }),
  auth: {
    signUp: () => Promise.resolve({ data: null, error: null }),
    signInWithPassword: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  realtime: {
    channel: () => ({
      on: () => ({}),
      subscribe: () => ({}),
      unsubscribe: () => ({}),
    }),
  },
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: null }),
      download: () => Promise.resolve({ data: null, error: null }),
    }),
  },
})

// Create the main supabase client with error handling
export const supabase = (() => {
  if (!isConfigured) {
    console.warn("Supabase not configured properly. Using mock client for development.")
    console.warn("Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY")
    return createMockClient()
  }

  try {
    return createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error)
    return createMockClient()
  }
})()

// Create a separate client optimized for real-time subscriptions
export const realtimeSupabase = (() => {
  if (!isConfigured) {
    return supabase // Use the same mock client
  }

  try {
    return createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      realtime: {
        params: {
          eventsPerSecond: 20,
        },
      },
    })
  } catch (error) {
    console.error("Failed to initialize realtime Supabase client:", error)
    return supabase // Fallback to main client
  }
})()

// Server-side client for admin operations
export const createServerClient = () => {
  if (!isConfigured || !serviceRoleKey) {
    console.warn("Service role key not available or Supabase not configured")
    return supabase
  }

  try {
    return createClient(supabaseUrl!, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  } catch (error) {
    console.error("Failed to create server client:", error)
    return supabase
  }
}

// Utility function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return isConfigured
}

// Export configuration status for debugging
export const supabaseConfig = {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : "Not configured",
  hasAnonKey: !!supabaseAnonKey,
  hasServiceKey: !!serviceRoleKey,
  isConfigured: isConfigured,
  isValidUrl: supabaseUrl ? isValidUrl(supabaseUrl) : false,
}

// Default export for backward compatibility
export default supabase
