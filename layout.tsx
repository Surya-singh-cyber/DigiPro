import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { EnhancedAuthProvider } from "./contexts/EnhancedAuthContext"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DigiPro - Business Digitization Platform",
  description: "Complete business management and digitization solution for modern enterprises",
  generator: "DigiPro v1.0",
  keywords: "business management, digitization, invoicing, inventory, GST compliance",
  authors: [{ name: "DigiPro Team" }],
  creator: "DigiPro",
  publisher: "DigiPro",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <EnhancedAuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </EnhancedAuthProvider>
      </body>
    </html>
  )
}
