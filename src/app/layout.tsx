import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/layout";

export const metadata: Metadata = {
  title: "레시피 비율 계산기",
  description: "레시피 재료 비율을 쉽게 계산하고 관리하세요",
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
      </body>
    </html>
  );
}
