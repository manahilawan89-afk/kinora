import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const isReels = pathname.startsWith("/reels");

  return (
    <div className="kinora-shell kinora-noise text-zinc-900 dark:text-zinc-100">
      <div className="relative z-10">
        <Navbar onMenuClick={() => setSidebarOpen((v) => !v)} />
        <div className="flex">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main
            className={`min-h-[calc(100vh-3.5rem)] flex-1 ${
              isReels ? "overflow-hidden p-0" : "p-4 md:p-6"
            }`}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
