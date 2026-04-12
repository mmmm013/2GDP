import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GPEx Business — Excel-A-rator',
  description: 'GPEx Business Excel-A-rator | 4PE-BIZ Platform | Central IL Industry Acceleration',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gpex-dark text-white antialiased">{children}</body>
    </html>
  );
}
