"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Bell,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Wifi,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "Workspace",
    items: [
      {
        href: "/pos",
        label: "POS Register",
        icon: ShoppingCart,
        description: "Process sales & checkout",
      },
      {
        href: "/analytics",
        label: "Analytics",
        icon: BarChart3,
        description: "Revenue & insights",
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        href: "/inventory",
        label: "Inventory",
        icon: Package,
        description: "Products & suppliers",
      },
      {
        href: "/customers",
        label: "Customers",
        icon: Users,
        description: "CRM & loyalty tiers",
      },
      {
        href: "/alerts",
        label: "Alerts",
        icon: Bell,
        description: "Stock & expiry alerts",
        badge: 3,
      },
    ],
  },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    /* Outer wrapper — relative so the toggle button can escape overflow-hidden */
    <motion.div
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className="relative h-full shrink-0"
    >
      {/* Sidebar body — overflow-hidden clips text during collapse */}
      <div
        className="flex flex-col h-full border-r overflow-hidden"
        style={{
          background: "#ffffff",
          borderColor: "var(--border)",
          boxShadow: "2px 0 16px rgba(0,0,0,0.04)",
          width: "100%",
        }}
      >
        {/* ── Brand Header ── */}
        <div
          className="flex items-center h-16 px-4 border-b shrink-0"
          style={{
            borderColor: "var(--border)",
            gap: collapsed ? 0 : 12,
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <motion.div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, var(--brand-light) 0%, #fce4ec 100%)",
              boxShadow: "0 2px 8px rgba(242,167,185,0.3)",
            }}
            whileHover={{ scale: 1.07, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Sparkles size={17} style={{ color: "var(--brand-dark)" }} />
          </motion.div>

          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                key="brand-text"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="flex-1 min-w-0"
              >
                <p
                  className="font-bold text-[15px] leading-none tracking-tight"
                  style={{ color: "var(--text)" }}
                >
                  CosmoPOS
                </p>
                <p
                  className="text-[11px] mt-0.5 leading-none font-medium"
                  style={{ color: "var(--brand-dark)", opacity: 0.85 }}
                >
                  Aura &amp; Form
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-5">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.p
                    key={`label-${section.label}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.45 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-[10px] font-bold uppercase tracking-[0.12em] px-3 mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {section.label}
                  </motion.p>
                )}
              </AnimatePresence>

              {collapsed && (
                <div
                  className="mx-3 mb-2"
                  style={{ height: "1px", background: "var(--border)" }}
                />
              )}

              <div className="flex flex-col gap-0.5">
                {section.items.map(({ href, label, icon: Icon, badge, description }) => {
                  const active =
                    pathname === href || pathname.startsWith(href + "/");
                  return (
                    <Link
                      key={href}
                      href={href}
                      title={collapsed ? label : undefined}
                    >
                      <motion.div
                        className="relative flex items-center rounded-xl cursor-pointer overflow-hidden"
                        style={{
                          padding: collapsed ? "11px 0" : "10px 12px",
                          justifyContent: collapsed ? "center" : "flex-start",
                          gap: 11,
                          background: active ? "var(--brand-light)" : "transparent",
                          color: active
                            ? "var(--brand-dark)"
                            : "var(--text-secondary)",
                        }}
                        whileHover={{
                          background: active
                            ? "var(--brand-light)"
                            : "var(--bg)",
                          color: active ? "var(--brand-dark)" : "var(--text)",
                        }}
                        transition={{ duration: 0.12 }}
                      >
                        {/* Active left accent bar */}
                        {active && (
                          <motion.div
                            layoutId="sidebar-active-bar"
                            className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full"
                            style={{ background: "var(--brand-dark)" }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 35,
                            }}
                          />
                        )}

                        {/* Icon with badge (collapsed view) */}
                        <div className="relative shrink-0">
                          <Icon
                            size={18}
                            strokeWidth={active ? 2.2 : 1.8}
                          />
                          {badge && collapsed && (
                            <span
                              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold text-white"
                              style={{ background: "#FF3B30" }}
                            >
                              {badge}
                            </span>
                          )}
                        </div>

                        {/* Label + description (expanded view) */}
                        <AnimatePresence initial={false}>
                          {!collapsed && (
                            <motion.div
                              key={`nav-text-${href}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="flex-1 min-w-0 flex items-center justify-between"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-semibold leading-none truncate">
                                  {label}
                                </p>
                                <p
                                  className="text-[11px] mt-0.5 leading-none truncate"
                                  style={{ opacity: 0.55 }}
                                >
                                  {description}
                                </p>
                              </div>

                              {badge && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-2 shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                                  style={{ background: "#FF3B30" }}
                                >
                                  {badge}
                                </motion.span>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ── System Status ── */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="sync-status"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
              className="px-4 pb-2"
            >
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: "#f0fdf4" }}
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <Wifi size={11} style={{ color: "#16a34a" }} />
                <p
                  className="text-[11px] font-semibold truncate"
                  style={{ color: "#16a34a" }}
                >
                  All terminals synced
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Divider ── */}
        <div
          className="mx-3 mb-2"
          style={{ height: "1px", background: "var(--border)" }}
        />

        {/* ── User Profile ── */}
        <div className="px-2.5 pb-4">
          <motion.div
            className="flex items-center rounded-xl p-2 cursor-pointer"
            style={{
              background: "var(--bg)",
              gap: collapsed ? 0 : 10,
              justifyContent: collapsed ? "center" : "flex-start",
            }}
            whileHover={{ background: "var(--brand-light)" }}
            transition={{ duration: 0.15 }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)",
              }}
            >
              SL
            </div>

            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  key="user-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 min-w-0"
                >
                  <p
                    className="text-xs font-semibold truncate"
                    style={{ color: "var(--text)" }}
                  >
                    Sophia Laurent
                  </p>
                  <p
                    className="text-[10px]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Administrator
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.button
                  key="logout-btn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50 hover:text-red-500"
                  style={{ color: "var(--text-secondary)" }}
                  title="Sign out"
                >
                  <LogOut size={13} />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* ── Collapse Toggle ── positioned outside overflow-hidden ── */}
      <motion.button
        className="absolute top-[20px] right-[-13px] w-[26px] h-[26px] rounded-full border flex items-center justify-center z-30"
        style={{
          background: "#ffffff",
          borderColor: "var(--border)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          color: "var(--text-secondary)",
        }}
        onClick={() => setCollapsed((c) => !c)}
        whileHover={{ scale: 1.15, boxShadow: "0 4px 12px rgba(242,167,185,0.4)" }}
        whileTap={{ scale: 0.9 }}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <PanelLeftOpen size={12} />
        ) : (
          <PanelLeftClose size={12} />
        )}
      </motion.button>
    </motion.div>
  );
}
