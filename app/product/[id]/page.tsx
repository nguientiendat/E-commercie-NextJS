"use client";
// export const runtime = "edge";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  ShoppingBag,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  LogOut,
  User,
} from "lucide-react";
import { useParams } from "next/navigation"; // <-- THÊM MỚI
import { useToast } from "@/hooks/use-toast";

// --- CÁC COMPONENT MẪU (STUBS) ---
// (Các component này được định nghĩa ở đây để tránh lỗi 'Could not resolve')
import Link from "next/link"; // <-- THÊM MỚI
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
    "px-4 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center"; // <-- SỬA LỖI: Thêm flex, items-center, justify-center
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
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

// Component Mẫu: ProductReviews
export function ProductReviews() {
  return (
    <Card className="p-6 bg-white border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Customer Reviews
      </h2>
      <div className="text-center text-gray-600">
        <p>No reviews yet.</p>
        <p className="text-sm">Be the first to review this product!</p>
      </div>
    </Card>
  );
}

// Định nghĩa cấu trúc authData cho Navbar
interface NavbarAuthData {
  user: {
    email: string;
  };
  token: string;
}

// Component Mẫu: Navbar
export function Navbar() {
  const [authInfo, setAuthInfo] = useState<{ email: string } | null>(null);
  const [cartCount, setCartCount] = useState(0); // Navbar tự quản lý giỏ hàng (ví dụ)

  // Effect để đọc localStorage khi component mount
  useEffect(() => {
    // Hàm xử lý sự kiện cartUpdated
    const handleCartUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (typeof customEvent.detail.newCount === "number") {
        setCartCount(customEvent.detail.newCount);
      }
    };

    // Lắng nghe sự kiện (nếu một trang khác cập nhật giỏ hàng)
    window.addEventListener("cartUpdated", handleCartUpdate);

    // --- Logic chạy 1 lần khi mount ---
    try {
      // Đọc auth data
      const storedData = localStorage.getItem("authData");
      if (storedData) {
        const authData: NavbarAuthData = JSON.parse(storedData);
        if (authData.user && authData.user.email) {
          setAuthInfo({ email: authData.user.email });
        }
      }

      // Đọc cartCount ban đầu (nếu có)
      const storedCartCount = localStorage.getItem("cartCount");
      if (storedCartCount) {
        setCartCount(parseInt(storedCartCount, 10));
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
      localStorage.removeItem("authData");
      localStorage.removeItem("cartCount"); // Xóa cả cart count hỏng
    }
    // --- Kết thúc logic mount ---

    // Cleanup: gỡ bỏ listener khi component unmount
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy một lần khi mount

  const handleLogout = () => {
    localStorage.removeItem("authData");
    localStorage.removeItem("cartCount"); // <-- THÊM MỚI: Xóa cart count khi logout
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
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-black font-medium"
            >
              Products
            </Link>
          </div>
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
                  className="gap-2 bg-transparent" // Lớp "gap-2" đã có, flex sẽ được áp dụng từ baseStyle
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

// --- HÀM HỖ TRỢ ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// --- ĐỊNH NGHĨA INTERFACE ---
// Định nghĩa cấu trúc authData từ localStorage
interface AuthData {
  user: {
    email: string;
  };
  token: string;
}

// Dựa trên dữ liệu API của bạn
interface ApiProductDetail {
  _id: string;
  name: string;
  price: number;
  avatar_url?: string;
  imageUrl?: string;
  rating?: number; // SỬA LỖI: Đánh dấu là optional
  reviews?: number; // SỬA LỖI: Đánh dấu là optional
  inStock?: boolean; // SỬA LỖI: Đánh dấu là optional
  quantity: number; // API có gửi trường này
  description?: string; // SỬA LỖI: Đánh dấu là optional
  features?: string[]; // SỬA LỖI: Đánh dấu là optional
  specifications?: Record<string, string>; // SỬA LỖI: Đánh dấu là optional
  [key: string]: any; // Cho các trường khác
}

// --- SỬA LỖI: THAY ĐỔI CHỮ KÝ COMPONENT ---
// export default function ProductPage({ params }: { params: { id: string } }) { // <-- XÓA DÒNG NÀY
export default function ProductPage() {
  // <-- THAY BẰNG DÒNG NÀY
  // --- STATE ---
  const [product, setProduct] = useState<ApiProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false); // <-- THÊM MỚI

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  // const [cartCount, setCartCount] = useState(0); // Navbar tự quản lý
  const { toast } = useToast();
  // const router = useRouter(); // Đã xóa

  // --- SỬA LỖI: SỬ DỤNG HOOK useParams ĐỂ LẤY ID ---
  const params = useParams(); // Lấy params từ hook
  const id = params.id as string; // Lấy 'id' từ params, ép kiểu về string

  // --- EFFECT GỌI API ---
  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      setError(null);
      // const { id } = params; // <-- XÓA DÒNG NÀY

      if (!id) {
        // <-- SỬ DỤNG 'id' TỪ BÊN TRÊN
        setError("Product ID is missing.");
        setIsLoading(false);
        return;
      }

      // 1. Lấy token (giống hệt home-page.tsx)
      let token: string | null = null;
      try {
        const storedData = localStorage.getItem("authData");
        if (!storedData) {
          toast({
            title: "Authentication Error",
            description: "Please log in to view products.",
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

      // 2. Gọi API bằng Axios
      try {
        // ... (Comment không đổi)
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_GATEWAY_API}/api/products/getdetailproduct/${id}`, // <-- SỬ DỤNG 'id' TỪ BÊN TRÊN
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.success) {
          setProduct(response.data.data);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch product details."
          );
        }
      } catch (error: any) {
        console.error("API Error:", error);
        let errorMessage = "Could not fetch product details.";
        if (axios.isAxiosError(error) && error.response) {
          errorMessage =
            error.response.data?.message ||
            `Server error: ${error.response.status}`;
        } else if (axios.isAxiosError(error) && error.request) {
          errorMessage = "Network Error: Could not connect to the server.";
        } else if (error.message) {
          errorMessage = error.message;
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

    // Thêm kiểm tra, chỉ chạy fetch nếu có 'id'
    if (id) {
      fetchProductDetails();
    }
    // --- SỬA LỖI: THAY ĐỔI DEPENDENCY ARRAY ---
  }, [id, toast]); // Chạy lại nếu 'id' thay đổi (thay vì params.id)

  // --- HÀM XỬ LÝ ---
  const handleAddToCart = async () => {
    // <-- SỬA ĐỔI: Thêm async
    if (!product) return;
    setIsAddingToCart(true); // <-- THÊM MỚI

    // 1. Lấy token (copy-pasted from useEffect)
    let token: string | null = null;
    try {
      const storedData = localStorage.getItem("authData");
      if (!storedData) {
        toast({
          title: "Authentication Error",
          description: "Please log in to add items to your cart.",
          variant: "destructive",
        });
        window.location.href = "/login";
        setIsAddingToCart(false); // <-- THÊM MỚI
        return;
      }
      const authData: AuthData = JSON.parse(storedData);
      token = authData.token;
    } catch (error) {
      console.error("Failed to parse authData", error);
      localStorage.removeItem("authData");
      window.location.href = "/login";
      setIsAddingToCart(false); // <-- THÊM MỚI
      return;
    }

    // 2. Gọi API /addtocart (MỚI)
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_GATEWAY_API}/api/cart/addtocart`, // URL bạn yêu cầu
        {
          productId: product._id, // Body bạn yêu cầu
          quantity: quantity, // THÊM MỚI: Gửi cả số lượng
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Header bạn yêu cầu
          },
        }
      );

      // --- SỬA ĐỔI LOGIC XỬ LÝ PHẢN HỒI ---
      // API của bạn trả về 200 và đối tượng giỏ hàng khi thành công,
      // không có trường 'success' hay 'message'.
      if (response.status === 200 && response.data && response.data.items) {
        // Thành công! (Kiểm tra bằng status 200 và sự tồn tại của mảng 'items')
        toast({
          title: "Added to Cart",
          description: `${quantity}x ${product.name} added to your cart.`,
        });

        // --- CẬP NHẬT MỚI: Gửi sự kiện để Navbar cập nhật ---
        try {
          // Lấy số lượng loại sản phẩm từ phản hồi
          const newCartItemCount = response.data.items.length;

          // 1. Lưu vào localStorage để tải lại trang vẫn đúng
          localStorage.setItem("cartCount", newCartItemCount.toString());

          // 2. Gửi sự kiện để Navbar đang mở cập nhật ngay lập tức
          window.dispatchEvent(
            new CustomEvent("cartUpdated", {
              detail: { newCount: newCartItemCount },
            })
          );
        } catch (e) {
          console.warn("Could not update cart count", e);
        }
        // --- KẾT THÚC CẬP NHẬT ---
      } else {
        // Lỗi không mong muốn, API trả về 200 nhưng không có dữ liệu
        throw new Error("Received an invalid response from the cart server.");
      }
      // --- KẾT THÚC SỬA ĐỔI ---
    } catch (error: any) {
      console.error("Add to cart API Error:", error);
      let errorMessage = "Could not add item to cart.";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
      } else if (axios.isAxiosError(error) && error.request) {
        errorMessage = "Network Error: Could not connect to the server.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false); // <-- THÊM MỚI
    }
  };

  const handleWishlist = () => {
    if (!product) return;
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: product.name,
    });
  };

  // --- RENDER LOGIC ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-lg text-gray-600">Loading product details...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Fetching Product
          </h1>
          <p className="text-gray-700 mb-8">{error}</p>
          <a href="/">
            <Button>Go Back Home</Button>
          </a>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-700 mb-8">
            Sorry, we couldn't find the product you're looking for.
          </p>
          <a href="/">
            <Button>Go Back Home</Button>
          </a>
        </main>
      </div>
    );
  }

  // --- RENDER KHI CÓ SẢN PHẨM ---
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar cartCount={cartCount} /> */} {/* Navbar tự quản lý */}
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Product Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Product Image - Thay thế <Image> bằng <img> */}
          <div className="flex items-center justify-center bg-white rounded-lg border border-gray-200 h-96 p-4">
            <img
              src={
                product.imageUrl ||
                product.avatar_url ||
                "https://placehold.co/400x400/e2e8f0/333?text=Image"
              }
              alt={product.name}
              className="object-contain max-w-full max-h-full"
              onError={(e) =>
                (e.currentTarget.src =
                  "https://placehold.co/400x400/e2e8f0/333?text=Image")
              }
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className={
                        // SỬA LỖI: Thêm giá trị mặc định (0)
                        i <= Math.round(product.rating || 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-600">
                  {/* SỬA LỖI: Thêm giá trị mặc định (0) */}
                  {product.rating || 0} ({product.reviews || 0} reviews)
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(product.price)}
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed">
              {/* SỬA LỖI: Thêm giá trị mặc định */}
              {product.description || "No description available."}
            </p>

            {/* Features */}
            {/* SỬA LỖI: Chỉ render nếu product.features tồn tại */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <span className="w-1-5 h-1-5 bg-black rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stock Status */}
            {/* SỬA LỖI: Dùng 'quantity' từ API để xác định còn hàng */}
            {product.quantity > 0 ? (
              <div className="text-green-600 font-semibold">In Stock</div>
            ) : (
              <div className="text-red-600 font-semibold">Out of Stock</div>
            )}

            {/* Quantity and Actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                  disabled={product.quantity <= 0 || isAddingToCart} // Vô hiệu hóa khi hết hàng
                >
                  −
                </button>
                <span className="px-6 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                  disabled={product.quantity <= 0 || isAddingToCart} // Vô hiệu hóa khi hết hàng
                >
                  +
                </button>
              </div>
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white hover:bg-gray-800 gap-2" // Lớp "gap-2" đã có, flex sẽ được áp dụng từ baseStyle
                // SỬA LỖI: Dùng 'quantity' HOẶC 'isAddingToCart' để disable nút
                disabled={product.quantity <= 0 || isAddingToCart}
              >
                <ShoppingBag size={20} />
                {/* THÊM MỚI: Hiển thị trạng thái loading */}
                {isAddingToCart
                  ? "Adding..."
                  : product.quantity <= 0
                  ? "Out of Stock"
                  : "Add to Cart"}
              </Button>
              <Button
                variant="outline"
                onClick={handleWishlist}
                className={`${isWishlisted ? "bg-red-50 text-red-600" : ""}`} // flex sẽ được áp dụng từ baseStyle
              >
                <Heart
                  size={20}
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </Button>
              <Button variant="outline">
                {" "}
                {/* flex sẽ được áp dụng từ baseStyle */}
                <Share2 size={20} />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex flex-col items-center text-center">
                <Truck className="text-gray-900 mb-2" size={24} />
                <p className="text-sm font-semibold text-gray-900">
                  Free Shipping
                </p>
                <p className="text-xs text-gray-600">On orders over 500k</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="text-gray-900 mb-2" size={24} />
                <p className="text-sm font-semibold text-gray-900">
                  Secure Payment
                </p>
                <p className="text-xs text-gray-600">100% protected</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <RotateCcw className="text-gray-900 mb-2" size={24} />
                <p className="text-sm font-semibold text-gray-900">
                  Easy Returns
                </p>
                <p className="text-xs text-gray-600">30-day guarantee</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {/* SỬA LỖI: Chỉ render nếu product.specifications tồn tại */}
        {product.specifications &&
          Object.keys(product.specifications).length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Specifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center py-3 border-b border-gray-200"
                  >
                    <span className="text-gray-600 font-medium">{key}</span>
                    <span className="text-gray-900 font-semibold">
                      {value as string}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Reviews Section */}
        <ProductReviews />
      </main>
    </div>
  );
}
