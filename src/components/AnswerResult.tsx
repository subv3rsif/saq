'use client';

import { useRouter } from 'next/navigation';
import { useNavigation } from '@/lib/hooks/useNavigation';

interface Props {
  isCorrect: boolean;
  explanation: string;
  pointsAwarded: number;
  currentArtworkId: number;
  loop: string;
}

export function AnswerResult({ isCorrect, explanation, pointsAwarded, currentArtworkId, loop }: Props) {
  const router = useRouter();
  const { nextArtwork, progress, loading } = useNavigation(loop, currentArtworkId);

  if (!isCorrect) {
    return (
      <div className="p-6 bg-red-100 rounded-lg">
        <h2 className="text-xl font-bold text-red-800">Réponse incorrecte</h2>
        <p className="mt-2">Réessayez !</p>
      </div>
    );
  }

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="p-6 bg-green-100 rounded-lg">
      <h2 className="text-2xl font-bold text-green-800">Bonne réponse !</h2>
      <p className="mt-2 text-lg">+{pointsAwarded} points</p>
      <p className="mt-4">{explanation}</p>
      
      <div className="mt-4 text-sm">
        Progression : {progress.current} / {progress.total} ({progress.percentage}%)
      </div>

      {nextArtwork ? (
        <button 
          onClick={() => router.push(`/step/${nextArtwork.slug}`)}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Suivant : {nextArtwork.title}
        </button>
      ) : (
        <div className="mt-6 p-4 bg-yellow-100 rounded">
          Parcours terminé ! 🎉
        </div>
      )}
    </div>
  );
}