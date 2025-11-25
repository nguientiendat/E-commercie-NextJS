"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";

const SOCKET_IO_URL = `${process.env.NEXT_PUBLIC_GATEWAY_API}/api/notification`;
const socket = io(SOCKET_IO_URL);

export default function LiveNotificationHandler() {
  useEffect(() => {
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

    // 3. === THÊM LOGIC MỚI TẠI ĐÂY ===
    // Lắng nghe sự kiện "new-cart-item" (CHO GIỎ HÀNG)
    socket.on("new-cart-item", (data) => {
      console.log("Nhận được thông báo GIỎ HÀNG:", data.message);

      // Dùng một style khác để phân biệt
      toast(data.message, {
        icon: "🛒",
        duration: 3000,
        position: "bottom-right",
      });
    });
    // === KẾT THÚC LOGIC MỚI ===

    // 4. Lắng nghe lỗi (nên có)
    socket.on("connect_error", (err) => {
      console.error("[Socket.IO] Lỗi kết nối:", err.message);
    });

    // 5. Dọn dẹp (Quan trọng)
    return () => {
      console.log("[Socket.IO] Ngắt kết nối.");
      socket.disconnect();
      socket.off("connect");
      socket.off("new-sale");
      socket.off("new-cart-item"); // <-- Thêm dọn dẹp
      socket.off("connect_error");
    };
  }, []);

  // Component này "vô hình", nó chỉ render <Toaster/>
  return (
    <Toaster
      position="bottom-left"
      toastOptions={{
        // Định nghĩa style chung nếu bạn muốn
        style: {
          background: "#333",
          color: "#fff",
        },
      }}
    />
  );
}
