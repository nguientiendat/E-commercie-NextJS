"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export function Navbar() {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("authData");
      if (storedData) {
        setAuthData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to parse authData from localStorage", error);
      localStorage.removeItem("authData");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authData");
    setAuthData(null);
    window.location.href = "/login";
  };

  return (
    // THAY ĐỔI 1: Đổi màu nền sang #630A0E và viền sang màu đỏ đậm hơn chút để tệp màu
    <nav className="sticky top-0 z-50 bg-[#630A0E] border-b border-[#4a070a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* THAY ĐỔI 2: Logo hình ảnh */}
          <a href="/" className="flex-shrink-0 flex items-center">
            <img
              src="/carousel/logo.png"
              alt="Logo"
              className="h-10 w-auto object-contain" // Điều chỉnh chiều cao cho vừa navbar
            />
          </a>

          {/* Center - Products Link */}
          <div className="hidden md:flex items-center gap-8">
            {/* Chuyển text sang màu trắng cho dễ đọc trên nền đỏ */}
            <a
              href="/"
              className="text-gray-200 hover:text-white font-medium transition-colors"
            >
              Products
            </a>
          </div>

          {/* Right - Cart and Auth */}
          <div className="flex items-center gap-4">
            <a href="/cart" className="relative">
              {/* Chuyển icon sang màu trắng */}
              <ShoppingBag className="w-6 h-6 text-gray-200 hover:text-white transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-[#630A0E] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </a>

            {/* --- LOGIC HIỂN THỊ ĐĂNG NHẬP --- */}
            {authData && authData.user ? (
              <>
                <a href="/profile" title={authData.user.email}>
                  <User className="w-6 h-6 text-gray-200 hover:text-white transition-colors" />
                </a>

                <span
                  className="hidden sm:block text-sm text-gray-200 truncate max-w-[150px]"
                  title={authData.user.email}
                >
                  {authData.user.email}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  // Chỉnh style nút logout để hợp với nền tối
                  className="gap-2 bg-transparent border-gray-400 text-gray-200 hover:bg-white/10 hover:text-white hover:border-white"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <a href="/login">
                {/* Nút Login đổi sang màu trắng chữ đỏ để nổi bật */}
                <Button
                  size="sm"
                  className="bg-white text-[#630A0E] hover:bg-gray-100"
                >
                  Login
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
