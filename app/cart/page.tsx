"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
// import { Button } from "@/components/ui/button"; // <-- SẼ ĐỊNH NGHĨA BÊN DƯỚI
// import { Card } from "@/components/ui/card"; // <-- SẼ ĐỊNH NGHĨA BÊN DƯỚI
import { ShoppingCart, ArrowLeft, Trash2, Plus, Minus } from "lucide-react";

// --- COMPONENT MẪU: Button (ĐÃ THÊM) ---
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

// --- COMPONENT MẪU: Card (ĐÃ THÊM) ---
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
// --- KẾT THÚC COMPONENT MẪU ---

// --- COMPONENT CARTITEM (ĐÃ CẬP NHẬT) ---
interface CartItemProps {
  id: string;
  name: string;
  price: string; // Đã được định dạng
  image: string;
  quantity: number;
  isUpdating: boolean; // <-- THÊM MỚI
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}
function CartItem({
  id,
  name,
  price,
  image,
  quantity,
  isUpdating, // <-- THÊM MỚI
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  return (
    // SỬA LỖI: Card bây giờ đã là component mẫu có class
    <Card className="flex items-center p-4 gap-4 bg-white border border-gray-200">
      {/* 1. Ảnh */}
      <img
        src={image}
        alt={name}
        // SỬA LỖI: Đổi sang object-contain để không bị cắt ảnh
        className="w-24 h-24 object-contain rounded-lg border border-gray-100 flex-shrink-0"
        onError={(e) =>
          (e.currentTarget.src =
            "https://placehold.co/96x96/e2e8f0/333?text=Image")
        }
      />

      {/* 2. Tên và Giá (flex-1 để đẩy mọi thứ khác ra) */}
      <div className="flex-1 min-w-0">
        {" "}
        {/* min-w-0 để truncate hoạt động */}
        <h3 className="font-semibold text-gray-900 truncate" title={name}>
          {name}
        </h3>
        <p className="text-gray-600">{price}</p>
      </div>

      {/* 3. Số lượng */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
          disabled={quantity <= 1 || isUpdating} // <-- SỬA ĐỔI
        >
          <Minus size={16} />
        </button>
        <span className="w-8 text-center">{quantity}</span>
        <button
          onClick={() => onQuantityChange(quantity + 1)}
          className="p-1 rounded-full hover:bg-gray-100"
          disabled={isUpdating} // <-- SỬA ĐỔI
        >
          <Plus size={16} />
        </button>
      </div>

      {/* 4. Button Xóa */}
      <button
        onClick={onRemove}
        className="text-gray-400 hover:text-red-600 flex-shrink-0 disabled:opacity-50"
        disabled={isUpdating} // <-- SỬA ĐỔI
      >
        <Trash2 size={20} />
      </button>
    </Card>
  );
}
// --- KẾT THÚC COMPONENT CARTITEM ---

// --- HÀM ĐỊNH DẠNG TIỀN TỆ ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// --- CÁC INTERFACE MỚI ---
// Định nghĩa cấu trúc authData từ localStorage
interface AuthData {
  user: {
    email: string;
  };
  token: string;
}

// Cấu trúc API trả về cho /getcart
interface ApiCartItem {
  _id: string; // ID của *cart item*
  productId: string; // <-- SỬA ĐỔI: Chỉ là ID (string)
  quantity: number;
  price: number;
}

// Cấu trúc API trả về cho /getdetailproduct/:id
// (Copy từ product-page.tsx)
interface ApiProductDetail {
  _id: string;
  name: string;
  price: number;
  avatar_url?: string;
  imageUrl?: string;
  [key: string]: any; // Cho các trường khác
}

// Cấu trúc dữ liệu chúng ta dùng trong state React
interface MappedCartItem {
  id: string; // ID của *cart item*
  productId: string; // ID của *sản phẩm*
  name: string;
  image: string;
  quantity: number;
  price: number; // Giá của 1 sản phẩm (dạng SỐ)
}

// --- COMPONENT TRANG GIỎ HÀNG ---
export default function CartPage() {
  // --- STATE MỚI ---
  const [cartItems, setCartItems] = useState<MappedCartItem[]>([]); // Bắt đầu với mảng rỗng
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingCart, setIsUpdatingCart] = useState(false); // <-- THÊM MỚI
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // --- LOGIC GỌI API (CẬP NHẬT VỚI PROMISE.ALL) ---
  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      setError(null);
      let token: string | null = null;

      // 1. Lấy token
      try {
        const storedData = localStorage.getItem("authData");
        if (!storedData) {
          toast({
            title: "Authentication Error",
            description: "Please log in to view your cart.",
            variant: "destructive",
          });
          window.location.href = "/login";
          return;
        }
        const authData: AuthData = JSON.parse(storedData);
        token = authData.token;
      } catch (error) {
        console.error("Failed to parse authData", error);
        localStorage.removeItem("authData");
        window.location.href = "/login";
        return;
      }

      // 2. Gọi API /getcart
      try {
        const cartResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_GATEWAY_API}/api/cart/getcart`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // API trả về { _id: "...", items: [...] }
        const cartData = cartResponse.data;

        if (
          cartData &&
          Array.isArray(cartData.items) &&
          cartData.items.length > 0
        ) {
          // --- MỚI: LẤY CHI TIẾT SẢN PHẨM ---

          // 3. Tạo một mảng các promise
          const detailPromises = cartData.items.map((item: ApiCartItem) => {
            return axios.get(
              // Gọi API chi tiết (giống như trang product-page)
              `${process.env.NEXT_PUBLIC_GATEWAY_API}/api/products/getdetailproduct/${item.productId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
          });

          // 4. Chờ tất cả các cuộc gọi API chi tiết hoàn thành
          const detailResponses = await Promise.all(detailPromises);

          // 5. Hợp nhất dữ liệu giỏ hàng và dữ liệu chi tiết
          const mappedItems: MappedCartItem[] = cartData.items.map(
            (item: ApiCartItem, index: number) => {
              // (API /getdetailproduct trả về { success: true, data: {...} })
              const productDetail: ApiProductDetail =
                detailResponses[index].data.data;

              return {
                // SỬA LỖI QUAN TRỌNG: Fallback dùng productId nếu _id thiếu
                id: item._id || item.productId,
                productId: item.productId,
                name: productDetail.name, // <-- Từ API chi tiết
                image:
                  productDetail.imageUrl ||
                  productDetail.avatar_url ||
                  "https://placehold.co/96x96/e2e8f0/333?text=Image", // <-- Từ API chi tiết
                quantity: item.quantity, // <-- Từ API giỏ hàng
                price: item.price, // <-- Từ API giỏ hàng
              };
            }
          );
          setCartItems(mappedItems);

          // --- KẾT THÚC LOGIC MỚI ---
        } else if (
          cartData &&
          Array.isArray(cartData.items) &&
          cartData.items.length === 0
        ) {
          // Giỏ hàng rỗng
          setCartItems([]);
        } else {
          // API trả về dữ liệu lạ
          throw new Error("Invalid cart data received from server.");
        }
      } catch (error: any) {
        console.error("API Error:", error);
        let errorMessage = "Could not fetch cart.";
        if (axios.isAxiosError(error) && error.response) {
          errorMessage =
            error.response.data?.message ||
            `Server error: ${error.response.status}`;
        } else if (axios.isAxiosError(error) && error.request) {
          errorMessage = "Network Error: Could not connect to the server.";
        }
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [toast]);

  // --- TÍNH TOÁN TỔNG TIỀN (SỬA LỖI VÀ DÙNG useMemo) ---
  // Tính toán này sẽ tự động chạy khi `cartItems` thay đổi
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      // SỬA LỖI: item.price giờ là SỐ, không cần parse string
      return sum + item.price * item.quantity;
    }, 0);
  }, [cartItems]);

  const shipping = useMemo(() => (subtotal > 500000 ? 0 : 30000), [subtotal]);
  const tax = useMemo(() => Math.round(subtotal * 0.08), [subtotal]);
  const total = useMemo(
    () => subtotal + shipping + tax,
    [subtotal, shipping, tax]
  );

  // --- CÁC HÀM XỬ LÝ (Tạm thời chỉ cập nhật state, chưa gọi API) ---
  const handleQuantityChange = (id: string, quantity: number) => {
    // TODO: Nên gọi API PATCH/PUT để cập nhật giỏ hàng trên server
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // --- HÀM XỬ LÝ XÓA SẢN PHẨM (ĐÃ CẬP NHẬT) ---
  const handleRemoveItem = async (cartItemId: string, productId: string) => {
    setIsUpdatingCart(true); // <-- THÊM MỚI
    let token: string | null = null;

    // 1. Lấy token
    try {
      const storedData = localStorage.getItem("authData");
      if (!storedData) {
        toast({
          title: "Authentication Error",
          description: "Please log in to modify your cart.",
          variant: "destructive",
        });
        window.location.href = "/login";
        setIsUpdatingCart(false);
        return;
      }
      token = (JSON.parse(storedData) as AuthData).token;
    } catch (error) {
      console.error("Failed to parse authData", error);
      localStorage.removeItem("authData");
      window.location.href = "/login";
      setIsUpdatingCart(false);
      return;
    }

    // 2. Gọi API /removefromcart
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_GATEWAY_API}/api/cart/removefromcart`,
        {
          productId: productId, // Body theo yêu cầu
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Header theo yêu cầu
          },
        }
      );

      // --- SỬA ĐỔI LOGIC KIỂM TRA ---
      // Chỉ cần kiểm tra status 200. Chúng ta sẽ tự cập nhật UI
      // mà không cần API trả về toàn bộ giỏ hàng mới.
      if (response.status === 200) {
        // 1. Tính toán mảng mới (đã lọc)
        const newCartItems = cartItems.filter((item) => item.id !== cartItemId);

        // 2. Cập nhật state (lọc ra item đã xóa)
        setCartItems(newCartItems);

        // 3. Cập nhật số lượng trên Navbar (dựa trên mảng mới)
        const newCount = newCartItems.length; // <-- SỬA ĐỔI
        localStorage.setItem("cartCount", newCount.toString());
        window.dispatchEvent(
          new CustomEvent("cartUpdated", { detail: { newCount } })
        );

        toast({
          title: "Item Removed",
          description: "The item has been removed from your cart.",
        });
      } else {
        // Nếu status không phải 200 (nhưng axios không ném lỗi)
        throw new Error(`Server responded with status ${response.status}`);
      }
    } catch (error: any) {
      console.error("Remove from cart API Error:", error);
      let errorMessage = "Could not remove item.";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUpdatingCart(false); // <-- THÊM MỚI
    }
  };
  // --- KẾT THÚC HÀM XỬ LÝ XÓA ---

  const handleApplyCoupon = () => {
    console.log("Applying coupon...");
  };

  // --- LOGIC RENDER MỚI ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-lg text-gray-600">Loading your cart...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Cart
          </h1>
          <p className="text-gray-700 mb-8">{error}</p>
          <a href="/">
            <Button>Go Back Home</Button>
          </a>
        </main>
      </div>
    );
  }

  if (!isLoading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-24">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8">
              Add some products to get started!
            </p>
            <a href="/">
              <Button className="bg-black text-white hover:bg-gray-800">
                Continue Shopping
              </Button>
            </a>
          </div>
        </main>
      </div>
    );
  }

  // Render giỏ hàng khi có dữ liệu
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/"
            className="flex items-center gap-2 text-black hover:text-gray-700 mb-4 w-fit"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </a>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4 mb-8">
              {cartItems.map((item, index) => (
                <CartItem
                  // SỬA LỖI: Sử dụng key an toàn (item.id hoặc fallback index)
                  key={item.id || `item-${index}`}
                  id={item.id}
                  name={item.name}
                  image={item.image}
                  quantity={item.quantity}
                  isUpdating={isUpdatingCart} // <-- THÊM MỚI
                  // SỬA LỖI: Định dạng `price` (SỐ) thành chuỗi tiền tệ
                  price={formatCurrency(item.price)}
                  onQuantityChange={(qty) => handleQuantityChange(item.id, qty)}
                  onRemove={() => handleRemoveItem(item.id, item.productId)} // <-- SỬA ĐỔI
                />
              ))}
            </div>

            {/* Coupon Section */}
            <Card className="p-4 bg-white border border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                />
                <Button
                  onClick={handleApplyCoupon}
                  variant="outline"
                  className="border-gray-300 bg-transparent"
                >
                  Apply
                </Button>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 bg-white border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span
                    className={
                      shipping === 0 ? "text-green-600 font-semibold" : ""
                    }
                  >
                    {shipping === 0 ? "FREE" : `${formatCurrency(shipping)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (8%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6 text-lg">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-black">
                  {formatCurrency(total)}
                </span>
              </div>

              <a href="/checkout">
                <Button
                  className="w-full bg-black text-white hover:bg-gray-800 mb-3"
                  disabled={isUpdatingCart} // <-- THÊM MỚI
                >
                  Proceed to Checkout
                </Button>
              </a>
              <a href="/">
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-900 bg-transparent"
                >
                  Continue Shopping
                </Button>
              </a>

              {/* Trust Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm text-gray-600">
                <div className="flex gap-2">
                  <span>✓</span>
                  <span>Secure checkout with SSL encryption</span>
                </div>
                <div className="flex gap-2">
                  <span>✓</span>
                  <span>30-day return guarantee</span>
                </div>
                <div className="flex gap-2">
                  <span>✓</span>
                  <span>24/7 customer support</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
