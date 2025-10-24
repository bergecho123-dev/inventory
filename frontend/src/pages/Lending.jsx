"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "../components/Sidebar"
import { Navbar } from "../components/Navbar"
import { useAuth } from "../hooks/useAuth"

export function Lending() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [users, setUsers] = useState([])
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ itemId: "", borrowerId: "", quantity: 1 })

  useEffect(() => {
    Promise.all([fetchItems(), fetchUsers(), fetchRecords()]).finally(() => setLoading(false))
  }, [])

  async function fetchItems() {
    const baseUrl = import.meta.env.VITE_API_URL || "/api"
    const res = await fetch(`${baseUrl}/inventory`, { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) setItems(await res.json())
  }

  async function fetchUsers() {
    const baseUrl = import.meta.env.VITE_API_URL || "/api"
    const res = await fetch(`${baseUrl}/users`, { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) setUsers(await res.json())
  }

  async function fetchRecords() {
    const baseUrl = import.meta.env.VITE_API_URL || "/api"
    const res = await fetch(`${baseUrl}/lendings`, { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) setRecords(await res.json())
  }

  async function lend() {
    const baseUrl = import.meta.env.VITE_API_URL || "/api"
    const res = await fetch(`${baseUrl}/lendings/lend`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      await fetchRecords()
      setForm({ itemId: "", borrowerId: "", quantity: 1 })
    }
  }

  async function markReturned(id) {
    const baseUrl = import.meta.env.VITE_API_URL || "/api"
    const res = await fetch(`${baseUrl}/lendings/return/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) fetchRecords()
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-900 via-blue-800 to-green-700">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Lending" />
        <div className="flex-1 overflow-auto p-6 space-y-6">
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Lend Item</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg"
                value={form.itemId}
                onChange={(e) => setForm({ ...form, itemId: e.target.value })}
              >
                <option value="">Select Item</option>
                {items.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name} ({i.quantity} {i.unit})
                  </option>
                ))}
              </select>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg"
                value={form.borrowerId}
                onChange={(e) => setForm({ ...form, borrowerId: e.target.value })}
              >
                <option value="">Select Employee</option>
                {users
                  .filter((u) => u.role === "employee")
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
              </select>
              <input
                type="number"
                className="px-3 py-2 border border-gray-300 rounded-lg"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: Number.parseInt(e.target.value) })}
                min={1}
              />
            </div>
            <div className="mt-4">
              <button onClick={lend} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                Lend
              </button>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Lending Records</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Item</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Borrower</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Qty</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Lent At</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Returned At</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {records.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{r.item_id}</td>
                      <td className="px-4 py-2">{r.borrower_id}</td>
                      <td className="px-4 py-2">{r.quantity}</td>
                      <td className="px-4 py-2">{new Date(r.lent_at).toLocaleString()}</td>
                      <td className="px-4 py-2">{r.returned_at ? new Date(r.returned_at).toLocaleString() : "-"}</td>
                      <td className="px-4 py-2 text-right">
                        {!r.returned_at && (
                          <button
                            onClick={() => markReturned(r.id)}
                            className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                          >
                            Mark Returned
                          </button>
                        )}
                      </td>
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
