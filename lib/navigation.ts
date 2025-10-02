export interface Artwork {
  id: number;
  slug: string;
  title: string;
  artist: string;
  year: string;
  sort_index: number;
  loop: string;
  lat: number;
  lng: number;
  radius_m: number;
  photo_url: string;
  audio_url: string;
  address: string;
}

interface ArtworksResponse {
  success: boolean;
  loop: string;
  total: number;
  artworks: Artwork[];
}

export class NavigationService {
  private artworks: Artwork[] = [];
  private currentLoop: string = '';
  private baseUrl = 'https://n8n.stereogram.me/webhook/webhook';

  constructor(loop: string) {
    this.currentLoop = loop;
  }

  async loadArtworks(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/artworks?loop=${this.currentLoop}`);
      const data: ArtworksResponse = await response.json();
      
      if (data.success) {
        this.artworks = data.artworks;
      }
    } catch (error) {
      console.error('Erreur chargement artworks:', error);
      throw error;
    }
  }

  getNextArtwork(currentArtworkId: number): Artwork | null {
    const currentIndex = this.artworks.findIndex(a => a.id === currentArtworkId);
    if (currentIndex === -1 || currentIndex === this.artworks.length - 1) {
      return null;
    }
    return this.artworks[currentIndex + 1];
  }

  getPreviousArtwork(currentArtworkId: number): Artwork | null {
    const currentIndex = this.artworks.findIndex(a => a.id === currentArtworkId);
    if (currentIndex <= 0) return null;
    return this.artworks[currentIndex - 1];
  }

  getProgress(currentArtworkId: number): { current: number; total: number; percentage: number } {
    const currentIndex = this.artworks.findIndex(a => a.id === currentArtworkId);
    return {
      current: currentIndex + 1,
      total: this.artworks.length,
      percentage: Math.round(((currentIndex + 1) / this.artworks.length) * 100)
    };
  }

  getAllArtworks(): Artwork[] {
    return this.artworks;
  }
}
