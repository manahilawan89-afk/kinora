import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  FiMenu,
  FiSearch,
  FiUpload,
  FiMoon,
  FiSun,
  FiX,
} from "react-icons/fi";
import BrandLogo from "../common/BrandLogo";
import { toggleTheme } from "../../redux/slices/themeSlice";
import { logout } from "../../redux/slices/authSlice";

export default function Navbar({ onMenuClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const darkMode = useSelector((s) => s.theme.darkMode);
  const user = useSelector((s) => s.auth.user);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  function handleSearch(e) {
    e.preventDefault();
    const q = query.trim();
    setMobileSearchOpen(false);
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#e5e5e5] bg-white pt-[env(safe-area-inset-top)] dark:border-white/10 dark:bg-[#0f0f0f]">
      <div className="flex h-14 items-center gap-2 px-3 sm:gap-3 sm:px-4">
        <button
          onClick={onMenuClick}
          className="shrink-0 rounded-full p-2 text-[#0f0f0f] hover:bg-[#f2f2f2] dark:text-zinc-100 dark:hover:bg-white/10"
          aria-label="Menu"
        >
          <FiMenu size={20} />
        </button>

        <BrandLogo className="min-w-0 shrink" />

        <form
          onSubmit={handleSearch}
          className="mx-auto hidden max-w-xl flex-1 items-center sm:flex lg:max-w-2xl"
        >
          <input
            className="h-10 w-full rounded-l-full border border-[#ccc] bg-white px-4 text-sm text-[#0f0f0f] outline-none placeholder:text-[#606060] focus:border-[#1c62b9] dark:border-white/15 dark:bg-[#121212] dark:text-zinc-100"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="flex h-10 w-16 items-center justify-center rounded-r-full border border-l-0 border-[#ccc] bg-[#f8f8f8] text-[#0f0f0f] hover:bg-[#f0f0f0] dark:border-white/15 dark:bg-white/10 dark:text-zinc-100"
          >
            <FiSearch size={18} />
          </button>
        </form>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setMobileSearchOpen((v) => !v)}
            className="rounded-full p-2 text-[#0f0f0f] hover:bg-[#f2f2f2] dark:text-zinc-200 dark:hover:bg-white/10 sm:hidden"
            aria-label="Search"
          >
            {mobileSearchOpen ? <FiX size={18} /> : <FiSearch size={18} />}
          </button>

          <button
            type="button"
            onClick={() => dispatch(toggleTheme())}
            className="inline-flex items-center gap-2 rounded-full border border-[#d0d0d0] bg-white px-2.5 py-1.5 text-sm font-medium text-[#0f0f0f] hover:bg-[#f2f2f2] dark:border-white/15 dark:bg-[#121212] dark:text-zinc-100 dark:hover:bg-white/10"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                darkMode ? "bg-[#3f3f46]" : "bg-[#065fd4]"
              }`}
            >
              <span
                className={`inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[#0f0f0f] shadow transition ${
                  darkMode ? "translate-x-4" : "translate-x-0.5"
                }`}
              >
                {darkMode ? <FiMoon size={10} /> : <FiSun size={10} />}
              </span>
            </span>
            <span className="hidden sm:inline">{darkMode ? "Dark" : "Light"}</span>
          </button>

          {user ? (
            <>
              <Link
                to="/upload"
                className="hidden items-center gap-2 rounded-full border border-[#d0d0d0] px-3.5 py-1.5 text-sm font-medium text-[#0f0f0f] hover:bg-[#f2f2f2] dark:border-white/15 dark:text-zinc-100 dark:hover:bg-white/10 sm:flex"
              >
                <FiUpload size={16} />
                Create
              </Link>
              <Link
                to="/settings"
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#065fd4] text-xs font-medium text-white"
                title={user.username}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  user.username?.[0]?.toUpperCase()
                )}
              </Link>
              <button
                onClick={() => dispatch(logout())}
                className="hidden text-xs text-[#606060] hover:text-[#0f0f0f] dark:hover:text-zinc-200 sm:block"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-full border border-[#065fd4] px-3.5 py-1.5 text-sm font-semibold text-[#065fd4] hover:bg-[#def1ff]"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      {mobileSearchOpen && (
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 border-t border-[#e5e5e5] px-3 py-2 dark:border-white/10 sm:hidden"
        >
          <input
            autoFocus
            className="h-10 flex-1 rounded-full border border-[#ccc] bg-white px-4 text-sm outline-none focus:border-[#1c62b9] dark:border-white/15 dark:bg-[#121212]"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f2f2] text-[#0f0f0f]"
            aria-label="Submit search"
          >
            <FiSearch size={18} />
          </button>
        </form>
      )}
    </header>
  );
}
