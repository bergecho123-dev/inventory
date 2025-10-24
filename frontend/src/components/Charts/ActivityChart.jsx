"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function ActivityChart({ activities = [] }) {
  // Group activities by date
  const activityByDate = activities.reduce((acc, activity) => {
    const date = new Date(activity.created_at).toLocaleDateString()
    const existing = acc.find((a) => a.date === date)
    if (existing) {
      existing.count += 1
    } else {
      acc.push({ date, count: 1 })
    }
    return acc
  }, [])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Activity Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={activityByDate}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#3b82f6" name="Activities" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
