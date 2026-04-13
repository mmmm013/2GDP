import type { Metadata } from "next";
import "@fontsource-variable/space-grotesk";
import "./globals.css";
import DevDiagnostic from "../components/DevDiagnostic";

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
      <body className="bg-kkut-bg text-kkut-text font-sans antialiased">
        {process.env.NODE_ENV === "development" && <DevDiagnostic />}
        {children}
      </body>
    </html>
  );
}
