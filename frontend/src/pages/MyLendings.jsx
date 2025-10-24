"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "../components/Sidebar"
import { Navbar } from "../components/Navbar"
import { useAuth } from "../hooks/useAuth"

export function MyLendings() {
  const { token } = useAuth()
  const [records, setRecords] = useState([])

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL || "/api"
    fetch(`${baseUrl}/lendings/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : []))
      .then(setRecords)
      .catch(() => {})
  }, [])

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-900 via-blue-800 to-green-700">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="My Lendings" />
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Item</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Qty</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Lent At</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Returned At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {records.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{r.item_id}</td>
                      <td className="px-4 py-2">{r.quantity}</td>
                      <td className="px-4 py-2">{new Date(r.lent_at).toLocaleString()}</td>
                      <td className="px-4 py-2">{r.returned_at ? new Date(r.returned_at).toLocaleString() : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
