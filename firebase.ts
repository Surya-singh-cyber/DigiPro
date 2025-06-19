"use client"

// Firebase configuration - for reference only, not used for initialization
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Check if Firebase is properly configured
export const isFirebaseConfigured = () => {
  return !!(
    (
      firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId &&
      firebaseConfig.apiKey !== "your-api-key" &&
      firebaseConfig.apiKey.length > 10
    ) // Basic validation
  )
}

// Export config for debugging
export const getFirebaseConfig = () => ({
  configured: isFirebaseConfigured(),
  hasApiKey: !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "your-api-key",
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  hasAppId: !!firebaseConfig.appId,
  mode: isFirebaseConfigured() ? "Firebase" : "Mock",
})

// NO FIREBASE INITIALIZATION - PURE MOCK SYSTEM
// This completely avoids the component registration error

export const getFirebaseAuth = async () => {
  console.log("ℹ️ Firebase auth requested but using mock system")
  return null
}

export const getFirebaseApp = async () => {
  console.log("ℹ️ Firebase app requested but using mock system")
  return null
}

// Export null for backward compatibility
export const auth = null
export const app = null
export default null
