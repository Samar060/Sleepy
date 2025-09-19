import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, token } = useContext(AuthContext);

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
