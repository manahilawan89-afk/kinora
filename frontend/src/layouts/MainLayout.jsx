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
    <div className="kinora-shell flex h-dvh flex-col overflow-hidden bg-white text-[#0f0f0f] dark:bg-[#0f0f0f] dark:text-zinc-100">
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setSidebarOpen((v) => !v)} />
        <div className="flex min-h-0 flex-1">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main
            className={`min-h-0 min-w-0 flex-1 bg-white dark:bg-[#0f0f0f] ${
              isReels
                ? "overflow-hidden p-0 pb-12 md:pb-0"
                : "overflow-y-auto overflow-x-hidden overscroll-y-contain px-3 pb-14 pt-3 sm:px-4 md:px-6 md:pb-6 md:pt-4"
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
