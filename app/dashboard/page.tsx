const overviewStats = [
  { label: "Total Customers", value: "1,248" },
  { label: "Scans This Month", value: "438" },
  { label: "Rewards Redeemed", value: "91" }
];

export default function DashboardOverviewPage() {
  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-wide text-indigo-300">Overview</p>
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">Welcome back, business owner</h2>
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
          Most customers scan their cards between 4 PM and 7 PM. Consider limited-time rewards during that
          window to boost repeat purchases.
        </p>
      </article>
    </section>
  );
}
