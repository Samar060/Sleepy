import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Progress from "./pages/Progress";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";

// ✅ Private route protection
function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
}

// ✅ Navbar with improved theme
function Navbar() {
  const { user, logout, token } = useContext(AuthContext);
  const location = useLocation();

  // Hide navbar on login/register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <nav className="bg-white shadow-md border-b border-gray-100 px-6 py-3 flex justify-between items-center">
      {/* Logo / Title */}
      <h1 className="text-xl font-bold text-blue-600">🌙 Sleep Tracker</h1>

      {/* Links */}
      <div className="flex items-center space-x-4">
        {token ? (
          <>
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Dashboard
            </Link>
            <Link
              to="/progress"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Your Progress
            </Link>
            <span className="text-gray-600 font-medium">
              Hi, <span className="text-blue-600">{user?.name}</span>
            </span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

// ✅ App Entry
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <Navbar />
          <div className="p-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/progress"
                element={
                  <PrivateRoute>
                    <Progress />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
          <Toaster />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
