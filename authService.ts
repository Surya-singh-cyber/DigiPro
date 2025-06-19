"use client"

import { getFirebaseConfig } from "../config/firebase"

// Mock user type
interface MockUser {
  uid: string
  email: string | null
  displayName: string | null
  phoneNumber: string | null
  emailVerified: boolean
  getIdToken: () => Promise<string>
  photoURL?: string | null
  metadata?: {
    creationTime?: string
    lastSignInTime?: string
  }
}

// Create mock user with realistic properties
const createMockUser = (email: string, additionalData?: any): MockUser => {
  const uid = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const displayName = additionalData?.displayName || email.split("@")[0]

  return {
    uid,
    email,
    displayName,
    phoneNumber: additionalData?.phoneNumber || null,
    emailVerified: true,
    photoURL: null,
    metadata: {
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString(),
    },
    getIdToken: async () => `mock_token_${uid}_${Date.now()}`,
  }
}

// Demo users for testing with different roles
const DEMO_USERS = [
  {
    email: "admin@digipro.com",
    password: "admin123",
    displayName: "Admin User",
    role: "admin",
  },
  {
    email: "demo@digipro.com",
    password: "demo123",
    displayName: "Demo User",
    role: "user",
  },
  {
    email: "test@example.com",
    password: "test123",
    displayName: "Test User",
    role: "user",
  },
  {
    email: "manager@digipro.com",
    password: "manager123",
    displayName: "Manager User",
    role: "manager",
  },
  {
    email: "owner@digipro.com",
    password: "owner123",
    displayName: "Business Owner",
    role: "owner",
  },
]

class AuthService {
  private currentMockUser: MockUser | null = null
  private authStateListeners: ((user: any) => void)[] = []
  private mockOTPCode = "123456"
  private pendingPhoneNumber: string | null = null

  constructor() {
    const config = getFirebaseConfig()
    console.log(`🔧 DigiPro AuthService initialized in Mock Mode`)
    console.log("📊 Available demo users:", DEMO_USERS.length)
    console.log("🎯 Firebase config status:", config)

    // Start with no user (logged out state)
    setTimeout(() => this.notifyAuthStateChange(null), 100)
  }

  private notifyAuthStateChange(user: any) {
    this.authStateListeners.forEach((callback) => {
      try {
        callback(user)
      } catch (error) {
        console.error("Error in auth state listener:", error)
      }
    })
  }

