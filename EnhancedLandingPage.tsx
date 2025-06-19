"use client"

import type React from "react"
import { useState } from "react"
import {
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  Shield,
  BarChart3,
  FileText,
  Smartphone,
  Cloud,
  Lock,
} from "lucide-react"
import { DigiProLogo } from "../Layout/DigiProLogo"
import { LoginForm } from "../Auth/LoginForm"
import { EnhancedRegisterForm } from "../Auth/EnhancedRegisterForm"

// Main component
const EnhancedLandingPage: React.FC = () => {
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")

  const features = [
    {
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      title: "Smart Invoicing",
      description: "Create professional invoices with automated calculations, GST compliance, and instant delivery.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      title: "Real-time Analytics",
      description: "Get instant insights into your business performance with live dashboards and reports.",
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Customer Management",
      description: "Organize customer data, track interactions, and build stronger relationships.",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      title: "Inventory Control",
      description: "Track stock levels, manage suppliers, and automate reorder notifications.",
    },
    {
      icon: <Smartphone className="h-8 w-8 text-blue-600" />,
      title: "Mobile Ready",
      description: "Access your business data anywhere with our responsive mobile interface.",
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Secure & Compliant",
      description: "Bank-grade security with automatic GST compliance and data backup.",
    },
  ]

  const businessTypes = [
    { name: "Automobile Dealers", icon: "🚗", users: "2,500+" },
    { name: "Medical Facilities", icon: "🏥", users: "1,800+" },
    { name: "Retail Stores", icon: "🏪", users: "5,200+" },
    { name: "Educational Institutions", icon: "🎓", users: "900+" },
    { name: "Pharmacies", icon: "💊", users: "1,200+" },
    { name: "Textile Businesses", icon: "🧵", users: "800+" },
  ]

  const testimonials = [
    {
      name: "Rajesh Kumar",
      business: "Kumar Auto Sales",
      rating: 5,
      text: "DigiPro transformed our dealership operations. Invoice generation is now instant and our inventory management is seamless.",
    },
    {
      name: "Dr. Priya Sharma",
      business: "Sharma Medical Center",
      rating: 5,
      text: "The patient billing system and medicine inventory tracking has made our clinic operations so much more efficient.",
    },
    {
      name: "Amit Patel",
      business: "Patel Textiles",
      rating: 5,
      text: "Managing our fabric inventory and customer orders has never been easier. The GST compliance features are excellent.",
    },
  ]

  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {authMode === "login" ? (
            <LoginForm onBack={() => setShowAuth(false)} onRegister={() => setAuthMode("register")} />
          ) : (
            <EnhancedRegisterForm onBack={() => setShowAuth(false)} onLogin={() => setAuthMode("login")} />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <DigiProLogo size="lg" />
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setAuthMode("login")
                  setShowAuth(true)
                }}
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode("register")
                  setShowAuth(true)
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Digitize Your Business with
              <span className="text-blue-600"> DigiPro</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The complete business management platform for modern enterprises. Streamline invoicing, inventory,
              customers, and analytics in one powerful solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setAuthMode("register")
                  setShowAuth(true)
                }}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
                Watch Demo
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              ✨ 7-day free trial • No credit card required • Setup in 5 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Run Your Business</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From invoicing to inventory management, DigiPro provides all the tools you need to digitize and grow your
              business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Businesses Across Industries</h2>
            <p className="text-lg text-gray-600">Join thousands of businesses already using DigiPro</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessTypes.map((business, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{business.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{business.name}</h3>
                    <p className="text-blue-600 font-medium">{business.users} active users</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">Real stories from real businesses</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.business}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Enterprise-Grade Security & Compliance</h2>
            <p className="text-lg text-gray-600">Your business data is protected with the highest security standards</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Lock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">256-bit SSL Encryption</h3>
              <p className="text-gray-600 text-sm">Bank-grade security for all data transmission</p>
            </div>
            <div className="text-center">
              <Cloud className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Cloud Backup</h3>
              <p className="text-gray-600 text-sm">Automatic daily backups with 99.9% uptime</p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">GST Compliant</h3>
              <p className="text-gray-600 text-sm">Fully compliant with Indian GST regulations</p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Data Privacy</h3>
              <p className="text-gray-600 text-sm">GDPR compliant with complete data protection</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using DigiPro to streamline their operations and boost productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setAuthMode("register")
                setShowAuth(true)
              }}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="border border-blue-300 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
              Schedule Demo
            </button>
          </div>
          <p className="text-blue-100 text-sm mt-4">No setup fees • Cancel anytime • 24/7 support</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <DigiProLogo size="md" className="mb-4" />
              <p className="text-gray-400 mb-4">The complete business digitization platform for modern enterprises.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>📘
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>🐦
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>💼
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Status
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DigiPro. All rights reserved. Made with ❤️ for Indian businesses.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Named export
export { EnhancedLandingPage }

// Default export
export default EnhancedLandingPage
