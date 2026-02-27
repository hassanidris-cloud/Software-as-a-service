import { CreateBusinessForm } from "@/components/dashboard/CreateBusinessForm";
import { ProductManager } from "@/components/dashboard/ProductManager";
import { getPrimaryBusiness, requireBusinessContext } from "@/lib/auth/require-business";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function ProductsPage() {
  const { user } = await requireBusinessContext();
  const business = await getPrimaryBusiness(user.id);

  if (!business) {
    return (
      <section className="space-y-6">
        <header>
          <p className="text-sm uppercase tracking-wide text-indigo-300">Product Manager</p>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">Create your business first</h2>
        </header>
        <CreateBusinessForm ownerId={user.id} />
      </section>
    );
  }

  const supabase = await createServerSupabaseClient();
  const { data: productRows, error } = await supabase
    .from("products")
    .select("id, name, description, price, image_url, is_active")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load products: ${error.message}`);
  }

  const products = (productRows ?? []) as Array<{
    id: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    is_active: boolean;
  }>;

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <div>
          <p className="text-sm uppercase tracking-wide text-indigo-300">Product Manager</p>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">Manage your catalog with full CRUD</h2>
          <p className="text-sm text-slate-400">{business.name}</p>
        </div>
      </header>

      <ProductManager businessId={business.id} initialProducts={products} />
    </section>
  );
}
