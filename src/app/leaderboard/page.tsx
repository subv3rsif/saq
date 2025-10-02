'use client';
import { useEffect, useState } from 'react';
import { getLeaderboard } from '@/lib/api';

export default function LeaderboardPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { (async () => setRows((await getLeaderboard()).top || []))(); }, []);
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Classement du mois</h2>
      <ol className="space-y-1">
        {rows.map((r, i) => (
          <li key={i}>{r.rank}. {r.pseudo} — {r.score} pts</li>
        ))}
      </ol>
    </div>
  );
}