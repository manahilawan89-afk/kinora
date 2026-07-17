import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  FiMenu,
  FiSearch,
  FiUpload,
  FiMoon,
  FiSun,
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

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  function handleSearch(e) {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-2 border-b border-zinc-200/80 bg-white/80 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-kinora-ink/80">
      <button
        onClick={onMenuClick}
        className="rounded-full p-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10"
        aria-label="Menu"
      >
        <FiMenu size={20} />
      </button>

      <BrandLogo />

      <form
        onSubmit={handleSearch}
        className="mx-auto hidden max-w-2xl flex-1 items-center sm:flex"
      >
        <input
          className="h-10 w-full rounded-l-full border border-zinc-200 bg-zinc-50 px-4 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-teal-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-kinora-glow/50"
          placeholder="Search Kinora..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="flex h-10 w-14 items-center justify-center rounded-r-full border border-l-0 border-zinc-200 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:border-white/10 dark:bg-white/10 dark:text-zinc-200 dark:hover:bg-white/15"
        >
          <FiSearch size={18} />
        </button>
      </form>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="rounded-full p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/10"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        {user ? (
          <>
            <Link
              to="/upload"
              className="hidden items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-800 ring-1 ring-teal-200 hover:bg-teal-100 dark:bg-kinora-teal/20 dark:text-kinora-glow dark:ring-kinora-glow/30 dark:hover:bg-kinora-teal/30 sm:flex"
            >
              <FiUpload size={16} />
              Create
            </Link>
            <Link
              to="/settings"
              className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-teal-700 text-sm font-medium text-white ring-2 ring-amber-400/70"
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
              className="hidden text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 sm:block"
            >
              Sign out
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="rounded-full bg-amber-500 px-4 py-1.5 text-sm font-semibold text-black hover:brightness-110"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
