import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navigation } from "@/components/layout";
import { UpdateNotification } from "@/components/ui/UpdateNotification";

export const metadata: Metadata = {
  title: "레시피 비율 계산기",
  description: "레시피 재료 비율을 쉽게 계산하고 관리하세요",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "레시피 비율",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFEEE8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Gowun+Dodum&family=Jua&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-[#F5F6FA] text-[#333333]">
        <Navigation />
        <main className="pb-12">{children}</main>
        <UpdateNotification />
      </body>
    </html>
  );
}
