"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { Sidebar } from "../components/Sidebar"
import { Navbar } from "../components/Navbar"
import { InventoryTable } from "../components/InventoryTable"

export function UserDashboard() {
  const { user, token } = useAuth()
  const [items, setItems] = useState([])
  const [lowStockItems, setLowStockItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")

  useEffect(() => {
    fetchInventory()
    fetchLowStockItems()
  }, [])

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (filterCategory) params.append("category", filterCategory)

      const baseUrl = import.meta.env.VITE_API_URL || "/api"
      const response = await fetch(`${baseUrl}/inventory?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error("Failed to fetch inventory:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLowStockItems = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "/api"
      const response = await fetch(`${baseUrl}/inventory/low-stock/items?threshold=10`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setLowStockItems(data)
      }
    } catch (error) {
      console.error("Failed to fetch low stock items:", error)
    }
  }

  const categories = [...new Set(items.map((item) => item.category))]

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-900 via-blue-800 to-green-700">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Inventory View" />
        <div className="flex-1 overflow-auto p-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold">Welcome, {user?.name}!</h2>
            <p className="text-blue-100 mt-2">You have read-only access to the inventory system.</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6">
              <p className="text-gray-600 text-sm">Total Items</p>
              <p className="text-3xl font-bold text-blue-600">{items.length}</p>
            </div>
            <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6">
              <p className="text-gray-600 text-sm">Low Stock Alerts</p>
              <p className="text-3xl font-bold text-red-600">{lowStockItems.length}</p>
            </div>
            <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6">
              <p className="text-gray-600 text-sm">Categories</p>
              <p className="text-3xl font-bold text-green-600">{categories.length}</p>
            </div>
          </div>

          {/* Low Stock Alert */}
          {lowStockItems.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="text-red-900 font-bold mb-2">Low Stock Alert</h3>
              <p className="text-red-700 text-sm">
                {lowStockItems.length} item(s) are running low on stock. Please notify the store manager.
              </p>
              <div className="mt-3 space-y-1">
                {lowStockItems.slice(0, 3).map((item) => (
                  <p key={item.id} className="text-red-700 text-sm">
                    • {item.name} ({item.quantity} {item.unit})
                  </p>
                ))}
                {lowStockItems.length > 3 && (
                  <p className="text-red-700 text-sm">• ... and {lowStockItems.length - 3} more</p>
                )}
              </div>
            </div>
          )}

          {/* Search and Filter */}
            <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Items</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    fetchInventory()
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Search by item name..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value)
                    fetchInventory()
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">All Inventory Items</h2>
            <InventoryTable items={items} loading={loading} onEdit={() => {}} onDelete={() => {}} />
          </div>
        </div>
      </div>
    </div>
  )
}
