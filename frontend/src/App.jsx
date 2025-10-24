import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { AdminDashboard } from "./pages/AdminDashboard"
import { UserDashboard } from "./pages/UserDashboard"
import { ActivityLog } from "./pages/ActivityLog"
import { Reports } from "./pages/Reports"
import { Analytics } from "./pages/Analytics"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { NotFound } from "./pages/NotFound"
import { Unauthorized } from "./pages/Unauthorized"

export function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* Alias routes used by sidebar */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={["admin", "store_manager", "employee"]}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity-log"
            element={
              <ProtectedRoute allowedRoles={["admin", "store_manager"]}>
                <ActivityLog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}
