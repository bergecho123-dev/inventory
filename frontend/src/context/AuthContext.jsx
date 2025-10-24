import React, { createContext, useState, useCallback, useEffect, useContext } from "react"

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user")
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem("token") || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Rehydrate user if token exists but user state is empty
    if (token && !user) {
      try {
        const stored = localStorage.getItem("user")
        if (stored) {
          setUser(JSON.parse(stored))
        }
      } catch {
        // ignore JSON parse errors
      }
    }
  }, [token, user])

  const register = useCallback(async (name, email, password) => {
    setLoading(true)
    setError(null)
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "/api"
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const errText = await response.text().catch(() => "Registration failed")
        throw new Error(errText || "Registration failed")
      }

      const data = await response.json()
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "/api"
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errText = await response.text().catch(() => "Login failed")
        throw new Error(errText || "Login failed")
      }

      const data = await response.json()
      setToken(data.token)
      setUser(data.user || null)
      localStorage.setItem("token", data.token)
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user))
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
export function useAuth() {
  return useContext(AuthContext)
}
