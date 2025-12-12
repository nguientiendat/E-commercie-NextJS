"use client";

import Link from "next/link";
import { Facebook, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-auto">
      {/* CTA Section - Black Background */}
      <div className="bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          {/* Left - Illustration */}
          <div className="flex justify-center md:justify-start">
            <div className="w-64 h-48 relative">
              <Image
                src="/images/528b91cfa29c7ffd85418f4b1e8cc8ce.svg"
                alt="Account illustration"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Right - CTA Text */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Bạn chưa có tài khoản?
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Hãy tạo ngay một tài khoản để sử dụng đầy đủ các tính năng, tích
              lũy ưu đãi khi thanh toán các sản phẩm và tham gia vào chương
              trình Giới thiệu bạn bè nhận hoa hồng viên tại Divine Shop.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start items-center">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                Đăng ký ngay
              </Button>
              <span className="text-gray-300">
                Hoặc bạn đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="text-white font-semibold hover:underline"
                >
                  Đăng nhập
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Section - White Background */}
      <div className="bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center md:justify-start gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold border border-gray-200">
              MOMO
            </div>
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-red-600 border border-gray-200">
              VNPAY
            </div>
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-blue-600 border border-gray-200">
              VISA
            </div>
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
              <div className="flex gap-0.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-orange-400" />
              </div>
            </div>
          </div>
          <span className="text-sm text-gray-600">
            và nhiều hình thức thanh toán khác
          </span>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-center md:justify-start gap-3">
          <Link
            href="#"
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors"
          >
            <Facebook className="w-5 h-5 text-white" fill="white" />
          </Link>
          <Link
            href="#"
            className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors"
          >
            <Youtube className="w-5 h-5 text-white" fill="white" />
          </Link>
        </div>
      </div>

      {/* Footer Links Section */}
      <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 - About */}
          <div>
            <h3 className="font-bold text-black mb-4 uppercase text-sm">
              Giới thiệu
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-black text-sm"
                >
                  Game bản quyền là gì?
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-black text-sm"
                >
                  Giới thiệu Divine Shop
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-black text-sm"
                >
                  Điều khoản dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-black text-sm"
                >
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 - Account */}
          <div>
            <h3 className="font-bold text-black mb-4 uppercase text-sm">
              Tài khoản
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-black text-sm"
                >
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-gray-600 hover:text-black text-sm"
                >
                  Đăng ký
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Contact */}
          <div>
            <h3 className="font-bold text-black mb-4 uppercase text-sm">
              Liên hệ
            </h3>
            <ul className="space-y-2">
              <li className="text-sm">
                <span className="text-gray-600">Hotline tự động</span>{" "}
                <Link
                  href="tel:1900633305"
                  className="text-red-600 font-semibold hover:underline"
                >
                  1900 633 305
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-black text-sm"
                >
                  Liên hệ Hỗ trợ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-black text-sm"
                >
                  Chat với CSKH
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          © {new Date().getFullYear()} MyEcom. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
