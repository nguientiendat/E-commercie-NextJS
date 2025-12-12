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
  title: "Devine Shop",
  description: "E-commerce Application",
  icons: {
    icon: "/icon.svg",
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
        {/* --- BANNER TRÁI (LEFT) --- */}
        <div className="fixed top-1/2 left-4 z-40 -translate-y-1/2 hidden 2xl:block">
          {/* Giải thích class:
               - fixed: Cố định vị trí khi scroll.
               - top-1/2: Đẩy điểm bắt đầu xuống 50% chiều cao màn hình.
               - -translate-y-1/2: Kéo ngược lên 50% chiều cao của chính nó -> Căn giữa dọc hoàn hảo.
               - left-4: Cách lề trái một chút cho đẹp.
               - pointer-events-none: Giúp click xuyên qua phần trong suốt (nếu có).
            */}
          <img
            src="/carousel/banner-doc.png"
            alt="Banner Left"
            className="h-auto w-auto max-w-[220px] max-h-[90vh] object-contain pointer-events-auto"
            /* - h-auto w-auto: Giữ nguyên tỷ lệ và kích thước gốc của ảnh.
               - max-w-[220px]: Giới hạn chiều rộng để không quá to che mất web (bạn có thể tăng số này nếu muốn to hơn).
               - max-h-[90vh]: Đảm bảo banner không cao hơn màn hình.
               - pointer-events-auto: Để người dùng có thể click vào banner (nếu sau này bạn gắn link).
            */
          />
        </div>

        {/* --- BANNER PHẢI (RIGHT) --- */}
        <div className="fixed top-1/2 right-4 z-40 -translate-y-1/2 hidden 2xl:block">
          <img
            src="/carousel/banner-doc2.png"
            alt="Banner Right"
            className="h-auto w-auto max-w-[220px] max-h-[90vh] object-contain pointer-events-auto"
          />
        </div>

        {/* Nội dung chính */}
        <div className="relative z-0">{children}</div>

        {/* Các hiệu ứng phủ (Overlay) */}
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
