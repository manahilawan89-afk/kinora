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
  { to: "/reels", label: "Shorts", icon: FiFilm },
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
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-14 z-40 flex h-[calc(100dvh-3.5rem)] w-[min(15rem,82vw)] flex-col overflow-y-auto border-r border-[#e5e5e5] bg-white px-3 py-3 pb-16 transition-transform dark:border-white/10 dark:bg-[#0f0f0f] md:static md:z-auto md:h-full md:w-56 md:shrink-0 md:translate-x-0 md:pb-3 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="space-y-0.5">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl px-3 py-2.5 text-sm transition ${
                  isActive ? "sidebar-link-active" : "sidebar-link"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} strokeWidth={isActive ? 2.25 : 1.75} className="shrink-0" />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 rounded-2xl border border-[#e5e5e5] bg-[#f8f8f8] p-4 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#606060]">
            Demo login
          </p>
          <div className="mt-2 space-y-1 text-sm leading-relaxed text-[#0f0f0f] dark:text-zinc-100">
            <p>demo@youtube.com</p>
            <p>password123</p>
          </div>
        </div>
      </aside>
    </>
  );
}
