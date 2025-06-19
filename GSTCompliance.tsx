"use client"

import type React from "react"
import { useState } from "react"
import { FileText, Download, Upload, Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react"

interface GSTReturn {
  id: string
  period: string
  type: string
  status: "draft" | "filed" | "pending"
  dueDate: Date
  amount: number
  filedDate?: Date
}

export const GSTCompliance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"returns" | "reports" | "settings">("returns")

  // Mock data - would come from API in real app
  const [gstReturns] = useState<GSTReturn[]>([
    {
      id: "1",
      period: "January 2024",
      type: "GSTR-1",
      status: "filed",
      dueDate: new Date("2024-02-11"),
      amount: 25000,
      filedDate: new Date("2024-02-10"),
    },
    {
      id: "2",
      period: "January 2024",
      type: "GSTR-3B",
      status: "filed",
      dueDate: new Date("2024-02-20"),
      amount: 18000,
      filedDate: new Date("2024-02-19"),
    },
    {
      id: "3",
      period: "February 2024",
      type: "GSTR-1",
      status: "pending",
      dueDate: new Date("2024-03-11"),
      amount: 32000,
    },
    {
      id: "4",
      period: "February 2024",
      type: "GSTR-3B",
      status: "draft",
      dueDate: new Date("2024-03-20"),
      amount: 24000,
    },
  ])

  const getStatusIcon = (status: GSTReturn["status"]) => {
    switch (status) {
      case "filed":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "draft":
        return <AlertCircle className="h-5 w-5 text-gray-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status: GSTReturn["status"]) => {
    switch (status) {
      case "filed":
        return "bg-emerald-100 text-emerald-800"
      case "pending":
        return "bg-amber-100 text-amber-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const TabButton = ({ id, label, icon: Icon }: { id: string; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(id as any)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === id ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">GST Compliance</h1>
          <p className="text-gray-600">Manage GST returns and compliance</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Generate Return</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex space-x-2">
            <TabButton id="returns" label="GST Returns" icon={FileText} />
            <TabButton id="reports" label="Reports" icon={Download} />
            <TabButton id="settings" label="Settings" icon={Calendar} />
          </div>
        </div>

        <div className="p-6">
          {activeTab === "returns" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-700">Filed Returns</p>
                      <p className="text-2xl font-bold text-emerald-900">2</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-700">Pending Returns</p>
                      <p className="text-2xl font-bold text-amber-900">1</p>
                    </div>
                    <Clock className="h-8 w-8 text-amber-600" />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Draft Returns</p>
                      <p className="text-2xl font-bold text-gray-900">1</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-gray-600" />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Period</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Return Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Due Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Filed Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gstReturns.map((gstReturn) => (
                      <tr key={gstReturn.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 font-medium text-gray-900">{gstReturn.period}</td>
                        <td className="py-4 px-4 text-gray-600">{gstReturn.type}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(gstReturn.status)}
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                                gstReturn.status,
                              )}`}
                            >
                              {gstReturn.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium text-gray-900">₹{gstReturn.amount.toLocaleString()}</td>
                        <td className="py-4 px-4 text-gray-600">{gstReturn.dueDate.toLocaleDateString("en-IN")}</td>
                        <td className="py-4 px-4 text-gray-600">
                          {gstReturn.filedDate?.toLocaleDateString("en-IN") || "-"}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="View">
                              <FileText className="h-4 w-4" />
                            </button>
                            <button
                              className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="text-center py-12">
              <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">GST Reports</h3>
              <p className="text-gray-600 mb-6">Generate and download GST reports</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Generate Report
              </button>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">GST Configuration</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
                    <input
                      type="text"
                      value="27AAAPZ2271G1ZW"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Regular Business</option>
                      <option>Composition Scheme</option>
                      <option>Input Service Distributor</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Return Filing</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-700">Auto-generate GSTR-1</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        defaultChecked
                      />
                      <span className="ml-2 text-sm text-gray-700">Auto-generate GSTR-3B</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Email reminders for due dates</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
