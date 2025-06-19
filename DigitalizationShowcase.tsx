"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Users,
  FileText,
  Calculator,
  CreditCard,
  BarChart3,
  Shield,
  CheckCircle,
  Award,
  Target,
  Zap,
} from "lucide-react"

export function DigitalizationShowcase() {
  const showcaseFeatures = [
    {
      category: "Financial Management",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "bg-green-500",
      features: [
        "Real-time profit & loss tracking",
        "Revenue analytics with forecasting",
        "Expense categorization & control",
        "Cash flow management",
        "Financial health scoring",
        "Multi-currency support",
      ],
    },
    {
      category: "Tax & Compliance",
      icon: <Calculator className="h-6 w-6" />,
      color: "bg-blue-500",
      features: [
        "Automated GST calculations",
        "GST return filing assistance",
        "ITR preparation & e-filing",
        "TDS management & filing",
        "Compliance calendar & alerts",
        "Audit trail maintenance",
      ],
    },
    {
      category: "Employee & Payroll",
      icon: <Users className="h-6 w-6" />,
      color: "bg-purple-500",
      features: [
        "Automated salary distribution",
        "Attendance & leave management",
        "Payroll processing & slips",
        "PF & ESI calculations",
        "Performance tracking",
        "Employee self-service portal",
      ],
    },
    {
      category: "Payment & Billing",
      icon: <CreditCard className="h-6 w-6" />,
      color: "bg-orange-500",
      features: [
        "Multi-payment gateway integration",
        "Automated payment reminders",
        "Outstanding amount tracking",
        "Digital invoice generation",
        "Payment analytics & insights",
        "Recurring billing automation",
      ],
    },
    {
      category: "Inventory & Operations",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "bg-red-500",
      features: [
        "Real-time inventory tracking",
        "Automated reorder alerts",
        "Multi-location stock sync",
        "Barcode & QR code support",
        "Supplier management",
        "Demand forecasting",
      ],
    },
    {
      category: "Digital Documentation",
      icon: <FileText className="h-6 w-6" />,
      color: "bg-indigo-500",
      features: [
        "Paperless invoice system",
        "Digital signature support",
        "Document management system",
        "Automated backup & sync",
        "Template customization",
        "Watermark & branding",
      ],
    },
  ]

  const businessBenefits = [
    {
      title: "Complete Digitalization",
      description: "Transform every aspect of your business operations from manual to digital",
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
    },
    {
      title: "Single Platform Solution",
      description: "Manage everything in one place - no need for multiple software solutions",
      icon: <Target className="h-8 w-8 text-blue-500" />,
    },
    {
      title: "Industry Compliance",
      description: "Stay compliant with all Indian tax laws, GST regulations, and industry standards",
      icon: <Shield className="h-8 w-8 text-green-500" />,
    },
    {
      title: "Scalable Growth",
      description: "Grow from small business to enterprise with features that scale with you",
      icon: <Award className="h-8 w-8 text-purple-500" />,
    },
  ]

  return (
    <div className="bg-white">
      {/* Detailed Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-100 text-emerald-800">Complete Feature Set</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything Your Business Needs to Go Digital</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From basic operations to advanced analytics, our platform covers every aspect of business management with
              specialized features for each industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {showcaseFeatures.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${category.color} text-white`}>{category.icon}</div>
                    <CardTitle className="text-lg">{category.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Business Benefits Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Complete Digitalization?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transform your business operations and achieve unprecedented efficiency, compliance, and growth with our
              comprehensive digital platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {businessBenefits.map((benefit, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">{benefit.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Success Metrics */}
      <div className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Proven Results Across Industries</h2>
          <p className="text-xl text-emerald-100 mb-12">
            Businesses using our platform see immediate improvements in efficiency, compliance, and profitability.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">10,000+</div>
              <div className="text-emerald-100">Businesses Digitalized</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">₹500Cr+</div>
              <div className="text-emerald-100">Revenue Processed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-emerald-100">Uptime Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-emerald-100">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
