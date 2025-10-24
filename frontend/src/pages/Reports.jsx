"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { Sidebar } from "../components/Sidebar"
import { Navbar } from "../components/Navbar"

export function Reports() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [reportType, setReportType] = useState("inventory")
  const [lendings, setLendings] = useState([])

  useEffect(() => {
    fetchData()
  }, [reportType])

  const fetchData = async () => {
    try {
      setLoading(true)
      const baseUrl = import.meta.env.VITE_API_URL || "/api"
      const [invRes, lendRes] = await Promise.all([
        fetch(`${baseUrl}/inventory`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${baseUrl}/lendings`, { headers: { Authorization: `Bearer ${token}` } }),
      ])
      if (invRes.ok) setItems(await invRes.json())
      if (lendRes.ok) setLendings(await lendRes.json())
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = () => {
    const headers = ["Item Name", "Category", "Quantity", "Unit", "Location"]
    const rows = items.map((item) => [item.name, item.category, item.quantity, item.unit, item.location])

    let csv = headers.join(",") + "\n"
    rows.forEach((row) => {
      csv += row.map((cell) => `"${cell}"`).join(",") + "\n"
    })

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `inventory-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const handleExportJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      totalItems: items.length,
      items: items,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `inventory-report-${new Date().toISOString().split("T")[0]}.json`
    a.click()
  }

  const totalValue = items.reduce((sum, item) => sum + item.quantity, 0)
  const lowStockCount = items.filter((item) => item.quantity <= 10).length
  const categoryBreakdown = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.quantity
    return acc
  }, {})

  const filteredItems = reportType === "lowstock" ? items.filter((item) => item.quantity <= 10) : items
  const totalLendings = lendings.length
  const currentlyOut = lendings.filter((l) => !l.returned_at).length
  const totalLentQty = lendings.reduce((s, l) => s + l.quantity, 0)

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-900 via-blue-800 to-green-700">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Reports" />
        <div className="flex-1 overflow-auto p-6">
          {/* Report Type Selection */}
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Report Type</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => setReportType("inventory")}
                className={`px-4 py-2 rounded-lg transition ${
                  reportType === "inventory" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Full Inventory
              </button>
              <button
                onClick={() => setReportType("lowstock")}
                className={`px-4 py-2 rounded-lg transition ${
                  reportType === "lowstock" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Low Stock Items
              </button>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6">
              <p className="text-gray-600 text-sm">Total Items</p>
              <p className="text-3xl font-bold text-blue-600">{items.length}</p>
            </div>
            <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6">
              <p className="text-gray-600 text-sm">Total Quantity</p>
              <p className="text-3xl font-bold text-green-600">{totalValue}</p>
            </div>
            <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6">
              <p className="text-gray-600 text-sm">Low Stock Items</p>
              <p className="text-3xl font-bold text-red-600">{lowStockCount}</p>
            </div>
            <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 md:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Total Lending Records</p>
                  <p className="text-3xl font-bold text-blue-600">{totalLendings}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Currently Out</p>
                  <p className="text-3xl font-bold text-purple-600">{currentlyOut}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Quantity Lent</p>
                  <p className="text-3xl font-bold text-emerald-600">{totalLentQty}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Category Breakdown</h2>
            <div className="space-y-3">
              {Object.entries(categoryBreakdown).map(([category, quantity]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-gray-700">{category}</span>
                  <div className="flex items-center space-x-4">
                    <div className="w-48 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(quantity / totalValue) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-900 font-medium w-12 text-right">{quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {reportType === "lowstock" ? "Low Stock Items" : "All Items"}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Item Name</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Category</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Quantity</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Unit</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-900">{item.name}</td>
                      <td className="px-4 py-2 text-gray-600">{item.category}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            item.quantity <= 10 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-600">{item.unit}</td>
                      <td className="px-4 py-2 text-gray-600">{item.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Export Report</h2>
            <div className="flex space-x-4">
              <button
                onClick={handleExportCSV}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
              >
                Export as CSV
              </button>
              <button
                onClick={handleExportJSON}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
              >
                Export as JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
