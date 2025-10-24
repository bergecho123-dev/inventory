"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export function ProtectedRoute({ children, requiredRole = null }) {
  const { user, token } = useAuth()

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}
