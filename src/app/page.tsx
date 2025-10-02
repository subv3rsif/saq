'use client';
import { useEffect, useState } from 'react';
import { startRun } from '@/lib/api';
import { getDeviceUUID } from '@/lib/device';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [loop, setLoop] = useState(process.env.NEXT_PUBLIC_DEFAULT_LOOP || 'Nord');
  const [pseudo, setPseudo] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => { getDeviceUUID(); }, []);

  async function handleStart() {
    try {
      setLoading(true);
      const r = await startRun(loop, pseudo || undefined);
      router.push(r.first_slug ? `/step/${r.first_slug}` : '/map');
    } catch (e) {
      alert('Impossible de démarrer. Réessayez.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Couleurs d’Alfortville</h1>
      <p>Choisissez une boucle et lancez la quête. Vous pourrez changer à tout moment.</p>
      <div className="space-y-2">
        <label className="block text-sm">Boucle</label>
        <select value={loop} onChange={e => setLoop(e.target.value)} className="border rounded p-2 w-full">
          <option>Nord</option>
          <option>Centre</option>
          <option>Sud</option>
          <option>All</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-sm">Pseudo (optionnel)</label>
        <input value={pseudo} onChange={e => setPseudo(e.target.value)} className="border rounded p-2 w-full" placeholder="Camille" />
      </div>
      <button onClick={handleStart} disabled={loading} className="rounded-lg bg-black text-white px-4 py-2">
        {loading ? 'Chargement…' : 'Démarrer la quête'}
      </button>
      <p className="text-xs text-gray-500">En jouant, vous acceptez les règles de sécurité et la politique RGPD.</p>
    </div>
  );