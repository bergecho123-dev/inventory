import React, { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"

export function Analytics() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const baseUrl = import.meta.env.VITE_API_URL
      const [itemsRes, activitiesRes] = await Promise.all([
        fetch(`${baseUrl}/inventory`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${baseUrl}/activity-logs`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (itemsRes.ok) {
        const itemsData = await itemsRes.json()
        setItems(itemsData)
      }

      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json()
        setActivities(activitiesData)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const totalValue = items.reduce((sum, item) => sum + item.quantity, 0)
  const averageQuantity = items.length > 0 ? Math.round(totalValue / items.length) : 0
  const lowStockCount = items.filter((item) => item.quantity <= 10).length

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Analytics & Insights" />
        <div className="flex-1 overflow-auto p-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Total Items</p>
              <p className="text-3xl font-bold text-blue-600">{items.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Total Quantity</p>
              <p className="text-3xl font-bold text-green-600">{totalValue}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Average per Item</p>
              <p className="text-3xl font-bold text-purple-600">{averageQuantity}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Low Stock Items</p>
              <p className="text-3xl font-bold text-red-600">{lowStockCount}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <InventoryChart items={items} />
            <StockLevelChart items={items} />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <ActivityChart activities={activities} />
          </div>
        </div>
      </div>
    </div>
  )
}
