"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type AddProductFormProps = {
  businessId: string;
};

export function AddProductForm({ businessId }: AddProductFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    setImageFile(event.target.files?.[0] ?? null);
  }

  async function uploadImageIfNeeded() {
    if (!imageFile) {
      return null;
    }

    const safeName = imageFile.name.toLowerCase().replace(/[^a-z0-9.-]/g, "-");
    const filePath = `${businessId}/${crypto.randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, imageFile, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const {
      data: { publicUrl }
    } = supabase.storage.from("product-images").getPublicUrl(filePath);

    return publicUrl;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const parsedPrice = Number.parseFloat(price);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setMessage("Please provide a valid price.");
      setIsLoading(false);
      return;
    }

    try {
      const imageUrl = await uploadImageIfNeeded();

      const { error } = await supabase.from("products").insert({
        business_id: businessId,
        name: name.trim(),
        description: description.trim() || null,
        price: parsedPrice,
        image_url: imageUrl,
        is_active: isActive
      });

      if (error) {
        throw new Error(error.message);
      }

      setMessage("Product created successfully.");
      setName("");
      setDescription("");
      setPrice("");
      setIsActive(true);
      setImageFile(null);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create product.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <h3 className="text-lg font-medium text-white">Add Product</h3>
      <p className="mt-1 text-sm text-slate-400">
        Upload an image and publish your product to your business profile.
      </p>

      <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
        <label className="block space-y-1.5 md:col-span-1">
          <span className="text-sm font-medium text-slate-200">Product name</span>
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-indigo-400/60 focus:ring-2"
            placeholder="Signature Cold Brew"
          />
        </label>

        <label className="block space-y-1.5 md:col-span-1">
          <span className="text-sm font-medium text-slate-200">Price (USD)</span>
          <input
            required
            min="0"
            step="0.01"
            type="number"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-indigo-400/60 focus:ring-2"
            placeholder="4.50"
          />
        </label>

        <label className="block space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium text-slate-200">Description</span>
          <textarea
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-indigo-400/60 focus:ring-2"
            placeholder="Slow-steeped coffee, bold flavor, and smooth finish."
          />
        </label>

        <label className="block space-y-1.5 md:col-span-1">
          <span className="text-sm font-medium text-slate-200">Product image</span>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-500 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-indigo-400"
          />
        </label>

        <label className="inline-flex items-center gap-2 text-sm text-slate-200 md:col-span-1 md:self-end">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
            className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-500"
          />
          Active product
        </label>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            Save Product
          </button>
        </div>
      </form>

      {message && <p className="mt-3 text-sm text-slate-300">{message}</p>}
    </article>
  );
}
