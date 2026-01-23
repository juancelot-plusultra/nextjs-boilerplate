import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BearFitPH",
  description: "BearFitPH member portal",
  manifest: "/manifest.webmanifest",
  themeColor: "#0B0B0B",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BearFitPH",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
