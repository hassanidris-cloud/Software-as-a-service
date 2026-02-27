import { CreateBusinessForm } from "@/components/dashboard/CreateBusinessForm";
import { QrScannerPanel } from "@/components/dashboard/QrScannerPanel";
import { getPrimaryBusiness, requireBusinessContext } from "@/lib/auth/require-business";

export default async function ScanQrPage() {
  const { user } = await requireBusinessContext();
  const business = await getPrimaryBusiness(user.id);

  if (!business) {
    return (
      <section className="space-y-6">
        <header>
          <p className="text-sm uppercase tracking-wide text-indigo-300">Stamp Scanner</p>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">Create your business first</h2>
        </header>
        <CreateBusinessForm ownerId={user.id} />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-wide text-indigo-300">Stamp Scanner</p>
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">Validate customer QR and issue stamps</h2>
        <p className="text-sm text-slate-400">Business: {business.name}</p>
      </header>

      <QrScannerPanel businessId={business.id} />
    </section>
  );
}
