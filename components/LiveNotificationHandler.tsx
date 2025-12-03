"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";

// ❌ SAI: Không nên thêm /api/notification vào URL
// const SOCKET_IO_URL = `${process.env.NEXT_PUBLIC_GATEWAY_API}/api/notification`;

// ✅ ĐÚNG: Socket.IO tự động thêm /socket.io/
const SOCKET_IO_URL =
  process.env.NEXT_PUBLIC_GATEWAY_API || "https://api.nguientiendat.online";

export default function LiveNotificationHandler() {
  useEffect(() => {
    // Khởi tạo socket connection
    const socket = io(SOCKET_IO_URL, {
      transports: ["websocket", "polling"], // Thử websocket trước
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // 1. Lắng nghe sự kiện "connect"
    socket.on("connect", () => {
      console.log(`[Socket.IO] Đã kết nối thành công: ${socket.id}`);
    });

    // 2. Lắng nghe sự kiện "new-sale" (CHO THANH TOÁN)
    socket.on("new-sale", (data) => {
      console.log("Nhận được thông báo SALE MỚI:", data.message);
      toast.success(data.message, {
        icon: "🔥",
        duration: 4000,
        position: "bottom-left",
      });
    });

    // 3. Lắng nghe sự kiện "new-cart-item" (CHO GIỎ HÀNG)
    socket.on("new-cart-item", (data) => {
      console.log("Nhận được thông báo GIỎ HÀNG:", data.message);
      toast(data.message, {
        icon: "🛒",
        duration: 3000,
        position: "bottom-right",
      });
    });

    // 4. Lắng nghe lỗi
    socket.on("connect_error", (err) => {
      console.error("[Socket.IO] Lỗi kết nối:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket.IO] Ngắt kết nối:", reason);
    });

    // 5. Dọn dẹp
    return () => {
      console.log("[Socket.IO] Component unmount - Ngắt kết nối.");
      socket.disconnect();
      socket.removeAllListeners();
    };
  }, []);

  return (
    <Toaster
      position="bottom-left"
      toastOptions={{
        style: {
          background: "#333",
          color: "#fff",
        },
      }}
    />
  );
}
