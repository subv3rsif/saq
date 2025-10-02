'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LOOPS, normalizeLoop, type Loop } from '@/lib/loops';
import { startRun } from '@/lib/api';
import { getDeviceUUID } from '@/lib/device';

export default function StartPage() {
  const router = useRouter();
  const params = useSearchParams();
  const loopFromURL = useMemo(() => normalizeLoop(params.get('loop')), [params]);
  const [loop, setLoop] = useState<Loop | null>(loopFromURL);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Si une boucle valide est présente dans l’URL, on tente de démarrer automatiquement.
  useEffect(() => {
    if (!loopFromURL) return;
    void handleStart(loopFromURL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loopFromURL]);

  async function handleStart(chosen: Loop) {
    try {
      setErr(null);
      setLoading(true);
      const device_uuid = getDeviceUUID();
      // TODO: adapte pseudo si nécessaire
      const res = await startRun({ device_uuid, loop: chosen, pseudo: 'Guest' });
      // Redirige vers la première énigme / l’écran de jeu
      router.replace('/step'); // ou `/step?loop=${chosen}` si besoin
    } catch (e: any) {
      setErr(e?.message ?? 'Erreur au démarrage du parcours');
    } finally {
      setLoading(false);
    }
  }

  // Si l’URL ne fournit pas de loop valide -> UI fallback (sélecteur)
  if (!loopFromURL) {
    return (
      <main className="p-4 space-y-4">
        <h1 className="text-2xl font-semibold">Choisir une boucle</h1>
        <div className="grid grid-cols-2 gap-3">
          {LOOPS.map((v) => (
            <button
              key={v}
              onClick={() => setLoop(v)}
              className={`rounded-xl border px-4 py-3 text-left ${loop === v ? 'border-black' : 'border-gray-300'}`}
            >
              <div className="font-medium">{labelFor(v)}</div>
              <div className="text-sm text-gray-500">{v}</div>
            </button>
          ))}
        </div>

        <button
          disabled={!loop || loading}
          onClick={() => loop && handleStart(loop)}
          className="rounded-xl px-4 py-3 bg-black text-white disabled:opacity-50"
        >
          {loading ? 'Démarrage…' : 'Commencer'}
        </button>

        {err && <p className="text-red-600">{err}</p>}
      </main>
    );
  }

  // Cas auto (URL) : petit écran d’attente
  return (
    <main className="p-4">
      <p>Démarrage du parcours <strong>{loopFromURL}</strong>…</p>
      {err && <p className="text-red-600 mt-2">{err}</p>}
    </main>
  );
}

function labelFor(loop: Loop) {
  switch (loop) {
    case 'nord': return 'Boucle Nord';
    case 'centre_nord': return 'Boucle Centre-Nord';
    case 'centre_sud': return 'Boucle Centre-Sud';
    case 'sud': return 'Boucle Sud';
  }
}
