import AppSidebar from "@/components/shared/AppSidebar";

export default function CustomersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      <AppSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  );
}
