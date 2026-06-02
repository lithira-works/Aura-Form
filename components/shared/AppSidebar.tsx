"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Store,
  Boxes,
  Users,
  BarChart2,
  BellRing,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  Wifi,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "Workspace",
    items: [
      { href: "/pos", label: "POS Terminal", icon: Store, description: "Sales & checkout" },
      { href: "/analytics", label: "Analytics", icon: BarChart2, description: "Revenue & insights" },
    ],
  },
  {
    label: "Management",
    items: [
      { href: "/inventory", label: "Inventory", icon: Boxes, description: "Products & suppliers" },
      { href: "/customers", label: "Customers", icon: Users, description: "CRM & loyalty tiers" },
      { href: "/alerts", label: "Alerts", icon: BellRing, description: "Stock & expiry alerts", badge: 3 },
    ],
  },
];

const EXPAND_W = 256;
const COLLAPSE_W = 68;

const INACTIVE_BG = "#ffffff";
const HOVER_BG = "#f7f7fa";

export default function AppSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <motion.div
      animate={{ width: open ? EXPAND_W : COLLAPSE_W }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="relative h-full shrink-0"
    >
      <div
        className="flex flex-col h-full border-r overflow-hidden"
        style={{
          width: "100%",
          background: "#ffffff",
          borderColor: "var(--border-strong)",
          boxShadow: "2px 0 20px rgba(0,0,0,0.05)",
        }}
      >
        {/* Brand header */}
        <div
          className={`flex items-center h-16 border-b shrink-0 px-4 ${
            open ? "justify-start" : "justify-center"
          }`}
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #fde8ee 0%, #fce4ec 100%)",
              boxShadow: "0 2px 10px rgba(242,167,185,0.35)",
            }}
          >
            <Sparkles size={17} style={{ color: "var(--brand-dark)" }} />
          </div>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                key="brand-text"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="min-w-0 ml-3"
              >
                <p className="font-bold text-[15px] leading-tight tracking-tight" style={{ color: "var(--text)" }}>
                  CosmoPOS
                </p>
                <p className="text-[11px] font-semibold leading-none" style={{ color: "var(--brand-dark)" }}>
                  Aura &amp; Form
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-1">
          {NAV_SECTIONS.map((section, si) => (
            <div key={section.label} className={si > 0 ? "mt-4" : ""}>
              <AnimatePresence initial={false} mode="wait">
                {open ? (
                  <motion.p
                    key="label"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-[10px] font-bold uppercase tracking-[0.14em] px-3 mb-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {section.label}
                  </motion.p>
                ) : (
                  <motion.div
                    key="divider"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mx-2 mb-2"
                    style={{ height: "1px", background: "var(--border)" }}
                  />
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-0.5">
                {section.items.map(({ href, label, icon: Icon, badge, description }) => {
                  const active = isActive(href);
                  return (
                    <Link key={href} href={href} title={!open ? label : undefined}>
                      <div
                        className={`relative flex items-center rounded-xl cursor-pointer select-none transition-colors duration-200 py-2.5 ${
                          open ? "px-3 justify-start" : "px-0 justify-center"
                        }`}
                        style={{
                          background: active ? "var(--brand-light)" : INACTIVE_BG,
                          color: active ? "var(--brand-dark)" : "var(--text-secondary)",
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            e.currentTarget.style.background = HOVER_BG;
                            e.currentTarget.style.color = "var(--text)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = active
                            ? "var(--brand-light)"
                            : INACTIVE_BG;
                          e.currentTarget.style.color = active
                            ? "var(--brand-dark)"
                            : "var(--text-secondary)";
                        }}
                      >
                        {active && (
                          <div
                            className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-r-full"
                            style={{ background: "var(--brand-dark)" }}
                          />
                        )}

                        <div className="relative shrink-0">
                          <Icon size={19} strokeWidth={active ? 2.3 : 1.9} />
                          {badge && !open && (
                            <span
                              className="absolute -top-1.5 -right-1.5 w-[15px] h-[15px] rounded-full text-[9px] flex items-center justify-center font-bold text-white"
                              style={{ background: "#ef4444" }}
                            >
                              {badge}
                            </span>
                          )}
                        </div>

                        <AnimatePresence initial={false}>
                          {open && (
                            <motion.div
                              key="nav-label"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="flex-1 min-w-0 flex items-center justify-between ml-2.5"
                            >
                              <div className="min-w-0">
                                <p className="text-[13px] font-semibold leading-tight truncate">
                                  {label}
                                </p>
                                <p
                                  className="text-[11px] leading-none mt-0.5 truncate"
                                  style={{
                                    color: active ? "var(--brand-dark)" : "var(--text-muted)",
                                  }}
                                >
                                  {description}
                                </p>
                              </div>
                              {badge && (
                                <span
                                  className="ml-2 shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                                  style={{ background: "#ef4444" }}
                                >
                                  {badge}
                                </span>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sync status */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="sync"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
              className="px-4 pb-3"
            >
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ background: "#4ade80" }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{ background: "#16a34a" }}
                  />
                </span>
                <Wifi size={11} style={{ color: "#16a34a" }} />
                <p className="text-[11px] font-semibold truncate" style={{ color: "#16a34a" }}>
                  All terminals synced
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mx-3" style={{ height: "1px", background: "var(--border)" }} />

        {/* User profile */}
        <div className="p-2.5 pb-4">
          <div
            className={`flex items-center rounded-xl p-2 cursor-pointer transition-colors duration-200 ${
              open ? "justify-start" : "justify-center"
            }`}
            style={{ background: "var(--bg)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--brand-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--bg)";
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{
                background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)",
              }}
            >
              SL
            </div>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="user-info"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 min-w-0 flex items-center justify-between ml-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate" style={{ color: "var(--text)" }}>
                      Sophia Laurent
                    </p>
                    <p className="text-[10px] font-medium" style={{ color: "var(--text-secondary)" }}>
                      Administrator
                    </p>
                  </div>
                  <button
                    type="button"
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors hover:bg-red-50"
                    style={{ color: "var(--text-muted)" }}
                    title="Sign out"
                  >
                    <LogOut size={13} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        type="button"
        className="absolute top-[22px] right-[-14px] w-7 h-7 rounded-full border flex items-center justify-center z-30 transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          background: "#ffffff",
          borderColor: "var(--border-strong)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
          color: "var(--text-secondary)",
        }}
        onClick={() => setOpen((v) => !v)}
        title={open ? "Collapse sidebar" : "Expand sidebar"}
      >
        {open ? <ChevronsLeft size={13} /> : <ChevronsRight size={13} />}
      </button>
    </motion.div>
  );
}
