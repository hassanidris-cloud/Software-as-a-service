import { DashboardSidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col md:flex-row">
        <DashboardSidebar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
