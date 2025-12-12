// export const runtime = "edge"; // Bỏ comment nếu bạn deploy edge
import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import LiveNotificationHandler from "@/components/LiveNotificationHandler";
// import { Footer } from "@/components/footer"; // Đảm bảo đường dẫn đúng
import { Snowfall } from "@/components/snowfall";

// Giả sử bạn có component Footer, nếu chưa có thì comment lại dòng import ở trên
// Component Footer tạm thời (nếu bạn chưa export đúng):
const Footer = () => (
  <footer className="p-4 text-center">Footer Content</footer>
);

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
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
        <div className="fixed top-0 left-0 h-screen w-[160px] hidden 2xl:block z-0 pointer-events-none">
          {/* pointer-events-none giúp người dùng click xuyên qua banner nếu nó lỡ che mất gì đó */}
          <img
            src="/carousel/banner-doc.png"
            alt="Banner Left"
            className="w-full h-full object-contain object-left-top"
          />
        </div>

        {/* --- BANNER PHẢI --- */}
        <div className="fixed top-0 right-0 h-screen w-[160px] hidden 2xl:block z-0 pointer-events-none">
          <img
            src="/carousel/banner-doc2.png"
            alt="Banner Right"
            className="w-full h-full object-contain object-right-top"
          />
        </div>

        {/* Nội dung chính bọc trong relative z-10 để đè lên banner nếu cần */}
        <div className="relative z-10">{children}</div>

        {/* Các thành phần overlay khác */}
        <Snowfall />
        <LiveNotificationHandler />
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
