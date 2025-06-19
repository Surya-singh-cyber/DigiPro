"use client"

import type React from "react"
import { Building2 } from "lucide-react"

interface DigiProLogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
  showText?: boolean
}

const DigiProLogo: React.FC<DigiProLogoProps> = ({ size = "md", className = "", showText = true }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-2 ${sizeClasses[size]}`}>
        <Building2 className="h-full w-full text-white" />
      </div>
      {showText && (
        <div>
          <h1 className={`font-bold text-gray-900 ${textSizeClasses[size]}`}>DigiPro</h1>
          {size !== "sm" && <p className="text-xs text-blue-600 font-medium">Business Platform</p>}
        </div>
      )}
    </div>
  )
}

// Named export
export { DigiProLogo }

// Default export
export default DigiProLogo
