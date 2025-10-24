"use client"

import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"

export function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const menuItems = [
    { label: "Dashboard", href: "/admin-dashboard", icon: "📊" },
    { label: "Inventory", href: "/inventory", icon: "📦" },
    { label: "Users", href: "/users", icon: "👥" },
    { label: "Reports", href: "/reports", icon: "📄" },
    { label: "Activity Log", href: "/activity-log", icon: "📋" },
  ]

  return (
    <div
      className={`${isOpen ? "w-64" : "w-20"} bg-blue-900 text-white transition-all duration-300 min-h-screen flex flex-col`}
    >
      <div className="p-4 flex items-center justify-between">
        {isOpen && <h2 className="text-xl font-bold">A-MESOB</h2>}
        <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:bg-blue-800 p-2 rounded">
          {isOpen ? "←" : "→"}
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-blue-800">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          {isOpen && (
            <div className="text-sm">
              <p className="font-medium">{user?.name}</p>
              <p className="text-blue-300 text-xs capitalize">{user?.role}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm transition"
        >
          {isOpen ? "Logout" : "🚪"}
        </button>
      </div>
    </div>
  )
}
