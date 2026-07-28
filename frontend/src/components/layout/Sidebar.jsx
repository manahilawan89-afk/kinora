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
        className={`fixed left-0 top-12 z-40 h-[calc(100dvh-3rem)] w-[min(14rem,80vw)] overflow-y-auto border-r border-zinc-200 bg-white/95 p-2 pb-16 backdrop-blur-xl transition-transform dark:border-white/10 dark:bg-kinora-ink/95 md:sticky md:w-52 md:translate-x-0 md:pb-2 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-teal-50 text-teal-800 ring-1 ring-teal-200 dark:bg-gradient-to-r dark:from-kinora-teal/40 dark:to-transparent dark:text-kinora-glow dark:ring-kinora-glow/20"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 rounded-2xl border border-teal-200/70 bg-gradient-to-br from-teal-50 to-amber-50 p-4 dark:border-white/10 dark:from-kinora-teal/20 dark:to-transparent">
          <p className="font-brand text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-kinora-ember">
            Try the vibe
          </p>
          <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            demo@youtube.com
            <br />
            password123
          </p>
        </div>
      </aside>
    </>
  );
}
