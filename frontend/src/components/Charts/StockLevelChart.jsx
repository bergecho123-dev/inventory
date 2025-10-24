"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export function StockLevelChart({ items = [] }) {
  const stockLevels = {
    "In Stock": items.filter((i) => i.quantity > 20).length,
    "Low Stock": items.filter((i) => i.quantity > 0 && i.quantity <= 20).length,
    "Out of Stock": items.filter((i) => i.quantity === 0).length,
  }

  const data = Object.entries(stockLevels).map(([name, value]) => ({ name, value }))

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"]

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Stock Level Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
