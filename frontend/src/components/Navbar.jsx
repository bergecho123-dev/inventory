"use client"

import { useState } from "react"

export function Navbar({ title }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between relative">
      <div className="flex items-center space-x-3">
        <img src="/amesob-logo.png" alt="A-MESOB" className="h-8 w-8" />
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications((v) => !v)
              setShowSettings(false)
            }}
            className="text-gray-600 hover:text-gray-900"
          >
            🔔
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg border border-gray-200 p-4 z-10">
              <p className="text-sm text-gray-700 font-semibold mb-2">Notifications</p>
              <p className="text-sm text-gray-500">No new notifications</p>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => {
              setShowSettings((v) => !v)
              setShowNotifications(false)
            }}
            className="text-gray-600 hover:text-gray-900"
          >
            ⚙️
          </button>
          {showSettings && (
            <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg border border-gray-200 p-2 z-10">
              <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm">Profile</button>
              <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm">Preferences</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
