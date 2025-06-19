"use client"

import { useState, useEffect } from "react"
import { getFirebaseConfig } from "../config/firebase"

export const useFirebase = () => {
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFirebaseMode, setIsFirebaseMode] = useState(false)
  const [configStatus, setConfigStatus] = useState<any>(null)

  useEffect(() => {
    const initializeMockSystem = () => {
      try {
        const config = getFirebaseConfig()

        // Always use mock mode to avoid Firebase errors
        setIsFirebaseMode(false)
        setConfigStatus(config)
        setIsInitialized(true)
        setError(null)

        console.log("✅ DigiPro Mock Authentication System Ready")
        console.log("🎯 Mode: Pure Mock (No Firebase)")
        console.log("📊 Config Status:", config)
      } catch (err: any) {
        setError(err.message)
        setIsInitialized(true)
        console.error("❌ Mock system initialization error:", err)
      }
    }

    initializeMockSystem()
  }, [])

  return {
    isInitialized,
    error,
    isFirebaseMode: false, // Always false to ensure mock mode
    configStatus,
    auth: null, // No Firebase auth
  }
}
