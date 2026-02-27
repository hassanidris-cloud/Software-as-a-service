import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { getPrimaryBusiness, requireBusinessContext } from "@/lib/auth/require-business";

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, profile } = await requireBusinessContext();
  const business = await getPrimaryBusiness(user.id);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col md:flex-row">
        <DashboardSidebar
          fullName={profile.full_name ?? user.email ?? "Business Owner"}
          businessName={business?.name ?? null}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
