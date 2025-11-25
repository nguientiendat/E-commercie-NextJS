"use client";

import React, { useState, useEffect } from "react";
// Đã thay thế 'Link' bằng 'a'
import { ShoppingBag, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

// Định nghĩa cấu trúc dữ liệu mong đợi từ localStorage
interface AuthData {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    token: string;
  };
  token: string;
}

// Navbar sẽ tự quản lý trạng thái đăng nhập bằng cách đọc từ localStorage
export function Navbar() {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [cartCount, setCartCount] = useState(0); // Giữ nguyên logic giỏ hàng

  // Kiểm tra localStorage khi component được tải lần đầu
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("authData");
      if (storedData) {
        setAuthData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to parse authData from localStorage", error);
      // Nếu dữ liệu bị hỏng, xóa nó đi
      localStorage.removeItem("authData");
    }
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy một lần khi mount

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("authData"); // Xóa dữ liệu đăng nhập
    setAuthData(null); // Cập nhật trạng thái của component
    window.location.href = "/login"; // Chuyển hướng về trang đăng nhập
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <span className="text-xl font-bold text-black">MyEcom</span>
          </a>

          {/* Center - Products Link */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-700 hover:text-black font-medium">
              Products
            </a>
          </div>

          {/* Right - Cart and Auth */}
          <div className="flex items-center gap-4">
            <a href="/cart" className="relative">
              <ShoppingBag className="w-6 h-6 text-gray-700 hover:text-black" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </a>

            {/* --- LOGIC HIỂN THỊ ĐĂNG NHẬP --- */}
            {authData && authData.user ? (
              // Đã đăng nhập
              <>
                <a href="/profile" title={authData.user.email}>
                  <User className="w-6 h-6 text-gray-700 hover:text-black" />
                </a>
                {/* Hiển thị email, ẩn trên màn hình nhỏ */}
                <span
                  className="hidden sm:block text-sm text-gray-700 truncate max-w-[150px]"
                  title={authData.user.email}
                >
                  {authData.user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 bg-transparent"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              // Chưa đăng nhập
              <a href="/login">
                <Button size="sm">Login</Button>
              </a>
            )}
            {/* --- KẾT THÚC LOGIC HIỂN THỊ --- */}
          </div>
        </div>
      </div>
    </nav>
  );
}
