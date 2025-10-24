"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "../components/Sidebar"
import { Navbar } from "../components/Navbar"
import { InventoryTable } from "../components/InventoryTable"
import { useAuth } from "../hooks/useAuth"
import { Modal } from "../components/Modal"
import { FileUpload } from "../components/FileUpload"

export function Inventory() {
  const { token, user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [formData, setFormData] = useState({ name: "", category: "", quantity: 0, unit: "", location: "", serial_number: "" })

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

  const openAdd = () => {
    setEditingItem(null)
    setSelectedFile(null)
    setFormData({ name: "", category: "", quantity: 0, unit: "", location: "", serial_number: "" })
    setShowModal(true)
  }

  const submitItem = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "/api"
      const fd = new FormData()
      fd.append("name", formData.name)
      fd.append("category", formData.category)
      fd.append("quantity", String(formData.quantity))
      fd.append("unit", formData.unit)
      fd.append("location", formData.location)
      if (selectedFile) fd.append("file", selectedFile)
      const method = editingItem ? "PUT" : "POST"
      const url = editingItem ? `${baseUrl}/inventory/${editingItem.id}` : `${baseUrl}/inventory`
      const res = await fetch(url, { method, headers: { Authorization: `Bearer ${token}` }, body: fd })
      if (res.ok) {
        await fetchItems()
        setShowModal(false)
      }
    } catch (e) {
      console.error("save item failed", e)
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
              {user?.role === "store_manager" && (
                <button
                  onClick={openAdd}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  + Add Item
                </button>
              )}
            </div>
            <InventoryTable items={items} loading={loading} onEdit={() => {}} onDelete={() => {}} />
          </div>
        </div>
      </div>
      <Modal
        isOpen={showModal}
        title={editingItem ? "Edit Item" : "Add New Item"}
        onClose={() => setShowModal(false)}
        onSubmit={submitItem}
        submitLabel={editingItem ? "Update" : "Create"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter item name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Laptops, Furniture"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Unit, Box"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Warehouse A"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number (optional)</label>
            <input
              type="text"
              value={formData.serial_number}
              onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="For laptops, devices, etc."
            />
          </div>
          <FileUpload onFileSelect={setSelectedFile} />
        </div>
      </Modal>
    </div>
  )
}
