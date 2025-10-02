'use client';

import { useState, useEffect } from 'react';
import { NavigationService, Artwork } from '../navigation';

export function useNavigation(loop: string, currentArtworkId: number) {
  const [navService] = useState(() => new NavigationService(loop));
  const [nextArtwork, setNextArtwork] = useState<Artwork | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        await navService.loadArtworks();
        setNextArtwork(navService.getNextArtwork(currentArtworkId));
        setProgress(navService.getProgress(currentArtworkId));
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [navService, currentArtworkId]);

  return { nextArtwork, progress, loading };
}