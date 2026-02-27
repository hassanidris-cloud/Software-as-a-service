import { QrCode } from "lucide-react";

export default function ScanQrPage() {
  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-wide text-indigo-300">Scan QR Code</p>
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">Reward customer points instantly</h2>
      </header>

      <article className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-6">
        <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-3 rounded-xl border border-slate-800 bg-slate-950/80 px-6 py-12 text-center">
          <QrCode size={36} className="text-indigo-400" />
          <h3 className="text-lg font-medium text-white">Scanner placeholder</h3>
          <p className="text-sm text-slate-400">
            Plug in your QR scanner component here (for example with <code>html5-qrcode</code>) and update
            loyalty points in Supabase once a customer code is verified.
          </p>
        </div>
      </article>
    </section>
  );
}
