import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiCompass,
  FiUpload,
  FiSettings,
  FiList,
  FiFilm,
} from "react-icons/fi";

const links = [
  { to: "/", label: "Home", icon: FiHome, end: true },
  { to: "/reels", label: "Reels", icon: FiFilm },
  { to: "/playlists", label: "Playlists", icon: FiList },
  { to: "/search", label: "Explore", icon: FiCompass },
  { to: "/upload", label: "Upload", icon: FiUpload },
  { to: "/settings", label: "Settings", icon: FiSettings },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-12 z-40 flex h-[calc(100dvh-3rem)] w-[min(14rem,80vw)] flex-col overflow-y-auto border-r border-zinc-200 bg-white p-3 pb-16 transition-transform dark:border-white/10 dark:bg-[#071412] md:static md:z-auto md:h-full md:w-56 md:shrink-0 md:translate-x-0 md:pb-3 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="space-y-1.5">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-semibold transition ${
                  isActive ? "sidebar-link-active" : "sidebar-link"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 2}
                    className="shrink-0"
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/20 dark:bg-[#0d2a27]">
          <p className="font-brand text-xs font-bold uppercase tracking-[0.12em] text-[#b45309] dark:text-[#fbbf24]">
            Try the vibe
          </p>
          <div className="mt-3 space-y-1 text-sm font-semibold leading-relaxed text-zinc-900 dark:text-white">
            <p>demo@youtube.com</p>
            <p>password123</p>
          </div>
        </div>
      </aside>
    </>
  );
}
