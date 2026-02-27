"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { UserRole } from "@/lib/supabase/types";

type AuthPanelProps = {
  errorMessage?: string;
  nextPath: string;
};

type AuthMode = "sign-in" | "sign-up";

export function AuthPanel({ errorMessage = "", nextPath }: AuthPanelProps) {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("business");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn() {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throw new Error(error.message);
    }

    const userId = data.user?.id;
    if (!userId) {
      throw new Error("Sign in succeeded but no user was returned.");
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      throw new Error(profileError.message);
    }

    const resolvedRole = (profile as { role?: UserRole } | null)?.role;

    if (resolvedRole === "business") {
      router.push(nextPath);
    } else {
      router.push("/");
    }
    router.refresh();
  }

  async function handleSignUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    setMessage("Account created. If email verification is enabled, confirm your email before signing in.");
    setMode("sign-in");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      if (mode === "sign-in") {
        await handleSignIn();
      } else {
        await handleSignUp();
      }
    } catch (error) {
      const fallback = mode === "sign-in" ? "Unable to sign in." : "Unable to create account.";
      setMessage(error instanceof Error ? error.message : fallback);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur">
      <div className="mb-5 grid grid-cols-2 rounded-lg border border-slate-800 bg-slate-950 p-1">
        <button
          type="button"
          onClick={() => setMode("sign-in")}
          className={`rounded-md px-3 py-2 text-sm font-medium transition ${
            mode === "sign-in"
              ? "bg-indigo-500 text-white"
              : "text-slate-300 hover:bg-slate-900 hover:text-white"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setMode("sign-up")}
          className={`rounded-md px-3 py-2 text-sm font-medium transition ${
            mode === "sign-up"
              ? "bg-indigo-500 text-white"
              : "text-slate-300 hover:bg-slate-900 hover:text-white"
          }`}
        >
          Sign Up
        </button>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        {mode === "sign-up" && (
          <>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-200">Full name</span>
              <input
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-indigo-400/60 placeholder:text-slate-500 focus:ring-2"
                placeholder="Alex Carter"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-200">Account type</span>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-indigo-400/60 focus:ring-2"
              >
                <option value="business">Business (Shop Owner)</option>
                <option value="customer">Customer</option>
              </select>
            </label>
          </>
        )}

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-200">Email address</span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-indigo-400/60 placeholder:text-slate-500 focus:ring-2"
            placeholder="owner@coffeehouse.com"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-200">Password</span>
          <input
            required
            minLength={6}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-indigo-400/60 placeholder:text-slate-500 focus:ring-2"
            placeholder="••••••••"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          {mode === "sign-in" ? "Sign in to Dashboard" : "Create account"}
        </button>
      </form>

      {(errorMessage || message) && (
        <p className="mt-4 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-300">
          {errorMessage || message}
        </p>
      )}
    </section>
  );
}
