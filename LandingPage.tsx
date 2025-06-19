"use client"

import type React from "react"
import { useState } from "react"
import {
  Car,
  FileText,
  Package,
  Users,
  BarChart3,
  Shield,
  Check,
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
} from "lucide-react"

interface LandingPageProps {
  onGetStarted: () => void
}

// Configuration object for easy editing
const CONFIG = {
  company: {
    name: "BizFlow Pro",
    tagline: "Complete Business Management Solution",
    description:
      "Streamline your automobile business with professional GST billing, inventory management, and comprehensive business analytics.",
    phone: "+91-9876543210",
    email: "support@bizflowpro.com",
    address: "123 Business Park, Tech City, Mumbai - 400001, India",
  },
  pricing: {
    basic: {
      name: "Basic",
      price: "₹999",
      period: "/month",
      features: [
        "Up to 100 invoices/month",
        "Basic inventory management",
        "GST compliance",
        "Email support",
        "Mobile app access",
      ],
    },
    professional: {
      name: "Professional",
      price: "₹1,999",
      period: "/month",
      features: [
        "Unlimited invoices",
        "Advanced inventory management",
        "Customer management",
        "Analytics & reports",
        "Priority support",
        "API access",
        "Custom branding",
      ],
      popular: true,
    },
    enterprise: {
      name: "Enterprise",
      price: "₹4,999",
      period: "/month",
      features: [
        "Everything in Professional",
        "Multi-location support",
        "Advanced analytics",
        "Dedicated support",
        "Custom integrations",
        "White-label solution",
        "Training & onboarding",
      ],
    },
  },
  legal: {
    privacyPolicy: `
# Privacy Policy

Last updated: ${new Date().toLocaleDateString()}

## Information We Collect
- Business information for billing and invoicing
- Contact details for communication
- Usage data to improve our services

## How We Use Information
- To provide and maintain our services
- To process transactions and send invoices
- To communicate with you about our services

## Data Security
We implement appropriate security measures to protect your information against unauthorized access, alteration, disclosure, or destruction.

## Contact Us
If you have questions about this Privacy Policy, please contact us at privacy@bizflowpro.com
    `,
    termsAndConditions: `
# Terms and Conditions

Last updated: ${new Date().toLocaleDateString()}

## Acceptance of Terms
By using BizFlow Pro, you agree to these terms and conditions.

## Service Description
BizFlow Pro provides business management software including billing, inventory, and customer management tools.

## User Responsibilities
- Provide accurate information
- Maintain account security
- Comply with applicable laws

## Payment Terms
- Subscription fees are billed monthly/annually
- Refunds subject to our refund policy
- Prices may change with 30 days notice

## Limitation of Liability
Our liability is limited to the amount paid for our services in the preceding 12 months.

## Contact Information
For questions about these terms, contact us at legal@bizflowpro.com
    `,
  },
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  const features = [
    {
      icon: Car,
      title: "Automobile Focused",
      description: "Specialized features for car dealers, service centers, and spare parts businesses",
    },
    {
      icon: FileText,
      title: "Professional Invoicing",
      description: "GST-compliant invoices with custom branding and automated numbering",
    },
    {
      icon: Package,
      title: "Smart Inventory",
      description: "Track parts, vehicles, and products with low-stock alerts and auto-reorder",
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "Comprehensive customer profiles with vehicle history and service records",
    },
    {
      icon: BarChart3,
      title: "Business Analytics",
      description: "Real-time insights into sales, inventory, and business performance",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Bank-grade security with GST compliance and data protection",
    },
  ]

  const testimonials = [
    {
      name: "Rajesh Kumar",
      business: "Kumar Auto Sales",
      rating: 5,
      comment: "BizFlow Pro transformed our billing process. GST compliance is now effortless!",
    },
    {
      name: "Priya Sharma",
      business: "Sharma Motors",
      rating: 5,
      comment: "The inventory management feature saved us thousands in overstocking costs.",
    },
    {
      name: "Amit Singh",
      business: "Singh Spare Parts",
      rating: 5,
      comment: "Customer management and service history tracking is exactly what we needed.",
    },
  ]

  const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; content: string }> = ({
    isOpen,
    onClose,
    title,
    content,
  }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="p-6">
            <div className="prose max-w-none">
              {content.split("\n").map((line, index) => {
                if (line.startsWith("# ")) {
                  return (
                    <h1 key={index} className="text-2xl font-bold mb-4">
                      {line.substring(2)}
                    </h1>
                  )
                } else if (line.startsWith("## ")) {
                  return (
                    <h2 key={index} className="text-xl font-semibold mb-3 mt-6">
                      {line.substring(3)}
                    </h2>
                  )
                } else if (line.trim() === "") {
                  return <br key={index} />
                } else {
                  return (
                    <p key={index} className="mb-2">
                      {line}
                    </p>
                  )
                }
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">{CONFIG.company.name}</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900">
                Reviews
              </a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </a>
              <button
                onClick={onGetStarted}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-gray-900">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 hover:text-gray-900">
                  Features
                </a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900">
                  Pricing
                </a>
                <a href="#testimonials" className="text-gray-600 hover:text-gray-900">
                  Reviews
                </a>
                <a href="#contact" className="text-gray-600 hover:text-gray-900">
                  Contact
                </a>
                <button
                  onClick={onGetStarted}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">{CONFIG.company.tagline}</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">{CONFIG.company.description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Run Your Business
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed specifically for automobile businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your business needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(CONFIG.pricing).map(([key, plan]) => (
              <div
                key={key}
                className={`bg-white p-8 rounded-xl shadow-sm border-2 ${
                  plan.popular ? "border-blue-500 relative" : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onGetStarted}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Businesses Across India</h2>
            <p className="text-xl text-gray-600">See what our customers have to say</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.comment}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.business}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600">Have questions? We're here to help</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600">{CONFIG.company.phone}</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">{CONFIG.company.email}</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
              <p className="text-gray-600">{CONFIG.company.address}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">{CONFIG.company.name}</span>
              </div>
              <p className="text-gray-400">Complete business management solution for automobile businesses.</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Training
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
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button onClick={() => setShowPrivacyPolicy(true)} className="hover:text-white text-left">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowTerms(true)} className="hover:text-white text-left">
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {CONFIG.company.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <Modal
        isOpen={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
        title="Privacy Policy"
        content={CONFIG.legal.privacyPolicy}
      />

      <Modal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="Terms and Conditions"
        content={CONFIG.legal.termsAndConditions}
      />
    </div>
  )
}
