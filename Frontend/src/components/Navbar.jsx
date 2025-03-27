import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // ✅ Dark Mode Toggle Function
  const toggleDarkMode = () => {
    const newTheme = darkMode ? "light" : "dark";
    setDarkMode(!darkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  // ✅ Theme Ko Load Karne Ke Liye useEffect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ Token Remove Karo
    navigate("/login"); // ✅ Login Page Pe Redirect Karo
  };

  return (
    <nav className="bg-gray-800 dark:bg-gray-900 p-4 flex justify-between items-center">
      <h1 className="text-white text-xl">Notes App</h1>
      <div className="flex gap-4">
        {/* ✅ Dark Mode Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          {darkMode ? "🌙 Dark" : "☀️ Light"}
        </button>

        {/* ✅ Profile Button */}
        <button
          onClick={() => navigate("/profile")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Profile
        </button>

        {/* ✅ Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
