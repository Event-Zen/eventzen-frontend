import { Search, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser } from "../features/auth/hooks/useAuthUser";
import { profilePath } from "../features/auth/utils/rolePaths";

const Header = () => {
  const { user, isAuthed, logout } = useAuthUser();
  const navigate = useNavigate();

  const isAttendee = user?.role === "ATTENDEE";
  const isPlanner = user?.role === "PLANNER";
  const isAdmin = user?.role === "ADMIN";

  function onLogout() {
    logout();
    navigate("/login");
  }
  return (
    <header className="w-full bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-y-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link
            to="/"
            className="group transition-all duration-300 transform hover:-translate-y-0.5 flex items-center space-x-2"
          >
            <img src="/eventzen-logo.png" alt="EventZen Logo" className="h-14 w-14 object-contain" />
            <h1 className="text-2xl font-extrabold tracking-wide group-hover:text-gray-700">
              EVENT
              <span className="text-blue-500 transition-colors group-hover:text-blue-600">
                ZEN
              </span>
            </h1>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full sm:max-w-[400px]">
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
        <nav className="flex flex-wrap items-center gap-4 lg:gap-6 text-sm font-medium text-gray-700">
          {/* Only attendee sees Find Events */}
          {isAttendee && (
            <Link to="/find-events" className="hover:text-blue-500 transition">
              Find Events
            </Link>
          )}

          {/* Only planner sees Create Events */}
          {isPlanner && (
            <Link to="/create-event" className="hover:text-blue-500 transition">
              Create Events
            </Link>
          )}

          <Link
            to="/help"
            className="flex items-center space-x-1 hover:text-blue-500 transition"
          >
            <span>Help Center</span>
            <ChevronDown size={16} />
          </Link>

          {isAdmin && (
            <Link to="/admin/dashboard" className="hover:text-blue-500 transition font-bold text-blue-600">
              Admin Dashboard
            </Link>
          )}

          {/* If logged in show Dashboard/Profile + Logout */}
          {isAuthed && user ? (
            <>
              {/* <Link
                to={dashboardPath(user.role)}
                className="hover:text-blue-500 transition"
              >
                Dashboard
              </Link> */}

              <Link to={profilePath(user.role)} className="hover:text-blue-500 transition">
                Profile
              </Link>

              <button
                onClick={onLogout}
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              {/* If NOT logged in show Login / Sign up */}
              <Link to="/login" className="hover:text-blue-500 transition">
                Log In
              </Link>

              <Link
                to="/sign-up"
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
