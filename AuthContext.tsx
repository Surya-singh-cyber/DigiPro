"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { authService } from "../services/authService"
import type { AuthState, User } from "../types"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  verifyOTP: (otp: string) => Promise<void>
  register: (userData: Partial<User>) => Promise<void>
  sendOTP: (phoneNumber: string) => Promise<void>
  firebaseUser: any
  isDemoMode: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })
  const [firebaseUser, setFirebaseUser] = useState<any>(null)
  const [pendingUserData, setPendingUserData] = useState<Partial<User> | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(true)

  useEffect(() => {
    // Set demo mode
    const demoMode = authService.isDemoModeActive()
    setIsDemoMode(demoMode)
    console.log("🚀 AuthProvider initialized with demo mode:", demoMode)

    // Listen to auth state changes
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      console.log("🚀 Auth state changed:", { firebaseUser: !!firebaseUser, isDemoMode: demoMode })
      setFirebaseUser(firebaseUser)

      if (firebaseUser) {
        // In demo mode, don't try to fetch from Supabase
        if (demoMode) {
          console.log("🚀 Demo mode: Skipping Supabase fetch")
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
          return
        }

        // Production mode would fetch from Supabase here
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    })

    return () => {
      unsubscribe()
      authService.cleanup()
    }
  }, [])

  const login = async (email: string, password: string) => {
    throw new Error("Please use phone number authentication")
  }

  const register = async (userData: Partial<User>) => {
    console.log("🚀 Register called with demo mode:", isDemoMode)
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    try {
      // Store user data temporarily
      setPendingUserData(userData)

      // Send OTP to phone number
      await sendOTP(userData.phone || "")

      setAuthState((prev) => ({ ...prev, isLoading: false }))
    } catch (error: any) {
      console.error("🚀 Registration error:", error)
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const sendOTP = async (phoneNumber: string) => {
    try {
      console.log("🚀 Context sendOTP called")
      await authService.sendOTP(phoneNumber)
    } catch (error: any) {
      console.error("🚀 Context OTP send error:", error)
      throw new Error(error.message || "Failed to send OTP")
    }
  }

  const verifyOTP = async (otp: string) => {
    console.log("🚀 Context verifyOTP called")
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    try {
      const firebaseUser = await authService.verifyOTP(otp)

      if (firebaseUser && pendingUserData) {
        // In demo mode, create a mock user
        if (isDemoMode) {
          console.log("🚀 Creating demo user")
          const mockUser: User = {
            id: firebaseUser.uid,
            firebase_id: firebaseUser.uid,
            name: pendingUserData.name || "Demo User",
            email: pendingUserData.email || "demo@example.com",
            phone: firebaseUser.phoneNumber || pendingUserData.phone || "",
            businessType: pendingUserData.businessType || "automobile",
            businessName: pendingUserData.businessName || "Demo Business",
            gstNumber: pendingUserData.gstNumber,
            role: "owner",
            isVerified: true,
          }

          setAuthState({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
          })
          setPendingUserData(null)
          return
        }

        // Production mode would create user in Supabase here
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    } catch (error: any) {
      console.error("🚀 Context verifyOTP error:", error)
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const logout = async () => {
    try {
      console.log("🚀 Context logout called")
      await authService.signOut()
      setPendingUserData(null)
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        verifyOTP,
        register,
        sendOTP,
        firebaseUser,
        isDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
