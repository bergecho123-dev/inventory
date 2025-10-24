"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { Sidebar } from "../components/Sidebar"
import { Navbar } from "../components/Navbar"

export function ActivityLog() {
  const { token } = useAuth()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const baseUrl = import.meta.env.VITE_API_URL || "/api"
      const response = await fetch(`${baseUrl}/activity-logs`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setActivities(data)
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(activities.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedActivities = activities.slice(startIndex, startIndex + itemsPerPage)

  const getActionBadgeColor = (action) => {
    switch (action) {
      case "CREATE":
        return "bg-green-100 text-green-800"
      case "UPDATE":
        return "bg-blue-100 text-blue-800"
      case "DELETE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-900 via-blue-800 to-green-700">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Activity Log" />
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Item</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : paginatedActivities.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No activities found
                    </td>
                  </tr>
                ) : (
                  paginatedActivities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{activity.user_name}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getActionBadgeColor(activity.action)}`}
                        >
                          {activity.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{activity.item_name || "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{activity.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(activity.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
