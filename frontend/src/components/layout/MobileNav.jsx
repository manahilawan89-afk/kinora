import { NavLink, useLocation } from "react-router-dom";
import { FiHome, FiFilm, FiSearch, FiUpload, FiList } from "react-icons/fi";

const tabs = [
  { to: "/", label: "Home", icon: FiHome, end: true },
  { to: "/reels", label: "Shorts", icon: FiFilm },
  { to: "/search", label: "Search", icon: FiSearch },
  { to: "/playlists", label: "Lists", icon: FiList },
  { to: "/upload", label: "Upload", icon: FiUpload },
];

export default function MobileNav() {
  const { pathname } = useLocation();
  const isReels = pathname.startsWith("/reels");

  return (
    <nav
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-[#e5e5e5] bg-white pb-[env(safe-area-inset-bottom)] dark:border-white/10 dark:bg-[#0f0f0f] md:hidden ${
        isReels ? "border-white/10 bg-black text-white" : ""
      }`}
      aria-label="Mobile navigation"
    >
      <div className="mx-auto flex h-14 max-w-lg items-stretch justify-around px-1">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition ${
                isActive
                  ? isReels
                    ? "text-white"
                    : "text-[#0f0f0f] dark:text-white"
                  : isReels
                    ? "text-white/55"
                    : "text-[#606060] dark:text-zinc-400"
              }`
            }
          >
            <Icon size={20} />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
