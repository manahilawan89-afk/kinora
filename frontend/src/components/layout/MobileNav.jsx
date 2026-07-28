import { NavLink, useLocation } from "react-router-dom";
import { FiHome, FiFilm, FiSearch, FiUpload, FiList } from "react-icons/fi";

const tabs = [
  { to: "/", label: "Home", icon: FiHome, end: true },
  { to: "/reels", label: "Reels", icon: FiFilm },
  { to: "/search", label: "Search", icon: FiSearch },
  { to: "/playlists", label: "Lists", icon: FiList },
  { to: "/upload", label: "Upload", icon: FiUpload },
];

export default function MobileNav() {
  const { pathname } = useLocation();
  const isReels = pathname.startsWith("/reels");

  return (
    <nav
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200/80 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl dark:border-white/10 dark:bg-kinora-ink/95 md:hidden ${
        isReels ? "bg-black/90 dark:bg-black/90" : ""
      }`}
      aria-label="Mobile navigation"
    >
      <div className="mx-auto flex h-12 max-w-lg items-stretch justify-around px-1">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition ${
                isActive
                  ? isReels
                    ? "text-teal-300"
                    : "text-teal-700 dark:text-kinora-glow"
                  : isReels
                    ? "text-white/55"
                    : "text-zinc-500 dark:text-zinc-400"
              }`
            }
          >
            <Icon size={18} />
            <span className="truncate text-[9px]">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
