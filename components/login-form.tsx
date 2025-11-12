"use client";

import type React from "react";

import { useState } from "react";
// import Link from "next/link" // Đã bị xóa
// import { useRouter } from "next/navigation" // Đã bị xóa
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const { toast } = useToast();
  // const router = useRouter() // Đã bị xóa

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- HÀM ĐÃ ĐƯỢC CẬP NHẬT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Gửi yêu cầu POST đến API
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Gửi email và password trong body
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Xử lý khi đăng nhập thành công (HTTP status 200-299)
        // Lấy dữ liệu JSON từ phản hồi
        const responseData = await response.json();

        // --- THÊM MỚI: LƯU VÀO LOCALSTORAGE ---
        if (responseData && responseData.data) {
          try {
            // Chuyển đối tượng data thành chuỗi JSON và lưu trữ
            localStorage.setItem("authData", JSON.stringify(responseData.data));
          } catch (storageError) {
            console.error("Failed to save to localStorage", storageError);
            // Bạn có thể thêm một toast ở đây để thông báo lỗi nếu localStorage bị đầy hoặc không được hỗ trợ
            toast({
              title: "Storage Error",
              description: "Could not save login data. Please try again.",
              variant: "destructive",
            });
          }
        }
        // --- KẾT THÚC THÊM MỚI ---

        toast({
          title: "Login Successful",
          // Sử dụng message từ API, nếu không có thì dùng message mặc định
          description:
            responseData.message || "Welcome back! Redirecting to dashboard...",
        });
        // router.push("/") // Đã thay đổi
        window.location.href = "/"; // Chuyển hướng đến trang chủ bằng API web tiêu chuẩn
      } else {
        // Xử lý khi có lỗi từ server (ví dụ: sai mật khẩu, email không tồn tại)
        let errorMessage = "Invalid email or password"; // Tin nhắn mặc định
        try {
          // Cố gắng đọc tin nhắn lỗi từ body của response
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (jsonError) {
          // Server không trả về lỗi dạng JSON, dùng tin nhắn mặc định
          console.warn("Could not parse error response as JSON", jsonError);
        }

        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive", // Hiển thị toast lỗi (màu đỏ)
        });
      }
    } catch (error) {
      // Xử lý lỗi mạng (không thể kết nối đến server)
      console.error("Login request failed:", error);
      toast({
        title: "An Error Occurred",
        description: "Could not connect to the server. Please try again later.",
        variant: "destructive",
      });
    } finally {
      // Luôn tắt trạng thái loading sau khi request hoàn tất (thành công hay thất bại)
      setIsLoading(false);
    }
  };
  // --- KẾT THÚC HÀM CẬP NHẬT ---

  return (
    <Card className="w-full max-w-md bg-white border border-gray-200">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Welcome Back
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Sign in to your account to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors({ ...errors, password: undefined });
                }}
                placeholder="••••••••"
                className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-gray-700">Remember me</span>
            </label>
            {/* <Link href="#" className="text-black hover:text-gray-700 font-medium"> // Đã thay đổi */}
            <a href="#" className="text-black hover:text-gray-700 font-medium">
              Forgot password?
              {/* </Link> */}
            </a>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white hover:bg-gray-800 py-2.5 font-medium transition disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-600">Or continue with</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-900 hover:bg-gray-50 bg-transparent"
          >
            Google
          </Button>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-900 hover:bg-gray-50 bg-transparent"
          >
            GitHub
          </Button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-gray-700">
          Don't have an account?{" "}
          {/* <Link href="/signup" className="text-black hover:text-gray-700 font-semibold"> // Đã thay đổi */}
          <a
            href="/signup"
            className="text-black hover:text-gray-700 font-semibold"
          >
            Sign up here
            {/* </Link> */}
          </a>
        </p>
      </div>
    </Card>
  );
}
