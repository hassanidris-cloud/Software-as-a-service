"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { slugify } from "@/lib/utils/slugify";

type CreateBusinessFormProps = {
  ownerId: string;
};

export function CreateBusinessForm({ ownerId }: CreateBusinessFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [themePreset, setThemePreset] = useState<"indigo" | "violet" | "cyan">("indigo");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const themeMap = {
    indigo: { accent: "#6366f1", glow: "#8b5cf6", surface: "#0b1220" },
    violet: { accent: "#8b5cf6", glow: "#c084fc", surface: "#120f25" },
    cyan: { accent: "#06b6d4", glow: "#22d3ee", surface: "#0a1720" }
  } as const;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    const resolvedSlug = slugify(slug || name);
    if (!resolvedSlug) {
      setMessage("Please provide a valid business name.");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.from("businesses").insert({
      owner_id: ownerId,
      name: name.trim(),
      slug: resolvedSlug,
      description: description.trim() || null,
      logo_url: logoUrl.trim() || null,
      theme_config: {
        preset: themePreset,
        ...themeMap[themePreset]
      }
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    setMessage("Business created successfully.");
    setName("");
    setSlug("");
    setDescription("");
    setLogoUrl("");
    setThemePreset("indigo");
    setIsLoading(false);
    router.refresh();
  }

  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <h3 className="text-lg font-medium text-white">Set up your business profile</h3>
      <p className="mt-1 text-sm text-slate-400">
        You need one business profile before adding products or scanning loyalty cards.
      </p>

      <form className="mt-5 space-y-4" onSubmit={onSubmit}>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-200">Business name</span>
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-indigo-400/60 placeholder:text-slate-500 focus:ring-2"
            placeholder="Indigo Coffee House"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-200">Slug (optional)</span>
          <input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-indigo-400/60 placeholder:text-slate-500 focus:ring-2"
            placeholder="indigo-coffee-house"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-200">Description</span>
          <textarea
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-indigo-400/60 placeholder:text-slate-500 focus:ring-2"
            placeholder="A neighborhood cafe serving artisan coffee and fresh pastries."
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-200">Logo URL (optional)</span>
          <input
            value={logoUrl}
            onChange={(event) => setLogoUrl(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-indigo-400/60 placeholder:text-slate-500 focus:ring-2"
            placeholder="https://cdn.yourbrand.com/logo.png"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-200">3D theme preset</span>
          <select
            value={themePreset}
            onChange={(event) => setThemePreset(event.target.value as "indigo" | "violet" | "cyan")}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-indigo-400/60 focus:ring-2"
          >
            <option value="indigo">Indigo Neon</option>
            <option value="violet">Violet Glow</option>
            <option value="cyan">Cyan Pulse</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          Create Business
        </button>

        {message && <p className="text-sm text-slate-300">{message}</p>}
      </form>
    </article>
  );
}
