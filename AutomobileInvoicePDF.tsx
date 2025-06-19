"use client"
import { forwardRef } from "react"

interface InvoiceData {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  customer: {
    name: string
    phone: string
    email?: string
    address: string
    gstin?: string
  }
  agency: {
    name: string
    ownerName: string
    address: string
    city: string
    state: string
    pincode: string
    phone: string
    email: string
    gstin: string
    logoUrl?: string
    signatureUrl?: string
  }
  items: Array<{
    name: string
    description?: string
    quantity: number
    rate: number
    gstRate: number
    amount: number
    engineNumber?: string
    chassisNumber?: string
    motorNumber?: string
    serialNumber?: string
  }>
  subtotal: number
  gstAmount: number
  rtoCharges: number
  insuranceCharges: number
  hypothecationCharges: number
  discountAmount: number
  totalAmount: number
  notes?: string
  termsAndConditions: string
  footerText: string
  bankDetails?: {
    bankName: string
    accountNumber: string
    ifscCode: string
    accountHolderName: string
  }
}

interface AutomobileInvoicePDFProps {
  invoiceData: InvoiceData
}

export const AutomobileInvoicePDF = forwardRef<HTMLDivElement, AutomobileInvoicePDFProps>(({ invoiceData }, ref) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Calculate GST breakdown
  const gstBreakdown = Array.from(new Set(invoiceData.items.map((item) => item.gstRate))).map((rate) => {
    const itemsWithRate = invoiceData.items.filter((item) => item.gstRate === rate)
    const taxableAmount = itemsWithRate.reduce((sum, item) => sum + item.amount, 0)
    const gstAmount = (taxableAmount * rate) / 100
    return { rate, taxableAmount, gstAmount }
  })

  return (
    <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div className="border-b-2 border-gray-300 pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {invoiceData.agency.logoUrl && (
              <img
                src={invoiceData.agency.logoUrl || "/placeholder.svg"}
                alt="Agency Logo"
                className="h-16 w-auto mb-4"
              />
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{invoiceData.agency.name}</h1>
            <p className="text-gray-600 text-sm">Automobile Sales & Service</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">INVOICE</h2>
            <div className="text-sm space-y-1">
              <div>
                <strong>Invoice #:</strong> {invoiceData.invoiceNumber}
              </div>
              <div>
                <strong>Date:</strong> {formatDate(invoiceData.invoiceDate)}
              </div>
              <div>
                <strong>Due Date:</strong> {formatDate(invoiceData.dueDate)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seller and Buyer Details */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Seller Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">SELLER DETAILS</h3>
          <div className="space-y-1 text-sm">
            <div>
              <strong>{invoiceData.agency.name}</strong>
            </div>
            <div>Proprietor: {invoiceData.agency.ownerName}</div>
            <div>{invoiceData.agency.address}</div>
            <div>
              {invoiceData.agency.city}, {invoiceData.agency.state} - {invoiceData.agency.pincode}
            </div>
            <div>Phone: {invoiceData.agency.phone}</div>
            <div>Email: {invoiceData.agency.email}</div>
            <div>
              <strong>GSTIN:</strong> {invoiceData.agency.gstin}
            </div>
          </div>
        </div>

        {/* Buyer Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">BUYER DETAILS</h3>
          <div className="space-y-1 text-sm">
            <div>
              <strong>{invoiceData.customer.name}</strong>
            </div>
            <div>{invoiceData.customer.address}</div>
            <div>Phone: {invoiceData.customer.phone}</div>
            {invoiceData.customer.email && <div>Email: {invoiceData.customer.email}</div>}
            {invoiceData.customer.gstin && (
              <div>
                <strong>GSTIN:</strong> {invoiceData.customer.gstin}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">S.No.</th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Description</th>
              <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold">Qty</th>
              <th className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Rate</th>
              <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold">GST%</th>
              <th className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-3 py-2 text-sm">{index + 1}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm">
                  <div>
                    <strong>{item.name}</strong>
                    {item.description && <div className="text-gray-600">{item.description}</div>}
                    {item.engineNumber && (
                      <div className="mt-2 text-xs space-y-1">
                        <div>
                          <strong>Engine No:</strong> {item.engineNumber}
                        </div>
                        <div>
                          <strong>Chassis No:</strong> {item.chassisNumber}
                        </div>
                        {item.motorNumber && (
                          <div>
                            <strong>Motor No:</strong> {item.motorNumber}
                          </div>
                        )}
                        {item.serialNumber && (
                          <div>
                            <strong>Serial No:</strong> {item.serialNumber}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center text-sm">{item.quantity}</td>
                <td className="border border-gray-300 px-3 py-2 text-right text-sm">{formatCurrency(item.rate)}</td>
                <td className="border border-gray-300 px-3 py-2 text-center text-sm">{item.gstRate}%</td>
                <td className="border border-gray-300 px-3 py-2 text-right text-sm font-medium">
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* GST Breakdown */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">GST BREAKDOWN</h4>
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-2 py-1 text-left">GST Rate</th>
                <th className="border border-gray-300 px-2 py-1 text-right">Taxable Amount</th>
                <th className="border border-gray-300 px-2 py-1 text-right">GST Amount</th>
              </tr>
            </thead>
            <tbody>
              {gstBreakdown.map((gst, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-2 py-1">{gst.rate}%</td>
                  <td className="border border-gray-300 px-2 py-1 text-right">{formatCurrency(gst.taxableAmount)}</td>
                  <td className="border border-gray-300 px-2 py-1 text-right">{formatCurrency(gst.gstAmount)}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="border border-gray-300 px-2 py-1">Total</td>
                <td className="border border-gray-300 px-2 py-1 text-right">{formatCurrency(invoiceData.subtotal)}</td>
                <td className="border border-gray-300 px-2 py-1 text-right">{formatCurrency(invoiceData.gstAmount)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Amount Summary */}
        <div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">{formatCurrency(invoiceData.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Amount:</span>
                <span className="font-medium">{formatCurrency(invoiceData.gstAmount)}</span>
              </div>
              {invoiceData.rtoCharges > 0 && (
                <div className="flex justify-between">
                  <span>RTO Charges:</span>
                  <span className="font-medium">{formatCurrency(invoiceData.rtoCharges)}</span>
                </div>
              )}
              {invoiceData.insuranceCharges > 0 && (
                <div className="flex justify-between">
                  <span>Insurance Charges:</span>
                  <span className="font-medium">{formatCurrency(invoiceData.insuranceCharges)}</span>
                </div>
              )}
              {invoiceData.hypothecationCharges > 0 && (
                <div className="flex justify-between">
                  <span>Hypothecation Charges:</span>
                  <span className="font-medium">{formatCurrency(invoiceData.hypothecationCharges)}</span>
                </div>
              )}
              {invoiceData.discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span className="font-medium">-{formatCurrency(invoiceData.discountAmount)}</span>
                </div>
              )}
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">{formatCurrency(invoiceData.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      {invoiceData.bankDetails && (
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">BANK DETAILS</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div>
                  <strong>Bank Name:</strong> {invoiceData.bankDetails.bankName}
                </div>
                <div>
                  <strong>Account Holder:</strong> {invoiceData.bankDetails.accountHolderName}
                </div>
              </div>
              <div>
                <div>
                  <strong>Account Number:</strong> {invoiceData.bankDetails.accountNumber}
                </div>
                <div>
                  <strong>IFSC Code:</strong> {invoiceData.bankDetails.ifscCode}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      {invoiceData.notes && (
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">NOTES</h4>
          <div className="bg-yellow-50 p-3 rounded-lg text-sm">{invoiceData.notes}</div>
        </div>
      )}

      {/* Terms and Conditions */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">TERMS AND CONDITIONS</h4>
        <div className="text-xs text-gray-700 space-y-1">
          {invoiceData.termsAndConditions.split("\n").map((term, index) => (
            <div key={index}>{term}</div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-300 pt-6">
        <div className="flex justify-between items-end">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900 mb-2">Customer Signature</div>
            <div className="border-t border-gray-400 w-32"></div>
          </div>

          <div className="text-center">
            <div className="text-sm font-medium text-gray-900 mb-2">Authorized Signatory</div>
            {invoiceData.agency.signatureUrl ? (
              <div>
                <img
                  src={invoiceData.agency.signatureUrl || "/placeholder.svg"}
                  alt="Digital Signature"
                  className="h-12 w-auto mx-auto mb-2"
                />
                <div className="border-t border-gray-400 w-32"></div>
              </div>
            ) : (
              <div className="border-t border-gray-400 w-32"></div>
            )}
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">{invoiceData.footerText}</p>
        </div>
      </div>
    </div>
  )
})

AutomobileInvoicePDF.displayName = "AutomobileInvoicePDF"
