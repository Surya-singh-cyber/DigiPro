"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, User, Shield, Settings, Crown, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const demoUsers = [
  {
    email: "admin@digipro.com",
    password: "admin123",
    role: "Admin",
    icon: Shield,
    description: "Full system access",
  },
  {
    email: "demo@digipro.com",
    password: "demo123",
    role: "Demo User",
    icon: User,
    description: "Standard user access",
  },
  {
    email: "manager@digipro.com",
    password: "manager123",
    role: "Manager",
    icon: Settings,
    description: "Management features",
  },
  {
    email: "owner@digipro.com",
    password: "owner123",
    role: "Owner",
    icon: Crown,
    description: "Business owner access",
  },
  {
    email: "test@example.com",
    password: "test123",
    role: "Test User",
    icon: Building,
    description: "Testing purposes",
  },
]

export default function DemoCredentials() {
  const copyCredentials = (email: string, password: string) => {
    navigator.clipboard.writeText(`${email} / ${password}`)
    toast.success("Credentials copied to clipboard!")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Demo Credentials
        </CardTitle>
        <CardDescription>
          DigiPro is running in demo mode. Use these credentials to test the application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {demoUsers.map((user, index) => {
          const IconComponent = user.icon
          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <IconComponent className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="font-medium">{user.email}</div>
                  <div className="text-sm text-gray-500">{user.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{user.role}</Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyCredentials(user.email, user.password)}
                  className="h-8"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )
        })}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Additional Demo Features:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • Phone OTP: Use <code className="bg-blue-100 px-1 rounded">123456</code> as verification code
            </li>
            <li>• All features work in demo mode without external dependencies</li>
            <li>• Data is simulated and resets on page refresh</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
