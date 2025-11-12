"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  LogOut,
  User,
  ShoppingBag,
  Edit,
  Trash2,
  Plus,
  ShieldAlert,
  Undo2, // --- THÊM MỚI ---
} from "lucide-react";
// --- THÊM MỚI: Import Modal từ đúng đường dẫn ---
import { ProductModal } from "@/components/admin/product-modal";
import { set } from "date-fns";

// --- COMPONENT MẪU VÀ HÀM HỖ TRỢ ---

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

// Component Mẫu: Button (ĐÃ CẬP NHẬT: Thêm 'type' prop)
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
      : variant === "destructive"
      ? "bg-red-600 text-white hover:bg-red-700"
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
    // ... (Logic lắng nghe sự kiện giỏ hàng) ...
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
          <a href="/" className="flex-shrink-0">
            <span className="text-xl font-bold text-black">MyEcom</span>
          </a>
          <a href="/" className="text-gray-700 hover:text-black font-medium">
            Products
          </a>
          {authInfo && authInfo.role === "ADMIN" && (
            <a
              href="/admin/products"
              className="font-bold text-blue-600 hover:text-blue-800"
            >
              Admin Dashboard
            </a>
          )}
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

// Hàm định dạng tiền tệ
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// --- ĐỊNH NGHĨA INTERFACE ---
// Interface cho AuthData
interface AuthData {
  user: {
    email: string;
    role: string;
  };
  token: string;
}

// Interface cho sản phẩm từ API
interface ApiProduct {
  _id: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  sold_count: number;
  createdAt: string;
  deleted: boolean;
  imagePublicId?: string;
  frequently_asked_questions?: string;
  discount?: number;
  days_valid?: number;
  description?: string;
}

