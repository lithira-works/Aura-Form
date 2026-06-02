"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Bell,
  LogOut,
  ChevronRight,
} from "lucide-react";

const NAV = [
  { href: "/pos", label: "POS Register", icon: ShoppingCart },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/alerts", label: "Alerts", icon: Bell, badge: 3 },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex flex-col h-full w-[220px] min-w-[220px] border-r py-5"
      style={{
        background: "#ffffff",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 mb-8">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--brand-light)" }}
        >
          <Sparkles size={17} style={{ color: "var(--brand-dark)" }} />
        </div>
        <div>
          <p className="font-bold text-sm leading-none" style={{ color: "var(--text)" }}>
            CosmoPOS
          </p>
          <p className="text-[11px] mt-0.5 leading-none" style={{ color: "var(--text-secondary)" }}>
            Aura &amp; Form
          </p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 px-3 flex-1">
        <p
          className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-1"
          style={{ color: "var(--text-secondary)", opacity: 0.6 }}
        >
          Navigation
        </p>
        {NAV.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href}>
              <motion.div
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer relative"
                style={{
                  background: active ? "var(--brand-light)" : "transparent",
                  color: active ? "var(--brand-dark)" : "var(--text-secondary)",
                }}
                whileHover={{
                  background: active ? undefined : "var(--bg)",
                  color: active ? undefined : "var(--text)",
                }}
                transition={{ duration: 0.15 }}
              >
                <Icon size={16} />
                <span className="text-sm font-medium flex-1">{label}</span>
                {badge && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                    style={{ background: "var(--brand-dark)" }}
                  >
                    {badge}
                  </span>
                )}
                {active && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute right-2"
                  >
                    <ChevronRight size={13} style={{ color: "var(--brand-dark)" }} />
                  </motion.div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{ background: "var(--bg)" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: "var(--brand)" }}
          >
            SL
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: "var(--text)" }}>
              Sophia Laurent
            </p>
            <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
              Administrator
            </p>
          </div>
          <button style={{ color: "var(--text-secondary)" }}>
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
