const products = [
  { name: "Signature Cold Brew", price: "$4.50", status: "Active" },
  { name: "Blueberry Muffin", price: "$3.20", status: "Active" },
  { name: "Seasonal Sandwich", price: "$8.90", status: "Draft" }
];

export default function ProductsPage() {
  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-indigo-300">My Products</p>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">Manage your catalog</h2>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400"
        >
          Add Product
        </button>
      </header>

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
            {products.map((product) => (
              <tr key={product.name}>
                <td className="px-4 py-3 text-slate-100">{product.name}</td>
                <td className="px-4 py-3 text-slate-300">{product.price}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-200">
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
