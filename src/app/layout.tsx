import './globals.css';
import type { Metadata } from 'next';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'Street Art Quest – Alfortville',
  description: 'Chasse aux trésors street art – PWA',
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-[100dvh] bg-white text-gray-900">
        <ServiceWorkerRegister />
        <main className="mx-auto max-w-3xl p-4">{children}</main>
      </body>
    </html>
  );
}
