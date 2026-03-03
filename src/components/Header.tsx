import { Search, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link
            to="/"
            className="group transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <h1 className="text-2xl font-extrabold tracking-wide group-hover:text-gray-700">
              EVENT
              <span className="text-blue-500 transition-colors group-hover:text-blue-600">
                ZEN
              </span>
            </h1>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-[400px]">
          <input
            type="text"
            placeholder="Search events"
            className="bg-transparent outline-none flex-1 text-sm"
          />
          <button className="bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 transition">
            <Search size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-6 text-sm font-medium text-gray-700">
          <Link to="/" className="hover:text-blue-500 transition">
            Find Events
          </Link>

          <Link to="/create-event" className="hover:text-blue-500 transition">
            Create Events
          </Link>

          <Link
            to="/help"
            className="flex items-center space-x-1 hover:text-blue-500 transition"
          >
            <span>Help Center</span>
            <ChevronDown size={16} />
          </Link>

          <Link to="/profile" className="hover:text-blue-500 transition">
            Profile
          </Link>

          <Link to="/login" className="hover:text-blue-500 transition">
            Log In
          </Link>

          <Link
            to="/signup"
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;