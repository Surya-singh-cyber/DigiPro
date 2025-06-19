"use client"

import type React from "react"

import { useState } from "react"
import { DigiProLogo } from "../Layout/DigiProLogo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Building2,
  Car,
  GraduationCap,
  Pill,
  ShoppingBag,
  Shirt,
  BarChart3,
  FileText,
  Users,
  Package,
  CreditCard,
  Shield,
  Globe,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
} from "lucide-react"

interface ProductionLandingPageProps {
  onGetStarted: () => void
}

export const ProductionLandingPage: React.FC<ProductionLandingPageProps> = ({ onGetStarted }) => {
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null)

  const businessTypes = [
    {
      id: "automobile",
      name: "Automobile",
      icon: Car,
      description: "Vehicle sales, service, spare parts management",
      features: ["Vehicle tracking", "Service scheduling", "Parts inventory", "Customer history"],
    },
    {
      id: "medical",
      name: "Medical",
      icon: Building2,
      description: "Clinics, hospitals, medical equipment",
      features: ["Patient management", "Appointment scheduling", "Medical inventory", "Billing"],
    },
    {
      id: "retail",
      name: "Retail",
      icon: ShoppingBag,
      description: "Shops, stores, e-commerce businesses",
      features: ["POS system", "Inventory management", "Customer loyalty", "Sales analytics"],
    },
    {
      id: "school",
      name: "Education",
      icon: GraduationCap,
      description: "Schools, colleges, training institutes",
      features: ["Student management", "Fee collection", "Staff payroll", "Academic tracking"],
    },
    {
      id: "pharmacy",
      name: "Pharmacy",
      icon: Pill,
      description: "Medical stores, drug distribution",
      features: ["Medicine inventory", "Expiry tracking", "Prescription management", "GST compliance"],
    },
    {
      id: "textile",
      name: "Textile",
      icon: Shirt,
      description: "Garment manufacturing, fabric trading",
      features: ["Fabric inventory", "Order management", "Production tracking", "Quality control"],
    },
  ]

  const features = [
    {
      icon: FileText,
      title: "Smart Invoicing",
      description: "Generate professional invoices with GST compliance and automated calculations",
    },
    {
      icon: Package,
      title: "Inventory Management",
      description: "Track stock levels, manage suppliers, and get low-stock alerts in real-time",
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "Maintain customer database with purchase history and payment tracking",
    },
    {
      icon: BarChart3,
      title: "Business Analytics",
      description: "Get insights into sales, profits, and business performance with detailed reports",
    },
    {
      icon: CreditCard,
      title: "Payment Tracking",
      description: "Monitor payments, outstanding amounts, and generate payment reminders",
    },
    {
      icon: Shield,
      title: "GST Compliance",
      description: "Automated GST calculations, returns filing, and tax compliance management",
    },
  ]

  const benefits = [
    "Reduce manual work by 80%",
    "Increase business efficiency",
    "Real-time business insights",
    "GST compliance made easy",
    "Professional invoicing",
    "Inventory optimization",
    "Customer relationship management",
    "Multi-location support",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <DigiProLogo size="md" />
            <div className="flex items-center space-x-4">
              <Button variant="ghost">Features</Button>
              <Button variant="ghost">Pricing</Button>
              <Button variant="ghost">Support</Button>
              <Button onClick={onGetStarted}>Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Complete Business
              <span className="text-blue-600"> Digitization</span>
              <br />
              Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Transform your business with DigiPro - the all-in-one solution for invoicing, inventory management,
              customer relations, and business analytics. Built specifically for Indian businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={onGetStarted} className="text-lg px-8 py-4">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                Watch Demo
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                7-day free trial
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Setup in 5 minutes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Types */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Every Business Type</h2>
            <p className="text-xl text-gray-600">Specialized features and workflows designed for your industry</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businessTypes.map((business) => {
              const Icon = business.icon
              return (
                <Card
                  key={business.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedBusiness === business.id ? "ring-2 ring-blue-500 shadow-lg" : ""
                  }`}
                  onClick={() => setSelectedBusiness(business.id)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{business.name}</CardTitle>
                        <CardDescription>{business.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {business.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features for Modern Business</h2>
            <p className="text-xl text-gray-600">Everything you need to run your business efficiently and profitably</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose DigiPro?</h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of businesses that have transformed their operations with DigiPro's comprehensive
                business management platform.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 mx-auto mb-6 opacity-80" />
                <h3 className="text-2xl font-bold mb-4">Boost Your Business Growth</h3>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="text-3xl font-bold">80%</div>
                    <div className="text-sm opacity-80">Time Saved</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">95%</div>
                    <div className="text-sm opacity-80">Accuracy</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">50%</div>
                    <div className="text-sm opacity-80">Cost Reduction</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">24/7</div>
                    <div className="text-sm opacity-80">Support</div>
                  </div>
                </div>
                <Button size="lg" variant="secondary" onClick={onGetStarted} className="w-full">
                  Start Your Free Trial
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Businesses Across India</h2>
            <p className="text-xl text-gray-600">See what our customers say about DigiPro</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Rajesh Kumar",
                business: "Kumar Auto Parts",
                type: "Automobile",
                rating: 5,
                testimonial:
                  "DigiPro transformed our auto parts business. Inventory management is now effortless and our billing is 100% GST compliant.",
              },
              {
                name: "Dr. Priya Sharma",
                business: "Sharma Medical Center",
                type: "Medical",
                rating: 5,
                testimonial:
                  "Patient management and billing has never been easier. DigiPro helps us focus on patient care while handling all the paperwork.",
              },
              {
                name: "Amit Patel",
                business: "Patel Textiles",
                type: "Textile",
                rating: 5,
                testimonial:
                  "From fabric inventory to order management, DigiPro covers everything. Our business efficiency has increased by 60%.",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>
                    {testimonial.business} • {testimonial.type}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 italic">"{testimonial.testimonial}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses using DigiPro to streamline operations and boost growth
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={onGetStarted} className="text-lg px-8 py-4">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600"
            >
              Schedule Demo
            </Button>
          </div>
          <div className="mt-8 text-sm opacity-80">No setup fees • Cancel anytime • 24/7 support</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <DigiProLogo size="md" className="mb-4" />
              <p className="text-gray-400 mb-4">
                Complete business digitization platform for modern Indian businesses.
              </p>
              <div className="flex space-x-4">
                <Globe className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400">Made in India</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>Integrations</li>
                <li>API</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>Contact Us</li>
                <li>Training</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DigiPro. All rights reserved. Built with ❤️ for Indian businesses.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
