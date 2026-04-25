import type { Metadata } from "next";
import "./globals.css";
import KutAudioPlayer from "@/components/KutAudioPlayer";

export const metadata: Metadata = {
  metadataBase: new URL("https://k-kut.com"),
  title: {
    default: "K-KUT — Send a Feeling.",
    template: "%s | K-KUT",
  },
  description:
    "K-KUT turns the exact moment of a real song into a shareable audio snippet — so your message lands with meaning.",
  openGraph: {
    type: "website",
    url: "https://k-kut.com",
    siteName: "K-KUT",
    title: "K-KUT — Send a Feeling.",
    description:
      "K-KUT turns the exact moment of a real song into a shareable audio snippet — so your message lands with meaning.",
  },
  twitter: {
    card: "summary_large_image",
    title: "K-KUT — Send a Feeling.",
    description:
      "K-KUT turns the exact moment of a real song into a shareable audio snippet — so your message lands with meaning.",
  },
  alternates: {
    canonical: "https://k-kut.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-kkut-bg text-kkut-text font-sans antialiased pb-safe">
        {children}
        <KutAudioPlayer />
      </body>
    </html>
  );
}
