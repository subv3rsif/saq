'use client';
import { useEffect, useState } from 'react';
import { scanArtwork, submitAnswer } from '@/lib/api';
import { useParams, useSearchParams, useRouter } from 'next/navigation';

export default function StepPage() {
  const { slug } = useParams<{ slug: string }>();
  const sp = useSearchParams();
  const router = useRouter();

  const [runId] = useState(sp.get('r') || sessionStorage.getItem('run_id') || '');
  const [data, setData] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        sessionStorage.setItem('run_id', runId);
        const coords = await getCoords();
        const json = await scanArtwork(runId, slug, coords || undefined);
        setData(json);
      } catch (e) {
        alert('Étape indisponible. Réessayez.');
      } finally { setLoading(false); }
    }
    load();
  }, [slug, runId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const coords = await getCoords();
      const r = await submitAnswer({ run_id: runId, artwork_id: data.artwork.id, enigma_id: data.enigma.id, answer, coords: coords || undefined });
      if (r.is_correct) {
        alert(`Bravo ! +${r.points_awarded} pts`);
        if (r.next_slug) router.push(`/step/${r.next_slug}`);
      } else {
        alert('Mauvaise réponse. Regardez bien la fresque…');
      }
    } catch (e) {
      alert('Validation impossible. Vérifiez le réseau.');
    }
  }

  if (loading) return <p>Chargement…</p>;
  if (!data) return <p>Étape introuvable.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{data.artwork.title}</h2>
      {data.artwork.photo_url && (<img src={data.artwork.photo_url} alt={data.artwork.title} className="w-full rounded" />)}
      {data.artwork.audio_url && (
        <audio controls className="w-full"><source src={data.artwork.audio_url} type="audio/mpeg" /></audio>
      )}
      <form onSubmit={onSubmit} className="space-y-2">
        <p className="font-medium">Énigme</p>
        <p>{data.enigma.prompt}</p>
        <input value={answer} onChange={e => setAnswer(e.target.value)} className="border rounded p-2 w-full" placeholder="Votre réponse" />
        <button className="rounded bg-black text-white px-4 py-2">Valider</button>
      </form>
    </div>
  );
}

async function getCoords(): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 2000 }
    );
  });
}