import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser } from "../features/auth/hooks/useAuthUser";
import { profilePath } from "../features/auth/utils/rolePaths";
import { listPublishedEvents } from "../shared/api/eventClient";

type SearchEvent = {
  id: string;
  title: string;
  image?: string;
  description?: string;
};

const Header = () => {
  const { user, isAuthed, logout } = useAuthUser();
  const navigate = useNavigate();

  const isAttendee = user?.role === "ATTENDEE";
  const isPlanner = user?.role === "PLANNER";
  const isAdmin = user?.role === "ADMIN";
  const [searchQuery, setSearchQuery] = useState("");
  const [allEvents, setAllEvents] = useState<SearchEvent[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchEvent[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  


  useEffect(() => {
    async function fetchEvents() {
      try {
        const responseData = await listPublishedEvents();
        const data = responseData.data || [];
        const mapped = data.map((ev: any) => ({
          id: ev._id,
          title: ev.title,
          image: ev.image,
          description: ev.description?.split("|")[0]?.trim() || "",
        }));
        setAllEvents(mapped);
      } catch (err) {
        console.error("Failed to fetch events for search", err);
      }
    }
    if (isAuthed) fetchEvents();
  }, [isAuthed]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      const matched = allEvents.filter(
        (ev) =>
          ev.title.toLowerCase().includes(lower) ||
          ev.description?.toLowerCase().includes(lower)
      );
      setFilteredResults(matched.slice(0, 5)); // Limit to 5 results
    } else {
      setFilteredResults([]);
    }
  }, [searchQuery, allEvents]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function onLogout() {
    logout();
    navigate("/login");
  }

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/find-events?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowDropdown(false);
    }
  };

  const handleSelectItem = (title: string) => {
    setSearchQuery(title);
    navigate(`/find-events?q=${encodeURIComponent(title)}`);
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
        <div className="relative flex-1 w-full sm:max-w-[400px]" ref={dropdownRef}>
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full"
          >
            <input
              type="text"
              placeholder="Search events"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              className="bg-transparent outline-none flex-1 text-sm"
            />
            <button
              type="submit"
              className="bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 transition"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Search Dropdown */}
          {showDropdown && filteredResults.length > 0 && (
            <div className="absolute top-12 left-0 w-full bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden backdrop-blur-sm bg-white/95">
              <div className="py-2">
                <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Quick Results
                </div>
                {filteredResults.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleSelectItem(event.title)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      {event.image ? (
                        <img src={event.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-blue-50 text-blue-500">
                          <Calendar size={18} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900 truncate">
                        {event.title}
                      </div>
                      {event.description && (
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {event.description}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
                <div className="border-t border-slate-50 mt-1">
                  <button
                    onClick={handleSearch}
                    className="w-full text-center py-2.5 text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:bg-slate-50 transition-all uppercase tracking-wider"
                  >
                    View All Results
                  </button>
                </div>
              </div>
            </div>
          )}
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

              {user.role !== "ADMIN" && (
                <Link to={profilePath(user.role)} className="hover:text-blue-500 transition">
                  Profile
                </Link>
              )}

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
