// src/app/scan/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { scan } from "@/lib/saq";      // alias "@/lib/*" si tsconfig paths configurés
import { Store } from "@/lib/store";
import { getCoords } from "@/lib/geo";

export default function ScanPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const [msg, setMsg] = useState("Scan en cours…");

  useEffect(() => {
    // 1) LECTURE + VALIDATION DES PARAMS QR/NFC
    const loop = sp.get("loop") || Store.loop;
    const slug = sp.get("slug") || "";
    const isLoopOk = /^(nord|centre_nord|centre_sud|sud)$/.test(loop || "");
    const isSlugOk = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

    if (!isLoopOk || !isSlugOk) {
      setMsg("QR invalide. Réessayez depuis l’app.");
      return;
    }
    // on persiste localement pour la session
    Store.loop = loop!;
    Store.lastSlug = slug;

    // 2) CONTRÔLE RUN EN COURS
    if (!Store.runId) {
      setMsg("Aucune partie en cours. Retour à l’accueil…");
      const t = setTimeout(() => router.push("/"), 1200);
      return () => clearTimeout(t);
    }

    // 3) APPEL /api/scan (avec géoloc seulement si nécessaire)
    (async () => {
      try {
        let body: any = await scan({ run_id: Store.runId, artwork_ref: { slug } });

        if (body?.geo_required) {
          const coords = await getCoords().catch(() => null);
          body = await scan({ run_id: Store.runId, artwork_ref: { slug }, coords: coords || undefined });
        }

        if (body?.error) {
          setMsg(body.error === "TOO_FAR" ? "Vous êtes trop loin de l’œuvre." : body.error);
          return;
        }

        // 4) NAVIGATION ENIGME / ŒUVRE
        if (body?.enigma?.id) {
          router.replace(`/enigma/${body.enigma.id}?slug=${encodeURIComponent(slug)}`);
        } else {
          router.replace(`/artwork/${encodeURIComponent(slug)}`);
        }
      } catch (e: any) {
        setMsg(e.message || "Erreur réseau.");
      }
    })();
  }, [sp, router]);

  return (
    <main className="p-6 text-center">
      <h1 className="text-xl font-semibold">Street Art Quest</h1>
      <p className="mt-4 opacity-80">{msg}</p>
    </main>
  );
}
