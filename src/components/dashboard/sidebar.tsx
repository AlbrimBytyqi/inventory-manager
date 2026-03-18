"use client";

import { cn } from "@/lib/utils";
import {
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Package,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Prodotti", icon: Package, href: "/dashboard/products" },
  { name: "Movimenti", icon: ArrowLeftRight, href: "/dashboard/movements" },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen bg-slate-900 text-white transition-all duration-300 flex flex-col sticky top-0",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-slate-800">
        {!isCollapsed && (
          <span className="font-bold text-xl tracking-tight">StockMaster</span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800 transition-colors group"
          >
            <item.icon size={24} className="min-w-6" />
            {!isCollapsed && (
              <span className="whitespace-nowrap">{item.name}</span>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
