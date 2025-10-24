"use client"

export function Navbar({ title }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 hover:text-gray-900">🔔</button>
        <button className="text-gray-600 hover:text-gray-900">⚙️</button>
      </div>
    </div>
  )
}
