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
import { Inventory } from "./pages/Inventory"
import { Users } from "./pages/Users"
import { Lending } from "./pages/Lending"
import { MyLendings } from "./pages/MyLendings"

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
              <ProtectedRoute allowedRoles={["admin", "store_manager"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute allowedRoles={["admin", "store_manager", "employee"]}>
                <Inventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lendings"
            element={
              <ProtectedRoute allowedRoles={["store_manager"]}>
                <Lending />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-lendings"
            element={
              <ProtectedRoute allowedRoles={["admin", "store_manager", "employee"]}>
                <MyLendings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <Users />
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
