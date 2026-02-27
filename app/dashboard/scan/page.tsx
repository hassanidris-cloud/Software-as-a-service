import { CreateBusinessForm } from "@/components/dashboard/CreateBusinessForm";
import { QrScannerPanel } from "@/components/dashboard/QrScannerPanel";
import { getPrimaryBusiness, requireAdminContext } from "@/lib/auth/require-admin";

export default async function ScanQrPage() {
  const { user } = await requireAdminContext();
  const business = await getPrimaryBusiness(user.id);

  if (!business) {
    return (
      <section className="space-y-6">
        <header>
          <p className="text-sm uppercase tracking-wide text-indigo-300">Scan QR Code</p>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">Create your business first</h2>
        </header>
        <CreateBusinessForm ownerId={user.id} />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-wide text-indigo-300">Scan QR Code</p>
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">Reward customer points instantly</h2>
        <p className="text-sm text-slate-400">Business: {business.name}</p>
      </header>

      <QrScannerPanel businessId={business.id} />
    </section>
  );
}
