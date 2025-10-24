"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { Sidebar } from "../components/Sidebar"
import { Navbar } from "../components/Navbar"
import { InventoryTable } from "../components/InventoryTable"
import { Modal } from "../components/Modal"
import { FileUpload } from "../components/FileUpload"

export function AdminDashboard() {
  const { user, token } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: 0,
    unit: "",
    location: "",
  })

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const baseUrl = import.meta.env.VITE_API_URL || "/api"
      const response = await fetch(`${baseUrl}/inventory`, {
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

  const handleAddItem = () => {
    setEditingItem(null)
    setSelectedFile(null)
    setFormData({ name: "", category: "", quantity: 0, unit: "", location: "" })
    setShowModal(true)
  }

  const handleEditItem = (item) => {
    setEditingItem(item)
    setSelectedFile(null)
    setFormData(item)
    setShowModal(true)
  }

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || "/api"
        const response = await fetch(`${baseUrl}/inventory/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          setItems(items.filter((item) => item.id !== id))
        }
      } catch (error) {
        console.error("Failed to delete item:", error)
      }
    }
  }

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("category", formData.category)
      formDataToSend.append("quantity", formData.quantity)
      formDataToSend.append("unit", formData.unit)
      formDataToSend.append("location", formData.location)

      if (selectedFile) {
        formDataToSend.append("file", selectedFile)
      }

      const method = editingItem ? "PUT" : "POST"
      const baseUrl = import.meta.env.VITE_API_URL || "/api"
      const url = editingItem ? `${baseUrl}/inventory/${editingItem.id}` : `${baseUrl}/inventory`

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      })

      if (response.ok) {
        const data = await response.json()
        if (editingItem) {
          setItems(items.map((item) => (item.id === editingItem.id ? data : item)))
        } else {
          setItems([...items, data])
        }
        setShowModal(false)
      }
    } catch (error) {
      console.error("Failed to save item:", error)
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-900 via-blue-800 to-green-700">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Admin Dashboard" />
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6">
              <p className="text-gray-600 text-sm">Total Items</p>
              <p className="text-3xl font-bold text-blue-600">{items.length}</p>
            </div>
            <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6">
              <p className="text-gray-600 text-sm">Low Stock Items</p>
              <p className="text-3xl font-bold text-red-600">{items.filter((i) => i.quantity <= 10).length}</p>
            </div>
            <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6">
              <p className="text-gray-600 text-sm">Categories</p>
              <p className="text-3xl font-bold text-green-600">{new Set(items.map((i) => i.category)).size}</p>
            </div>
            <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6">
              <p className="text-gray-600 text-sm">Total Quantity</p>
              <p className="text-3xl font-bold text-purple-600">{items.reduce((sum, i) => sum + i.quantity, 0)}</p>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Inventory Items</h2>
              <button
                onClick={handleAddItem}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                + Add Item
              </button>
            </div>
            <InventoryTable items={items} onEdit={handleEditItem} onDelete={handleDeleteItem} loading={loading} />
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        title={editingItem ? "Edit Item" : "Add New Item"}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
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
              placeholder="e.g., Office Supplies"
            />
          </div>
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
              placeholder="e.g., Box, Unit"
            />
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
          <FileUpload onFileSelect={setSelectedFile} />
        </div>
      </Modal>
    </div>
  )
}
