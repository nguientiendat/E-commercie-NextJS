"use client";

import React, { useEffect, useState } from "react"; // <-- SỬA LỖI: Thêm 'React'
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  Check,
  Package,
  Home,
  Clock,
  CreditCard,
  ChevronRight,
  LogOut,
  User,
  ShoppingBag,
} from "lucide-react";

// --- HÀM HỖ TRỢ VÀ COMPONENT MẪU ---

// Định nghĩa cấu trúc authData
interface AuthData {
  user: {
    email: string;
  };
  token: string;
}

// Component Mẫu: Button
export function Button({
  children,
  onClick,
  className,
  variant,
  size,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  className?: string;
  variant?: string;
  size?: string;
  disabled?: boolean;
}) {
  const baseStyle =
    "px-4 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center";
  const variantStyle =
    variant === "outline"
      ? "bg-transparent border border-gray-300 text-gray-900 hover:bg-gray-50"
      : "bg-black text-white hover:bg-gray-800 disabled:opacity-50";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyle} ${className || ""}`}
    >
      {children}
    </button>
  );
}

// Component Mẫu: Card
export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
}

// Component Mẫu: Navbar
export function Navbar() {
  const [authInfo, setAuthInfo] = useState<{ email: string } | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleCartUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (typeof customEvent.detail.newCount === "number") {
        setCartCount(customEvent.detail.newCount);
      }
    };
    window.addEventListener("cartUpdated", handleCartUpdate);

    try {
      const storedData = localStorage.getItem("authData");
      if (storedData) {
        const authData: AuthData = JSON.parse(storedData);
        if (authData.user && authData.user.email) {
          setAuthInfo({ email: authData.user.email });
        }
      }
      const storedCartCount = localStorage.getItem("cartCount");
      if (storedCartCount) {
        setCartCount(parseInt(storedCartCount, 10));
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
      localStorage.removeItem("authData");
      localStorage.removeItem("cartCount");
    }

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authData");
    localStorage.removeItem("cartCount");
    setAuthInfo(null);
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex-shrink-0">
            <span className="text-xl font-bold text-black">MyEcom</span>
          </a>
          <a href="/" className="text-gray-700 hover:text-black font-medium">
            Products
          </a>
          <div className="flex items-center gap-4">
            <a href="/cart" className="relative">
              <ShoppingBag className="w-6 h-6 text-gray-700 hover:text-black" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </a>
            {authInfo ? (
              <>
                <a
                  href="/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-black"
                >
                  <User className="w-6 h-6" />
                  <span className="text-sm font-medium hidden sm:block truncate max-w-xs">
                    {authInfo.email}
                  </span>
                </a>
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
              <a href="/login">
                <Button size="sm">Login</Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Component Mẫu: CheckoutSteps
const stepsConfig = [
  { id: 1, title: "Processing", status: "CREATING_ORDER" },
  { id: 2, title: "Payment", status: "POLLING_PAYMENT" },
  { id: 3, title: "Confirmation", status: "REDIRECTING" },
];

export function CheckoutSteps({ currentStatus }: { currentStatus: string }) {
  const activeIndex = stepsConfig.findIndex((s) => s.status === currentStatus);

  return (
    <nav className="flex items-center justify-center" aria-label="Progress">
      {stepsConfig.map((step, index) => (
        <React.Fragment key={step.id}>
          {index > 0 && (
            <div
              className={`flex-1 h-0.5 ${
                index <= activeIndex ? "bg-black" : "bg-gray-200"
              }`}
            />
          )}
          <div className="flex flex-col items-center px-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index < activeIndex
                  ? "bg-black text-white"
                  : index === activeIndex
                  ? "bg-black text-white ring-4 ring-gray-300"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {index < activeIndex ? (
                <Check size={20} />
              ) : (
                <span>{step.id}</span>
              )}
            </div>
            <p
              className={`mt-2 text-sm font-medium ${
                index <= activeIndex ? "text-black" : "text-gray-500"
              }`}
            >
              {step.title}
            </p>
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
}
// --- KẾT THÚC COMPONENT MẪU ---

// --- COMPONENT TRANG CHECKOUT CHÍNH ---
export default function CheckoutPage() {
  // Trạng thái mới: Dùng string thay vì số
  const [status, setStatus] = useState<
    "CREATING_ORDER" | "POLLING_PAYMENT" | "REDIRECTING" | "ERROR"
  >("CREATING_ORDER");
  const [statusMessage, setStatusMessage] = useState(
    "Please wait while we verify your information..."
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;
    let attempts = 0;
    const maxAttempts = 20; // Giới hạn polling (20 * 3s = 1 phút)

    const startCheckoutProcess = async () => {
      // 1. Lấy token
      let token: string | null = null;
      try {
        const storedData = localStorage.getItem("authData");
        if (!storedData) {
          throw new Error("You must be logged in to check out.");
        }
        token = (JSON.parse(storedData) as AuthData).token;
      } catch (error: any) {
        setStatus("ERROR");
        setErrorMessage(error.message || "Authentication failed.");
        toast({
          title: "Auth Error",
          description: error.message,
          variant: "destructive",
        });
        window.location.href = "/login";
        return;
      }

      // 2. GỌI API 1: /createorder
      try {
        setStatus("CREATING_ORDER");
        setStatusMessage("Please wait while we prepare your order...");

        // --- SỬA ĐỔI: Lấy response
        const createOrderResponse = await axios.get(
          "http://localhost:3005/creatoreder",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // --- THÊM MỚI: Lấy orderId từ response
        if (
          !createOrderResponse.data ||
          !createOrderResponse.data.order ||
          !createOrderResponse.data.order._id
        ) {
          throw new Error("Invalid response received from createorder API.");
        }
        const orderId = createOrderResponse.data.order._id;
        // --- KẾT THÚC THÊM MỚI ---

        // 3. GỌI API 2: Bắt đầu Polling /checkout
        setStatus("POLLING_PAYMENT");
        setStatusMessage("Contacting payment provider...");

        pollInterval = setInterval(async () => {
          try {
            attempts++;
            // --- SỬA ĐỔI: Thêm orderId vào URL (Vẫn giữ nguyên)
            const pollResponse = await axios.get(
              `http://localhost:3005/checkout/${orderId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            // --- SỬA ĐỔI QUAN TRỌNG: Khớp với response mới
            // API của bạn trả về: { checkoutUrl: "...", orderStatus: "..." }
            if (pollResponse.data && pollResponse.data.checkoutUrl) {
              if (pollInterval) clearInterval(pollInterval);

              setStatus("REDIRECTING");
              setStatusMessage("Redirecting to secure payment...");

              toast({
                title: "Success",
                description: "Redirecting to payment...",
              });
              window.location.href = pollResponse.data.checkoutUrl; // <-- SỬA ĐỔI
            }
            // Nếu không có checkoutUrl (ví dụ: null), chỉ cần đợi
            else if (
              pollResponse.data &&
              pollResponse.data.checkoutUrl === null
            ) {
              setStatusMessage("Waiting for payment link...");
            }
            // Hết thời gian polling
            else if (attempts > maxAttempts) {
              if (pollInterval) clearInterval(pollInterval);
              throw new Error("Payment timeout. Please try again.");
            }
          } catch (pollError) {
            // Lỗi trong lúc polling
            if (pollInterval) clearInterval(pollInterval);
            throw pollError; // Ném lỗi ra ngoài để catch bên ngoài xử lý
          }
        }, 3000); // Poll mỗi 3 giây
      } catch (error: any) {
        // Lỗi từ /createorder HOẶC lỗi từ polling
        if (pollInterval) clearInterval(pollInterval);

        console.error("Checkout API Error:", error);
        let msg = "An unknown error occurred.";
        if (axios.isAxiosError(error) && error.response) {
          msg =
            error.response.data?.message ||
            `Server error: ${error.response.status}`;
        } else if (error.message) {
          msg = error.message;
        }

        setStatus("ERROR");
        setErrorMessage(msg);
        toast({
          title: "Checkout Failed",
          description: msg,
          variant: "destructive",
        });
      }
    };

    startCheckoutProcess(); // Chạy logic

    // Cleanup: Dừng interval nếu người dùng rời khỏi trang
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [toast]);

  // --- HÀM RENDER UI ĐỘNG ---
  const renderContent = () => {
    // Trạng thái Lỗi
    if (status === "ERROR") {
      return (
        <div className="py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
            <Check className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Failed
          </h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <a href="/cart">
            <Button variant="outline">Back to Cart</Button>
          </a>
        </div>
      );
    }

    // Trạng thái Đang chuyển hướng
    if (status === "REDIRECTING") {
      return (
        <div className="py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
            <Check className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Redirecting...
          </h2>
          <p className="text-gray-600 mb-6">{statusMessage}</p>
          <Spinner />
        </div>
      );
    }

    // Trạng thái Đang Polling
    if (status === "POLLING_PAYMENT") {
      return (
        <div className="py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-50 mb-4">
            <CreditCard className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Processing Payment
          </h2>
          <p className="text-gray-600 mb-6">{statusMessage}</p>
          <Spinner />
        </div>
      );
    }

    // Trạng thái Mặc định (CREATING_ORDER)
    return (
      <div className="py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
          <Package className="w-8 h-8 text-blue-600 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Processing Your Order
        </h2>
        <p className="text-gray-600 mb-6">{statusMessage}</p>
        <Spinner />
      </div>
    );
  };

  // Spinner component
  const Spinner = () => (
    <div className="flex justify-center gap-2">
      <div className="w-2 h-2 bg-black rounded-full animate-bounce" />
      <div
        className="w-2 h-2 bg-black rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      />
      <div
        className="w-2 h-2 bg-black rounded-full animate-bounce"
        style={{ animationDelay: "0.4s" }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps (đã được cập nhật) */}
        <div className="mb-12">
          <CheckoutSteps currentStatus={status} />
        </div>

        {/* Content Section (đã được cập nhật) */}
        <Card className="p-8 bg-white border border-gray-200 text-center">
          {renderContent()}
        </Card>
      </main>
    </div>
  );
}
