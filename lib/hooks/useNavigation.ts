'use client';

import { useState, useEffect } from 'react';
import { NavigationService, Artwork } from '../navigation';

export function useNavigation(loop: string, currentArtworkId: number) {
  const [navService] = useState(() => new NavigationService(loop));
  const [nextArtwork, setNextArtwork] = useState<Artwork | null>(null);
  const [previousArtwork, setPreviousArtwork] = useState<Artwork | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        await navService.loadArtworks();
        setNextArtwork(navService.getNextArtwork(currentArtworkId));
        setPreviousArtwork(navService.getPreviousArtwork(currentArtworkId));
        setProgress(navService.getProgress(currentArtworkId));
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
        setLoading(false);
      }
    }
    init();
  }, [navService, currentArtworkId]);

  return { nextArtwork, previousArtwork, progress, loading, error };
}
