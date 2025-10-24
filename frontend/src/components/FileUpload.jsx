"use client"

import { useState } from "react"

export function FileUpload({ onFileSelect, maxSize = 5242880 }) {
  const [fileName, setFileName] = useState("")
  const [error, setError] = useState("")

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    setError("")

    if (!file) return

    if (file.size > maxSize) {
      setError(`File size exceeds ${maxSize / 1024 / 1024}MB limit`)
      return
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "text/plain"]
    if (!allowedTypes.includes(file.type)) {
      setError("File type not allowed. Please upload PDF, JPG, PNG, or TXT")
      return
    }

    setFileName(file.name)
    onFileSelect(file)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Upload Receipt/Document</label>
      <div className="flex items-center space-x-2">
        <input
          type="file"
          onChange={handleFileChange}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          accept=".pdf,.jpg,.jpeg,.png,.txt"
        />
        {fileName && <span className="text-sm text-green-600">✓ {fileName}</span>}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