  async createAccount(email: string, password: string, displayName?: string) {
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user already exists
      const existingUser = DEMO_USERS.find((u) => u.email === email)
      if (existingUser) {
        throw new Error("An account with this email already exists")
      }

      // Validate password
      if (password.length < 6) {
        throw new Error("Password should be at least 6 characters")
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email address")
      }

      console.log("✅ Mock account created successfully:", email)
      const mockUser = createMockUser(email, { displayName })
      this.currentMockUser = mockUser
      this.notifyAuthStateChange(mockUser)
      return mockUser
    } catch (error: any) {
      console.error("❌ Account creation error:", error.message)
      throw error
    }
  }

  async signInWithEmail(email: string, password: string) {
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Find demo user
      const demoUser = DEMO_USERS.find((u) => u.email === email && u.password === password)

      if (demoUser) {
        console.log("✅ Mock sign in successful:", email)
        const mockUser = createMockUser(email, {
          displayName: demoUser.displayName,
          role: demoUser.role,
        })
        this.currentMockUser = mockUser
        this.notifyAuthStateChange(mockUser)
        return mockUser
      } else {
        // Provide helpful error with available credentials
        const availableUsers = DEMO_USERS.map((u) => `${u.email} (${u.password})`).join("\n")
        throw new Error(`Invalid credentials.\n\nAvailable demo accounts:\n${availableUsers}`)
      }
    } catch (error: any) {
      console.error("❌ Sign in error:", error.message)
      throw error
    }
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email address")
      }

      console.log("✅ Mock password reset email sent to:", email)
      console.log("📧 In a real app, user would receive reset email")
    } catch (error: any) {
      console.error("❌ Password reset error:", error.message)
      throw error
    }
  }

  async sendOTP(phoneNumber: string): Promise<boolean> {
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1200))

      // Validate phone number format
      const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/
      const cleanPhone = phoneNumber.replace(/\s+/g, "")

      if (!phoneRegex.test(cleanPhone)) {
        throw new Error("Invalid phone number. Please enter a valid Indian mobile number")
      }

      this.pendingPhoneNumber = phoneNumber
      console.log("✅ Mock OTP sent to:", phoneNumber)
      console.log(`📱 Use OTP: ${this.mockOTPCode} to verify`)
      return true
    } catch (error: any) {
      console.error("❌ Error sending OTP:", error.message)
      throw error
    }
  }

  async verifyOTP(otp: string) {
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 600))

      if (!this.pendingPhoneNumber) {
        throw new Error("No OTP request found. Please request OTP first.")
      }

      if (otp === this.mockOTPCode) {
        console.log("✅ Mock OTP verified successfully")
        const mockUser = createMockUser("phone@digipro.com", {
          phoneNumber: this.pendingPhoneNumber,
          displayName: "Phone User",
        })
        this.currentMockUser = mockUser
        this.pendingPhoneNumber = null
        this.notifyAuthStateChange(mockUser)
        return mockUser
      } else {
        throw new Error(`Invalid OTP. Use: ${this.mockOTPCode}`)
      }
    } catch (error: any) {
      console.error("❌ Error verifying OTP:", error.message)
      throw error
    }
  }

  async signOut(): Promise<void> {
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      console.log("✅ Mock sign out successful")
      this.currentMockUser = null
      this.pendingPhoneNumber = null
      this.notifyAuthStateChange(null)
    } catch (error: any) {
      console.error("❌ Sign out error:", error.message)
      throw error
    }
  }

  onAuthStateChanged(callback: (user: any) => void) {
    if (typeof window === "undefined") {
      return () => {}
    }

    console.log("🔄 Setting up mock auth state listener")

    // Add to listeners
    this.authStateListeners.push(callback)

    // Immediately notify with current user state
    setTimeout(() => callback(this.currentMockUser), 0)

    // Return cleanup function
    return () => {
      const index = this.authStateListeners.indexOf(callback)
      if (index > -1) {
        this.authStateListeners.splice(index, 1)
      }
      console.log("🧹 Cleaned up auth state listener")
    }
  }

  async getCurrentUser() {
    return this.currentMockUser
  }

  async getCurrentUserToken(): Promise<string | null> {
    if (this.currentMockUser && this.currentMockUser.getIdToken) {
      try {
        const token = await this.currentMockUser.getIdToken()
        return token
      } catch (error) {
        console.error("❌ Error getting user token:", error)
        return null
      }
    }
    return null
  }

  cleanup() {
    this.currentMockUser = null
    this.pendingPhoneNumber = null
    this.authStateListeners = []
    console.log("🧹 AuthService cleaned up")
  }

  // Helper methods
  isFirebaseModeActive(): boolean {
    return false // Always mock mode
  }

  getDemoCredentials() {
    return DEMO_USERS
  }

  getConfigStatus() {
    return getFirebaseConfig()
  }

  // Additional mock methods for completeness
  async updateProfile(updates: { displayName?: string; photoURL?: string }) {
    if (this.currentMockUser) {
      this.currentMockUser.displayName = updates.displayName || this.currentMockUser.displayName
      this.currentMockUser.photoURL = updates.photoURL || this.currentMockUser.photoURL
      this.notifyAuthStateChange(this.currentMockUser)
      console.log("✅ Mock profile updated")
    }
  }

  async updatePassword(newPassword: string) {
    if (!this.currentMockUser) {
      throw new Error("No user signed in")
    }

    if (newPassword.length < 6) {
      throw new Error("Password should be at least 6 characters")
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    console.log("✅ Mock password updated")
  }

  async deleteAccount() {
    if (!this.currentMockUser) {
      throw new Error("No user signed in")
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("✅ Mock account deleted")
    this.currentMockUser = null
    this.notifyAuthStateChange(null)
  }
}

// Create singleton instance
let authServiceInstance: AuthService | null = null

// Server-side mock for SSR compatibility
const createMockAuthService = () => ({
  createAccount: async () => {
    throw new Error("Not available on server")
  },
  signInWithEmail: async () => {
    throw new Error("Not available on server")
  },
  sendPasswordResetEmail: async () => {
    throw new Error("Not available on server")
  },
  sendOTP: async () => {
    throw new Error("Not available on server")
  },
  verifyOTP: async () => {
    throw new Error("Not available on server")
  },
  signOut: async () => {
    throw new Error("Not available on server")
  },
  onAuthStateChanged: () => () => {},
  getCurrentUser: async () => null,
  getCurrentUserToken: async () => null,
  cleanup: () => {},
  isFirebaseModeActive: () => false,
  getDemoCredentials: () => [],
  getConfigStatus: () => ({ configured: false }),
  updateProfile: async () => {},
  updatePassword: async () => {},
  deleteAccount: async () => {},
})

// Main function to get auth service instance
export const getAuthService = (): AuthService => {
  if (typeof window === "undefined") {
    return createMockAuthService() as any
  }

  if (!authServiceInstance) {
    authServiceInstance = new AuthService()
  }

  return authServiceInstance
}

// Create and export the singleton instance
const authService = getAuthService()

// Export both named and default exports for maximum compatibility
export { authService }
export default authService
