import { CreateBusinessForm } from "@/components/dashboard/CreateBusinessForm";
import { getPrimaryBusiness, requireBusinessContext } from "@/lib/auth/require-business";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function monthStartIso() {
  const date = new Date();
  date.setUTCDate(1);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
}

export default async function DashboardOverviewPage() {
  const { user } = await requireBusinessContext();
  const business = await getPrimaryBusiness(user.id);

  if (!business) {
    return (
      <section className="space-y-6">
        <header>
          <p className="text-sm uppercase tracking-wide text-indigo-300">Overview</p>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">Welcome to your dashboard</h2>
        </header>

        <CreateBusinessForm ownerId={user.id} />
      </section>
    );
  }

  const supabase = await createServerSupabaseClient();
  const [customerCardsResult, productsResult, monthlyScansResult] = await Promise.all([
    supabase.from("loyalty_cards").select("*", { head: true, count: "exact" }).eq("business_id", business.id),
    supabase
      .from("products")
      .select("*", { head: true, count: "exact" })
      .eq("business_id", business.id)
      .eq("is_active", true),
    supabase
      .from("loyalty_cards")
      .select("*", { head: true, count: "exact" })
      .eq("business_id", business.id)
      .gte("last_scanned_at", monthStartIso())
  ]);

  const overviewStats = [
    { label: "Total Customers", value: String(customerCardsResult.count ?? 0) },
    { label: "Scanned This Month", value: String(monthlyScansResult.count ?? 0) },
    { label: "Active Products", value: String(productsResult.count ?? 0) }
  ];

  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-wide text-indigo-300">Overview</p>
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">{business.name}</h2>
        <p className="mt-1 text-sm text-slate-400">Manage your profile, products, and loyalty activity.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {overviewStats.map((stat) => (
          <article key={stat.label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
          </article>
        ))}
      </div>

      <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h3 className="mb-2 text-base font-medium text-white">Quick insight</h3>
        <p className="text-sm text-slate-300">
          Keep your best-selling products active and visible. Pair product launches with bonus scan campaigns
          to accelerate repeat visits.
        </p>
      </article>
    </section>
  );
}
