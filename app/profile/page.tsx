"use client";
// export const runtime = "edge";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
// import Link from "next/link"; // <-- Đã xóa
// import { useRouter } from "next/navigation"; // <-- Đã xóa
import {
  User,
  Package,
  Settings, // Vẫn giữ icon cho tab (mặc dù đã xóa)
  MapPin, // Đã xóa (không cần)
  Phone,
  Mail,
  Edit2,
  LogOut,
  ShoppingBag, // Từ Navbar
  ShieldAlert, // Từ logic lỗi
} from "lucide-react";

// --- HÀM HỖ TRỢ VÀ COMPONENT MẪU ---
import Link from "next/link";
// Hàm định dạng tiền tệ
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Mock useToast (Đã có useCallback fix)
const useToast = () => {
  const toast = useCallback(
    ({
      title,
      description,
      variant,
    }: {
      title: string;
      description: string;
      variant?: string;
    }) => {
      console.log(`Toast (${variant || "default"}): ${title} - ${description}`);
      if (variant === "destructive") {
        console.error(`Toast Error: ${title} - ${description}`);
      }
    },
    []
  );

  return {
    toast,
  };
};

// Component Mẫu: Button
export function Button({
  children,
  onClick,
  className,
  variant,
  size,
  disabled,
  type,
}: {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  className?: string;
  variant?: string;
  size?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}) {
  const baseStyle =
    "px-4 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2";
  const variantStyle =
    variant === "outline"
      ? "bg-transparent border border-gray-300 text-gray-900 hover:bg-gray-50"
      : "bg-black text-white hover:bg-gray-800 disabled:opacity-50";
  return (
    <button
      type={type || "button"}
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
  const [authInfo, setAuthInfo] = useState<{
    email: string;
    role: string;
  } | null>(null);
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
        const authData: { user: { email: string; role: string } } =
          JSON.parse(storedData);
        if (authData.user) {
          setAuthInfo(authData.user);
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
          <Link href="/" className="flex-shrink-0">
            <span className="text-xl font-bold text-black">MyEcom</span>
          </Link>
          <Link href="/" className="text-gray-700 hover:text-black font-medium">
            Products
          </Link>
          {authInfo && authInfo.role === "ADMIN" && (
            <Link
              href="/admin/products"
              className="font-bold text-blue-600 hover:text-blue-800"
            >
              Admin Dashboard
            </Link>
          )}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative">
              <ShoppingBag className="w-6 h-6 text-gray-700 hover:text-black" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {authInfo ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-black"
                >
                  <User className="w-6 h-6" />
                  <span className="text-sm font-medium hidden sm:block truncate max-w-xs">
                    {authInfo.email}
                  </span>
                </Link>
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
              <Link href="/login">
                <Button size="sm">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// --- KẾT THÚC COMPONENT MẪU ---

// --- INTERFACES CHO DỮ LIỆU API ---
interface AuthData {
  user: {
    email: string;
    role: string;
  };
  token: string;
}

interface PurchasedProduct {
  productId: string;
  price: number;
  quantity: number;
  _id: string;
  purchasedAt: string;
}

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  totalSpent: number;
  purcharsedProducts: PurchasedProduct[]; // Sửa lại tên (typo)
  createdAt: string;
  updatedAt: string;
}

// --- COMPONENT TRANG PROFILE ---
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"account" | "orders">("account");
  const [isEditing, setIsEditing] = useState(false);

  // --- State cho dữ liệu API ---
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // --- useEffect để gọi API ---
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      setError(null);
      let token: string | null = null;

      // 1. Lấy token
      try {
        const storedData = localStorage.getItem("authData");
        if (!storedData) {
          throw new Error("You must be logged in to view your profile.");
        }
        token = (JSON.parse(storedData) as AuthData).token;
      } catch (authError: any) {
        setError(authError.message);
        setIsLoading(false);
        window.location.href = "/login";
        return;
      }

      // 2. Gọi API POST (như yêu cầu)
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_GATEWAY_API}/api/user/profile`,
          {}, // Body rỗng (như yêu cầu)
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // API của bạn trả về một MẢNG [ { ... } ]
        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          // Sửa lại: API của bạn có typo 'purcharsedProducts'
          const apiData = response.data[0];
          // Sửa lỗi typo ngay khi nhận dữ liệu
          const correctedData: UserProfile = {
            ...apiData,
            purcharsedProducts: apiData.purcharsedProducts || [], // Đảm bảo đúng tên
          };
          setProfile(correctedData);
        } else {
          throw new Error("Profile data not found in API response.");
        }
      } catch (fetchError: any) {
        console.error("API Error:", fetchError);
        let msg = "Could not fetch profile.";
        if (axios.isAxiosError(fetchError) && fetchError.response) {
          msg =
            fetchError.response.data?.message ||
            `Server error: ${fetchError.response.status}`;
        } else if (fetchError.message) {
          msg = fetchError.message;
        }
        setError(msg);
        toast({
          title: "Fetch Error",
          description: msg,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [toast]);

  // Mock avatar (vì API không cung cấp)
  const avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=Profile";

  // --- RENDER LOGIC ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-lg text-gray-600">Loading Profile...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-8 text-center border-red-300">
            <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              An Error Occurred
            </h2>
            <p className="text-gray-700">{error}</p>
          </Card>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-lg text-gray-600">Profile not found.</p>
        </main>
      </div>
    );
  }

  // Render khi có dữ liệu
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> {/* <-- ĐÃ SỬA: Không cần props */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header (Dùng dữ liệu API) */}
        <div className="mb-12">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar (Mock) */}
              <div className="flex-shrink-0">
                <img
                  src={avatarUrl}
                  alt={profile.username}
                  className="w-20 h-20 rounded-full border-2 border-black"
                />
              </div>

              {/* User Info (API) */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {profile.username}
                </h1>
                <p className="text-gray-600 mb-4">
                  Member since{" "}
                  {new Date(profile.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </div>
                  {/* ĐÃ XÓA TRƯỜNG "Phone" */}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="gap-2 bg-black text-white hover:bg-gray-800"
                >
                  <Edit2 className="w-4 h-4" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 border-gray-300 bg-transparent"
                  onClick={() => {
                    localStorage.removeItem("authData");
                    localStorage.removeItem("cartCount");
                    window.location.href = "/login";
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs (ĐÃ XÓA SETTINGS) */}
        <div className="flex gap-2 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("account")}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "account"
                ? "border-black text-black"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Account
            </div>
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "orders"
                ? "border-black text-black"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Products Purchased
            </div>
          </button>
          {/* ĐÃ XÓA TAB SETTINGS */}
        </div>

        {/* Tab Content */}
        <div>
          {/* Account Tab (ĐÃ CẬP NHẬT) */}
          {activeTab === "account" && (
            <div className="space-y-6">
              {/* Personal Information */}
              <Card className="bg-white border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Personal Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={profile.username}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 rounded-lg border border-gray-300 transition ${
                        isEditing
                          ? "bg-white focus:ring-2 focus:ring-black"
                          : "bg-gray-50 text-gray-600"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 rounded-lg border border-gray-300 transition ${
                        isEditing
                          ? "bg-white focus:ring-2 focus:ring-black"
                          : "bg-gray-50 text-gray-600"
                      }`}
                    />
                  </div>
                  {/* ĐÃ XÓA TRƯỜNG "Phone" */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Member Since
                    </label>
                    <input
                      type="text"
                      value={new Date(profile.createdAt).toLocaleDateString()}
                      disabled
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Spent
                    </label>
                    <input
                      type="text"
                      value={formatCurrency(profile.totalSpent)}
                      disabled
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-600"
                    />
                  </div>
                </div>
              </Card>

              {/* ĐÃ XÓA CARD "Shipping Address" */}
            </div>
          )}

          {/* Orders Tab (ĐÃ VIẾT LẠI HOÀN TOÀN) */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              {profile.purcharsedProducts.length > 0 ? (
                <Card className="bg-white border border-gray-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price Paid
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Purchased Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {profile.purcharsedProducts.map((item) => (
                        <tr key={item._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.productId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(item.purchasedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              ) : (
                <Card className="bg-white border border-gray-200 p-12 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No products purchased yet.</p>
                  <Link href="/">
                    <Button className="mt-4 bg-black text-white hover:bg-gray-800">
                      Start Shopping
                    </Button>
                  </Link>
                </Card>
              )}
            </div>
          )}

          {/* ĐÃ XÓA TAB "Settings" */}
        </div>
      </main>
    </div>
  );
}
