"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, QrCode, ScanLine } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { LoyaltyCardRow } from "@/lib/supabase/types";

type QrScannerPanelProps = {
  businessId: string;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function QrScannerPanel({ businessId }: QrScannerPanelProps) {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
  const processingRef = useRef(false);
  const scannerElementId = "loyaltyhub-qr-reader";
  const [isStarting, setIsStarting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState("Scanner idle.");

  async function applyPoint(decodedText: string) {
    const token = decodedText.trim();
    if (!isUuid(token)) {
      setStatus("Invalid QR payload. Expected a UUID loyalty token.");
      return;
    }

    const { data, error } = await supabase.rpc("increment_loyalty_points", {
      p_business_id: businessId,
      p_qr_token: token,
      p_points_to_add: 1
    });

    if (error) {
      setStatus(`Failed to update points: ${error.message}`);
      return;
    }

    const card = (Array.isArray(data) ? data[0] : data) as LoyaltyCardRow | null;

    if (!card) {
      setStatus("Card scanned but no loyalty card was returned.");
      return;
    }

    setStatus(`Scan successful. Customer now has ${card.points} points.`);
  }

  async function stopScanner() {
    const scanner = scannerRef.current;
    if (!scanner || !isScanning) {
      return;
    }

    try {
      await scanner.stop();
      await scanner.clear();
    } catch {
      // Ignore stop errors caused by race conditions.
    } finally {
      setIsScanning(false);
    }
  }

  async function startScanner() {
    setIsStarting(true);
    setStatus("Starting camera...");

    try {
      if (!scannerRef.current) {
        const { Html5Qrcode } = await import("html5-qrcode");
        scannerRef.current = new Html5Qrcode(scannerElementId);
      }

      const scanner = scannerRef.current;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 220,
            height: 220
          }
        },
        (decodedText) => {
          if (processingRef.current) {
            return;
          }

          processingRef.current = true;
          void applyPoint(decodedText).finally(() => {
            window.setTimeout(() => {
              processingRef.current = false;
            }, 1200);
          });
        },
        () => {
          // Ignore decoding errors and keep scanning.
        }
      );

      setIsScanning(true);
      setStatus("Scanner running. Point camera at a customer QR card.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to access camera.");
    } finally {
      setIsStarting(false);
    }
  }

  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;
      if (!scanner) {
        return;
      }

      void scanner
        .stop()
        .catch(() => undefined)
        .finally(() => {
          void scanner.clear().catch(() => undefined);
        });
    };
  }, []);

  return (
    <article className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">QR Scanner</h3>
          <p className="text-sm text-slate-400">Scan customer loyalty cards and add 1 point per scan.</p>
        </div>
        {isScanning ? (
          <button
            type="button"
            onClick={() => void stopScanner()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
          >
            <ScanLine size={16} />
            Stop scanner
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void startScanner()}
            disabled={isStarting}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isStarting ? <Loader2 size={16} className="animate-spin" /> : <QrCode size={16} />}
            Start scanner
          </button>
        )}
      </div>

      <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/80 p-4">
        <div id={scannerElementId} className="mx-auto w-full max-w-md overflow-hidden rounded-lg" />
      </div>

      <p className="text-sm text-slate-300">{status}</p>
    </article>
  );
}
