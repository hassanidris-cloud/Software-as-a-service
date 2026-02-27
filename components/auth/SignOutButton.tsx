"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function SignOutButton() {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignOut() {
    setIsLoading(true);
    await supabase.auth.signOut();
    router.push("/auth");
    router.refresh();
    setIsLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isLoading}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
      Sign out
    </button>
  );
}
