import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center px-8 justify-between">
          <h2 className="font-medium text-slate-700 uppercase tracking-wider text-sm">
            Inventory System v1.0
          </h2>
          <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300" />
        </header>

        <div className="p-8 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
