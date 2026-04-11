import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'K-KUT — Exact Audio Excerpts from Original PIX',
  description: 'K-KUT: the exact audio excerpt from original PIX via 4PE-BIZ-MSC. Stream. Feel. Connect.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white">{children}</body>
    </html>
  );
}
