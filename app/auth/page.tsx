import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { AuthPanel } from "@/components/auth/AuthPanel";

type AuthPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  admin_only: "This dashboard is only available for admin (shop owner) accounts.",
  profile_missing: "We could not find your profile. Please sign in again."
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = await searchParams;
  const errorMessage = params.error ? errorMessages[params.error] : "";
  const nextPath = params.next ?? "/dashboard";

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
        <section className="space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-200">
            <ShieldCheck size={16} />
            LoyaltyHub Access
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Sign in to manage your digital loyalty program
          </h1>
          <p className="max-w-lg text-slate-300">
            Admin accounts can manage products and scan customer QR cards. Customer accounts can hold and
            collect loyalty points.
          </p>
          <Link
            href="/"
            className="inline-flex rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-900"
          >
            Back to landing page
          </Link>
        </section>

        <AuthPanel errorMessage={errorMessage} nextPath={nextPath} />
      </div>
    </main>
  );
}
