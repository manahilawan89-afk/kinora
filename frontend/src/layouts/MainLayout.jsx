import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import MobileNav from "../components/layout/MobileNav";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const isReels = pathname.startsWith("/reels");

  return (
    <div className="kinora-shell kinora-noise flex h-dvh flex-col overflow-hidden text-zinc-900 dark:text-zinc-100">
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setSidebarOpen((v) => !v)} />
        <div className="flex min-h-0 flex-1">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main
            className={`min-h-0 min-w-0 flex-1 ${
              isReels
                ? "overflow-hidden p-0 pb-12 md:pb-0"
                : "overflow-y-auto overflow-x-hidden overscroll-y-contain p-2 pb-14 sm:p-3 md:p-5 md:pb-5"
            }`}
          >
            <Outlet />
          </main>
        </div>
        <MobileNav />
      </div>
    </div>
  );
}
