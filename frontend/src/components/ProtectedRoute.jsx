"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export function ProtectedRoute({ children, requiredRole = null, allowedRoles = null }) {
  const { user, token } = useAuth()

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  let isAllowed = true
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    isAllowed = allowedRoles.includes(user.role)
  } else if (requiredRole) {
    isAllowed = user.role === requiredRole
  }

  if (!isAllowed) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}
