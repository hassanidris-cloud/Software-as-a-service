"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type ProductItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_active: boolean;
};

type ProductManagerProps = {
  businessId: string;
  initialProducts: ProductItem[];
};

type EditableProduct = {
  id: string;
  name: string;
  description: string;
  price: string;
  isActive: boolean;
};

function toEditable(product: ProductItem): EditableProduct {
  return {
    id: product.id,
    name: product.name,
    description: product.description ?? "",
    price: String(product.price),
    isActive: product.is_active
  };
}

export function ProductManager({ businessId, initialProducts }: ProductManagerProps) {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [products, setProducts] = useState(initialProducts);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [editing, setEditing] = useState<EditableProduct | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  function onCreateImageChange(event: ChangeEvent<HTMLInputElement>) {
    setImageFile(event.target.files?.[0] ?? null);
  }

  async function uploadImage(file: File) {
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, "-");
    const filePath = `${businessId}/${crypto.randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const {
      data: { publicUrl }
    } = supabase.storage.from("product-images").getPublicUrl(filePath);

    return publicUrl;
  }

  async function onCreateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsCreating(true);

    const parsedPrice = Number.parseFloat(price);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setMessage("Please enter a valid product price.");
      setIsCreating(false);
      return;
    }

    try {
      const imageUrl = imageFile ? await uploadImage(imageFile) : null;
      const { data, error } = await supabase
        .from("products")
        .insert({
          business_id: businessId,
          name: name.trim(),
          description: description.trim() || null,
          price: parsedPrice,
          image_url: imageUrl,
          is_active: isActive
        })
        .select("id, name, description, price, image_url, is_active")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      const created = data as ProductItem;
      setProducts((current) => [created, ...current]);
      setName("");
      setDescription("");
      setPrice("");
      setIsActive(true);
      setImageFile(null);
      setMessage("Product added successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to add product.");
    } finally {
      setIsCreating(false);
    }
  }

  async function onUpdateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) {
      return;
    }

    setMessage("");
    setIsUpdating(true);
    const parsedPrice = Number.parseFloat(editing.price);

    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setMessage("Please enter a valid product price.");
      setIsUpdating(false);
      return;
    }

    const { data, error } = await supabase
      .from("products")
      .update({
        name: editing.name.trim(),
        description: editing.description.trim() || null,
        price: parsedPrice,
        is_active: editing.isActive
      })
      .eq("id", editing.id)
      .select("id, name, description, price, image_url, is_active")
      .single();

    if (error) {
      setMessage(error.message);
      setIsUpdating(false);
      return;
    }

    const updated = data as ProductItem;
    setProducts((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    setEditing(null);
    setIsUpdating(false);
    setMessage("Product updated successfully.");
  }

  async function onDeleteProduct(productId: string) {
    if (!window.confirm("Delete this product? This action cannot be undone.")) {
      return;
    }

    setMessage("");
    setIsDeletingId(productId);
    const { error } = await supabase.from("products").delete().eq("id", productId);

    if (error) {
      setMessage(error.message);
      setIsDeletingId(null);
      return;
    }

    setProducts((current) => current.filter((item) => item.id !== productId));
    setIsDeletingId(null);
    setMessage("Product deleted.");
  }

  return (
    <section className="space-y-5">
      <article className="glass-panel rounded-2xl p-5">
        <h3 className="text-lg font-medium text-white">Product Manager</h3>
        <p className="mt-1 text-sm text-slate-300">Create and maintain your storefront catalog.</p>

        <form onSubmit={onCreateProduct} className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm text-slate-200">Product name</span>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-indigo-400/60 focus:ring-2"
              placeholder="Saffron Espresso"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm text-slate-200">Price (USD)</span>
            <input
              required
              min="0"
              step="0.01"
              type="number"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-indigo-400/60 focus:ring-2"
              placeholder="6.90"
            />
          </label>

          <label className="space-y-1.5 md:col-span-2">
            <span className="text-sm text-slate-200">Description</span>
            <textarea
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-indigo-400/60 focus:ring-2"
              placeholder="Rich espresso topped with saffron cream foam."
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm text-slate-200">Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={onCreateImageChange}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-500 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white"
            />
          </label>

          <label className="inline-flex items-center gap-2 text-sm text-slate-200 md:self-end">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-500"
            />
            Visible in storefront
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isCreating}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {isCreating && <Loader2 size={16} className="animate-spin" />}
              Add Product
            </button>
          </div>
        </form>
      </article>

      <article className="glass-panel overflow-hidden rounded-2xl">
        <div className="border-b border-slate-800 px-5 py-4">
          <h3 className="text-base font-medium text-white">Catalog</h3>
        </div>

        <div className="divide-y divide-slate-800">
          {products.length === 0 ? (
            <p className="px-5 py-6 text-sm text-slate-400">No products yet. Add your first item above.</p>
          ) : (
            products.map((product) => (
              <div key={product.id} className="px-5 py-4">
                {editing?.id === product.id ? (
                  <form onSubmit={onUpdateProduct} className="grid gap-3 md:grid-cols-2">
                    <input
                      value={editing.name}
                      onChange={(event) =>
                        setEditing((current) => (current ? { ...current, name: event.target.value } : current))
                      }
                      className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-indigo-400/60 focus:ring-2"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editing.price}
                      onChange={(event) =>
                        setEditing((current) => (current ? { ...current, price: event.target.value } : current))
                      }
                      className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-indigo-400/60 focus:ring-2"
                    />
                    <textarea
                      rows={2}
                      value={editing.description}
                      onChange={(event) =>
                        setEditing((current) =>
                          current ? { ...current, description: event.target.value } : current
                        )
                      }
                      className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-indigo-400/60 focus:ring-2 md:col-span-2"
                    />
                    <label className="inline-flex items-center gap-2 text-sm text-slate-200">
                      <input
                        type="checkbox"
                        checked={editing.isActive}
                        onChange={(event) =>
                          setEditing((current) =>
                            current ? { ...current, isActive: event.target.checked } : current
                          )
                        }
                        className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-500"
                      />
                      Active
                    </label>
                    <div className="flex gap-2 md:justify-end">
                      <button
                        type="button"
                        onClick={() => setEditing(null)}
                        className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-65"
                      >
                        {isUpdating && <Loader2 size={14} className="animate-spin" />}
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{product.name}</p>
                      <p className="text-sm text-slate-400">${Number(product.price).toFixed(2)}</p>
                      {product.description && <p className="mt-1 text-sm text-slate-300">{product.description}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-200">
                        {product.is_active ? "Active" : "Hidden"}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditing(toEditable(product))}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-900"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={isDeletingId === product.id}
                        onClick={() => void onDeleteProduct(product.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-500/40 px-3 py-1.5 text-xs font-medium text-rose-200 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-65"
                      >
                        {isDeletingId === product.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </article>

      {message && <p className="text-sm text-slate-300">{message}</p>}
    </section>
  );
}
