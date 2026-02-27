import { AddProductForm } from "@/components/dashboard/AddProductForm";
import { CreateBusinessForm } from "@/components/dashboard/CreateBusinessForm";
import { getPrimaryBusiness, requireAdminContext } from "@/lib/auth/require-admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function ProductsPage() {
  const { user } = await requireAdminContext();
  const business = await getPrimaryBusiness(user.id);

  if (!business) {
    return (
      <section className="space-y-6">
        <header>
          <p className="text-sm uppercase tracking-wide text-indigo-300">My Products</p>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">Create your business first</h2>
        </header>
        <CreateBusinessForm ownerId={user.id} />
      </section>
    );
  }

  const supabase = await createServerSupabaseClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, price, is_active")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load products: ${error.message}`);
  }

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <div>
          <p className="text-sm uppercase tracking-wide text-indigo-300">My Products</p>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">Manage your catalog</h2>
          <p className="text-sm text-slate-400">{business.name}</p>
        </div>
      </header>

      <AddProductForm businessId={business.id} />

      <div className="overflow-hidden rounded-xl border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 bg-slate-900/60">
          <thead>
            <tr className="text-left text-sm text-slate-400">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3 text-slate-100">{product.name}</td>
                  <td className="px-4 py-3 text-slate-300">${Number(product.price).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-200">
                      {product.is_active ? "Active" : "Draft"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-6 text-sm text-slate-400" colSpan={3}>
                  No products yet. Use the form above to add your first item.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
