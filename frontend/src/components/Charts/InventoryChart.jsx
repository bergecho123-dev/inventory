"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function InventoryChart({ items = [] }) {
  const categoryData = items.reduce((acc, item) => {
    const existing = acc.find((c) => c.category === item.category)
    if (existing) {
      existing.quantity += item.quantity
      existing.items += 1
    } else {
      acc.push({ category: item.category, quantity: item.quantity, items: 1 })
    }
    return acc
  }, [])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Inventory by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={categoryData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="quantity" fill="#3b82f6" name="Total Quantity" />
          <Bar dataKey="items" fill="#10b981" name="Number of Items" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
