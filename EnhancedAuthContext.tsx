"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getAuthService } from "../services/authService"
import { enhancedSupabaseService } from "../services/enhancedSupabaseService"
import { realtimeService } from "../services/realtimeService"
import type { AuthState, RegisterFormData, LoginFormData, ForgotPasswordFormData } from "../types"

interface EnhancedAuthContextType extends AuthState {
  login: (formData: LoginFormData) => Promise<void>
  logout: () => void
  register: (userData: RegisterFormData) => Promise<void>
  sendPasswordResetEmail: (email: string) => Promise<void>
  forgotPassword: (formData: ForgotPasswordFormData) => Promise<void>
  firebaseUser: any
  switchOrganization: (organizationId: string) => Promise<void>
  refreshUserData: () => Promise<void>
  trialDaysRemaining: number | null
  isTrialExpired: boolean
  subscriptionStatus: "trial" | "active" | "expired" | "cancelled"
}

const EnhancedAuthContext = createContext<EnhancedAuthContextType | null>(null)

export const useEnhancedAuth = () => {
  const context = useContext(EnhancedAuthContext)
  if (!context) {
    throw new Error("useEnhancedAuth must be used within an EnhancedAuthProvider")
  }
  return context
}

export const EnhancedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    organization: null,
    isAuthenticated: false,
    isLoading: true,
  })
  const [firebaseUser, setFirebaseUser] = useState<any>(null)
  const [trialDaysRemaining, setTrialDaysRemaining] = useState<number | null>(null)
  const [isTrialExpired, setIsTrialExpired] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<"trial" | "active" | "expired" | "cancelled">("trial")

  useEffect(() => {
    console.log("🚀 DigiPro Auth Provider initialized")

    // Get auth service instance
    const authService = getAuthService()

    // Listen to auth state changes
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      console.log("🔄 Auth state changed:", { firebaseUser: !!firebaseUser })
      setFirebaseUser(firebaseUser)

      if (firebaseUser) {
        try {
          // In mock mode, create a mock organization and user
          if (!authService.isFirebaseModeActive()) {
            console.log("📝 Creating mock user data for:", firebaseUser.email)

            // Create mock organization
            const mockOrganization = {
              id: `org_${Date.now()}`,
              name: `${firebaseUser.displayName || firebaseUser.email?.split("@")[0]}'s Business`,
              business_type: "automobile" as const,
              subscription_plan: "professional" as const,
              gst_number: "",
              is_active: true,
              trial_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              subscription_status: "trial" as const,
              settings: {
                invoice_settings: {
                  prefix: "INV",
                  starting_number: 1,
                  terms_conditions: "Payment is due within 30 days of invoice date.",
                  footer_text: "Thank you for choosing DigiPro!",
                  show_bank_details: false,
                },
                notification_settings: {
                  email_notifications: true,
                  sms_notifications: false,
                  low_stock_alerts: true,
                  payment_reminders: true,
                  gst_filing_reminders: true,
                  trial_reminders: true,
                },
                gst_settings: {
                  auto_generate_returns: false,
                  filing_frequency: "monthly" as const,
                  composition_scheme: false,
                },
              },
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }

            // Create mock user
            const mockUser = {
              id: `user_${Date.now()}`,
              organization_id: mockOrganization.id,
              firebase_id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
              email: firebaseUser.email || "",
              phone: firebaseUser.phoneNumber || "",
              role: "owner" as const,
              permissions: {
                all: true,
              },
              is_verified: true,
              is_active: true,
              organization: mockOrganization,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }

            // Set trial days remaining
            setTrialDaysRemaining(7)
            setIsTrialExpired(false)
            setSubscriptionStatus("trial")

            setAuthState({
              user: mockUser,
              organization: mockOrganization,
              isAuthenticated: true,
              isLoading: false,
            })

            console.log("✅ Mock user data created successfully")
            return
          }

          // Try to get user from Supabase (for real Firebase mode)
          const userData = await enhancedSupabaseService.getUserByFirebaseId(firebaseUser.uid)

          if (userData) {
            // Calculate trial days remaining
            const trialEndDate = userData.organization?.trial_end_date
            if (trialEndDate) {
              const now = new Date()
              const trialEnd = new Date(trialEndDate)
              const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
              setTrialDaysRemaining(Math.max(0, daysRemaining))
              setIsTrialExpired(daysRemaining <= 0)
              setSubscriptionStatus(userData.organization.subscription_status || "trial")
            }

            setAuthState({
              user: userData,
              organization: userData.organization || null,
              isAuthenticated: true,
              isLoading: false,
            })

            // Set up real-time subscriptions for the organization
            if (userData.organization?.id) {
              setupRealtimeSubscriptions(userData.organization.id)
            }
          } else {
            // User exists in Firebase but not in Supabase
            console.log("⚠️ User exists in Firebase but not in Supabase")
            setAuthState({
              user: null,
              organization: null,
              isAuthenticated: false,
              isLoading: false,
            })
          }
        } catch (error) {
          console.error("❌ Error fetching user data:", error)
          setAuthState({
            user: null,
            organization: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      } else {
        // Clean up real-time subscriptions
        realtimeService.unsubscribeAll()

        setAuthState({
          user: null,
          organization: null,
          isAuthenticated: false,
          isLoading: false,
        })
        setTrialDaysRemaining(null)
        setIsTrialExpired(false)
        setSubscriptionStatus("trial")
      }
    })

    return () => {
      unsubscribe()
      realtimeService.unsubscribeAll()
    }
  }, [])

  const setupRealtimeSubscriptions = (organizationId: string) => {
    // Subscribe to key tables for real-time updates
    realtimeService.subscribeToTable("customers", organizationId, (payload) => {
      console.log("🔄 Customer update:", payload)
      // Trigger data refresh if needed
    })

    realtimeService.subscribeToTable("inventory_items", organizationId, (payload) => {
      console.log("🔄 Inventory update:", payload)
    })

    realtimeService.subscribeToTable("invoices", organizationId, (payload) => {
      console.log("🔄 Invoice update:", payload)
    })
  }

  const login = async (formData: LoginFormData) => {
    console.log("🔐 Login attempt for:", formData.email)
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    try {
      const authService = getAuthService()
      const firebaseUser = await authService.signInWithEmail(formData.email, formData.password)
      console.log("✅ Login successful:", firebaseUser.uid)
      // Auth state change will handle the rest
    } catch (error: any) {
      console.error("❌ Login error:", error)
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const register = async (userData: RegisterFormData) => {
    console.log("📝 Registration attempt for:", userData.email)
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    try {
      const authService = getAuthService()

      if (!authService.isFirebaseModeActive()) {
        // Mock mode registration
        console.log("📝 Mock mode registration")

        // Create mock Firebase user
        const mockFirebaseUser = await authService.createAccount(userData.email, userData.password, userData.name)
        console.log("✅ Mock account created:", mockFirebaseUser.uid)

        // The auth state change listener will handle creating the organization and user data
        return
      }

      // Real Firebase mode (if configured)
      // Check if phone number already exists
      const existingUser = await enhancedSupabaseService.getUserByPhone(userData.phone)
      if (existingUser) {
        throw new Error("An account with this phone number already exists")
      }

      // Create Firebase account
      const firebaseUser = await authService.createAccount(userData.email, userData.password, userData.name)
      console.log("✅ Firebase account created:", firebaseUser.uid)

      // Calculate trial end date (7 days from now)
      const trialEndDate = new Date()
      trialEndDate.setDate(trialEndDate.getDate() + 7)

      // Create organization in Supabase
      const organization = await enhancedSupabaseService.createOrganization({
        name: userData.organization_name,
        business_type: userData.business_type,
        subscription_plan: userData.subscription_plan,
        gst_number: userData.gst_number,
        is_active: true,
        trial_end_date: trialEndDate.toISOString(),
        subscription_status: "trial",
        settings: {
          invoice_settings: {
            prefix: "INV",
            starting_number: 1,
            terms_conditions: "Payment is due within 30 days of invoice date.",
            footer_text: "Thank you for choosing DigiPro!",
            show_bank_details: false,
          },
          notification_settings: {
            email_notifications: true,
            sms_notifications: false,
            low_stock_alerts: true,
            payment_reminders: true,
            gst_filing_reminders: true,
            trial_reminders: true,
          },
          gst_settings: {
            auto_generate_returns: false,
            filing_frequency: "monthly",
            composition_scheme: false,
          },
        },
      })

      // Create user in Supabase
      const user = await enhancedSupabaseService.createUser({
        organization_id: organization.id,
        firebase_id: firebaseUser.uid,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: "owner",
        permissions: {
          all: true,
        },
        is_verified: true,
        is_active: true,
      })

      console.log("✅ Registration completed successfully")

      setAuthState({
        user: { ...user, organization },
        organization,
        isAuthenticated: true,
        isLoading: false,
      })

      setTrialDaysRemaining(7)
      setIsTrialExpired(false)
      setSubscriptionStatus("trial")

      // Set up real-time subscriptions
      setupRealtimeSubscriptions(organization.id)
    } catch (error: any) {
      console.error("❌ Registration error:", error)
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const sendPasswordResetEmail = async (email: string) => {
    try {
      const authService = getAuthService()
      await authService.sendPasswordResetEmail(email)
    } catch (error: any) {
      throw error
    }
  }

  const forgotPassword = async (formData: ForgotPasswordFormData) => {
    try {
      if (formData.resetMethod === "email" && formData.email) {
        const authService = getAuthService()
        await authService.sendPasswordResetEmail(formData.email)
      } else {
        throw new Error("Please provide email address")
      }
    } catch (error: any) {
      throw error
    }
  }

  const logout = async () => {
    try {
      console.log("🚪 Logout initiated")

      // Clean up real-time subscriptions
      realtimeService.unsubscribeAll()

      const authService = getAuthService()
      await authService.signOut()
      setAuthState({
        user: null,
        organization: null,
        isAuthenticated: false,
        isLoading: false,
      })
      setTrialDaysRemaining(null)
      setIsTrialExpired(false)
      setSubscriptionStatus("trial")
      console.log("✅ Logout completed")
    } catch (error) {
      console.error("❌ Logout error:", error)
    }
  }

  const switchOrganization = async (organizationId: string) => {
    if (!authState.user) return

    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }))

      const organization = await enhancedSupabaseService.getOrganization(organizationId)

      // Clean up old subscriptions and set up new ones
      realtimeService.unsubscribeAll()
      setupRealtimeSubscriptions(organizationId)

      setAuthState((prev) => ({
        ...prev,
        organization,
        isLoading: false,
      }))
    } catch (error) {
      console.error("❌ Error switching organization:", error)
      setAuthState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  const refreshUserData = async () => {
    if (!authState.user) return

    try {
      const userData = await enhancedSupabaseService.getUserByFirebaseId(authState.user.firebase_id)

      if (userData) {
        // Recalculate trial days
        const trialEndDate = userData.organization?.trial_end_date
        if (trialEndDate) {
          const now = new Date()
          const trialEnd = new Date(trialEndDate)
          const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          setTrialDaysRemaining(Math.max(0, daysRemaining))
          setIsTrialExpired(daysRemaining <= 0)
          setSubscriptionStatus(userData.organization.subscription_status || "trial")
        }

        setAuthState((prev) => ({
          ...prev,
          user: userData,
          organization: userData.organization || prev.organization,
        }))
      }
    } catch (error) {
      console.error("❌ Error refreshing user data:", error)
    }
  }

  return (
    <EnhancedAuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        register,
        sendPasswordResetEmail,
        forgotPassword,
        firebaseUser,
        switchOrganization,
        refreshUserData,
        trialDaysRemaining,
        isTrialExpired,
        subscriptionStatus,
      }}
    >
      {children}
    </EnhancedAuthContext.Provider>
  )
}

// Also export as default for compatibility
export default EnhancedAuthProvider

// Export the context and hook for external use
export { EnhancedAuthContext }