// --- COMPONENT TRANG ADMIN ---
export default function AdminProductsPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // --- State cho Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(false);
  // const [editingProduct, setEditingProduct] = useState<ApiProduct | null>(null); // Dùng cho 'Edit'

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      let token: string | null = null;
      try {
        const storedData = localStorage.getItem("authData");
        if (!storedData) {
          throw new Error("You must be logged in.");
        }
        const authData: AuthData = JSON.parse(storedData);
        if (!authData || !authData.user || authData.user.role !== "ADMIN") {
          throw new Error("Access Denied: You are not an administrator.");
        }
        token = authData.token;
      } catch (authError: any) {
        console.error("Auth Error:", authError.message);
        setError(authError.message);
        setIsLoading(false);
        window.location.href = "/";
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:3002/getproductsadmin",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.success) {
          setProducts(response.data.data);
        } else {
          throw new Error(
            response.data.message || "Failed to parse product data"
          );
        }
      } catch (fetchError: any) {
        console.error("API Error:", fetchError);
        let msg = "Could not fetch products.";
        if (axios.isAxiosError(fetchError) && fetchError.response) {
          msg =
            fetchError.response.data?.message ||
            `Server error: ${fetchError.response.status}`;
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

    checkAuthAndFetchData();
  }, [toast]);

  // --- Hàm xử lý Modal ---
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleEditProduct = () => {
    setEditingProduct(true);
  };
  const handleCloseEditProduct = () => {
    setEditingProduct(false);
  };

  const handleSaveProduct = async () => {
    // Fetch lại danh sách sản phẩm từ server
    try {
      const storedData = localStorage.getItem("authData");
      if (!storedData) return;

      const authData: AuthData = JSON.parse(storedData);
      const token = authData.token;

      // --- SỬA LẠI ---: Nên gọi lại API /getproductsadmin thay vì /
      const response = await axios.post(
        "http://localhost:3002/getproductsadmin",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        setProducts(response.data.data);
        toast({
          title: "Success",
          description: "Product list refreshed!",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Failed to refresh products:", error);
      toast({
        title: "Warning",
        description:
          "Product added but failed to refresh list. Please reload the page.",
        variant: "destructive",
      });
    } finally {
      handleCloseModal();
    }
  };

  // --- THÊM MỚI: HÀM XỬ LÝ DELETE/RESTORE ---

  // Hàm lấy token (tách ra để tái sử dụng)
  const getAuthToken = useCallback(() => {
    try {
      const storedData = localStorage.getItem("authData");
      if (!storedData) {
        throw new Error("No auth data found");
      }
      const authData: AuthData = JSON.parse(storedData);
      return authData.token;
    } catch (error) {
      console.error("Failed to get auth token", error);
      toast({
        title: "Authentication Error",
        description: "Please log in again.",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  // Hàm xử lý Xóa (Soft Delete)
  const handleDelete = useCallback(
    async (productId: string) => {
      const token = getAuthToken();
      if (!token) return;

      try {
        await axios.post(
          "http://localhost:3002/deleteproduct",
          { productId }, // Body
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Cập nhật state ngay lập tức
        setProducts((currentProducts) =>
          currentProducts.map((p) =>
            p._id === productId ? { ...p, deleted: true } : p
          )
        );

        toast({
          title: "Success",
          description: "Product marked as deleted.",
          variant: "default",
        });
      } catch (error) {
        console.error("Failed to delete product:", error);
        toast({
          title: "Error",
          description: "Could not delete product.",
          variant: "destructive",
        });
      }
    },
    [getAuthToken, toast]
  );

  // Hàm xử lý Khôi phục
  const handleRestore = useCallback(
    async (productId: string) => {
      const token = getAuthToken();
      if (!token) return;

      // --- GIẢ ĐỊNH ---
      // API của bạn có thể dùng endpoint khác, ví dụ: /restoreproduct
      // Vui lòng thay đổi endpoint dưới đây cho đúng với API của bạn
      const restoreEndpoint = "http://localhost:3002/restoreproduct";

      try {
        await axios.post(
          restoreEndpoint,
          { productId }, // Body
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Cập nhật state ngay lập tức
        setProducts((currentProducts) =>
          currentProducts.map((p) =>
            p._id === productId ? { ...p, deleted: false } : p
          )
        );

        toast({
          title: "Success",
          description: "Product restored.",
          variant: "default",
        });
      } catch (error) {
        console.error("Failed to restore product:", error);
        toast({
          title: "Error",
          description: `Could not restore product. (Ensure ${restoreEndpoint} is correct)`,
          variant: "destructive",
        });
      }
    },
    [getAuthToken, toast]
  );

  // --- KẾT THÚC THÊM MỚI ---

  // Trạng thái Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-lg text-gray-600">Loading Admin Dashboard...</p>
        </main>
      </div>
    );
  }

  // Trạng thái Lỗi
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

  // Trạng thái Thành công (Render bảng)
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Product Management
          </h1>
          <Button onClick={handleOpenModal}>
            {" "}
            <Plus size={18} />
            Add New Product
          </Button>
        </div>

        <Card className="overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Image
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Stock (Qty)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sold
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md border"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {product.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(product.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.quantity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.sold_count}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.deleted ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Deleted
                      </span>
                    ) : product.quantity > 0 ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        In Stock
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-300 hover:bg-blue-50"
                        // Thêm onClick cho Edit sau
                        // onClick={() => handleOpenModal(product)}
                        onClick={() => handleEditProduct()}
                      >
                        <Edit size={16} />
                      </Button>

                      {/* --- CẬP NHẬT LOGIC NÚT XÓA/KHÔI PHỤC --- */}
                      {product.deleted ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-300 hover:bg-green-50"
                          onClick={() => handleRestore(product._id)}
                        >
                          <Undo2 size={16} />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => handleDelete(product._id)}
                        >
                          {/* --- ĐÂY LÀ CHỖ SỬA LỖI --- */}
                          <Trash2 size={16} />
                        </Button>
                      )}
                      {/* --- KẾT THÚC CẬP NHẬT --- */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>

      {/* --- Render Modal --- */}
      {isModalOpen && (
        <ProductModal
          product={null} // Chế độ "Add New"
          onSave={handleSaveProduct}
          onClose={handleCloseModal}
        />
      )}
      {editingProduct && (
        <ProductModal
          product={null} // CẬP NHẬT: Thay null bằng sản phẩm đang chỉnh sửa
          onSave={handleSaveProduct}
          onClose={handleCloseEditProduct}
        />
      )}
    </div>
  );
}
