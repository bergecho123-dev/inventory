"use client"

import { useMemo, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { NavLink, useNavigate } from "react-router-dom"

export function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const menuItems = useMemo(() => {
    const items = []
    const role = user?.role
    const dashboardHref = role === "admin" || role === "store_manager" ? "/admin-dashboard" : "/user-dashboard"
    items.push({ label: "Dashboard", href: dashboardHref, icon: "📊" })
    items.push({ label: "Inventory", href: "/inventory", icon: "📦" })
    if (role === "admin") {
      items.push({ label: "Users", href: "/users", icon: "👥" })
    }
    items.push({ label: "Reports", href: "/reports", icon: "📄" })
    if (role === "admin" || role === "store_manager") {
      items.push({ label: "Activity Log", href: "/activity-log", icon: "📋" })
    }
    if (role === "store_manager") {
      items.push({ label: "Lending", href: "/lendings", icon: "🔁" })
    }
    if (role === "employee" || role === "store_manager" || role === "admin") {
      items.push({ label: "My Lendings", href: "/my-lendings", icon: "🧾" })
    }
    return items
  }, [user])

  return (
    <div
      className={`${isOpen ? "w-64" : "w-20"} bg-[#0F172A] text-white transition-all duration-300 min-h-screen flex flex-col`}
    >
      <div className="p-4 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <img src="/amesob-logo.png" alt="A-MESOB" className="h-8 w-8" />
          {isOpen && <h2 className="text-lg font-bold tracking-wide">A-MESOB</h2>}
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white/80 hover:bg-slate-800 p-2 rounded">
          {isOpen ? "←" : "→"}
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2 rounded-lg transition ${
                isActive ? "bg-slate-800" : "hover:bg-slate-800/70"
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-semibold">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          {isOpen && (
            <div className="text-sm">
              <p className="font-medium">{user?.name}</p>
              <p className="text-slate-300 text-xs capitalize">{user?.role?.replace("_", " ")}</p>
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
