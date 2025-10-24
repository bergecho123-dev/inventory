"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "../components/Sidebar"
import { Navbar } from "../components/Navbar"
import { InventoryTable } from "../components/InventoryTable"
import { useAuth } from "../hooks/useAuth"

export function Inventory() {
  const { token, user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    try {
      setLoading(true)
      const baseUrl = import.meta.env.VITE_API_URL || "/api"
      const res = await fetch(`${baseUrl}/inventory`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-900 via-blue-800 to-green-700">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Inventory" />
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">All Inventory Items</h2>
            </div>
            <InventoryTable items={items} loading={loading} onEdit={() => {}} onDelete={() => {}} />
          </div>
        </div>
      </div>
    </div>
  )
}
