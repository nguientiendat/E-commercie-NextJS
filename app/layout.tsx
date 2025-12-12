// export const runtime = "edge";
import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import LiveNotificationHandler from "@/components/LiveNotificationHandler";
import { Footer } from "@/components/footer";
import { Snowfall } from "@/components/snowfall";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased relative`}>
        {/* --- BANNER TRÁI --- */}
        {/* SỬA: Tăng z-index lên z-40 để nổi lên trên nội dung trang */}
        <div className="fixed top-0 left-0 h-screen w-[160px] hidden 2xl:block z-40 pointer-events-none">
          <img
            src="/carousel/banner-doc.png"
            alt="Banner Left"
            className="w-full h-full object-contain object-left-top"
          />
        </div>

        {/* --- BANNER PHẢI --- */}
        {/* SỬA: Tăng z-index lên z-40 */}
        <div className="fixed top-0 right-0 h-screen w-[160px] hidden 2xl:block z-40 pointer-events-none">
          <img
            src="/carousel/banner-doc2.png"
            alt="Banner Right"
            className="w-full h-full object-contain object-right-top"
          />
        </div>

        {/* Nội dung chính */}
        {/* Giữ nguyên hoặc để z-0 để nằm dưới banner */}
        <div className="relative z-0">{children}</div>

        {/* Các hiệu ứng phủ (Overlay) thường để z-50 trở lên */}
        <div className="relative z-50 pointer-events-none">
          <Snowfall />
        </div>

        <LiveNotificationHandler />
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
