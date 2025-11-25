"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
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
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

// ... (Keep your existing components: Button, Card, ProductReviews, Navbar unchanged) ...

// --- COMPONENT MẪU (STUBS) ---
// (Copy lại các component Button, Card, ProductReviews, Navbar từ code cũ của bạn vào đây)
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

interface NavbarAuthData {
  user: {
    email: string;
  };
  token: string;
}

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
        const authData: NavbarAuthData = JSON.parse(storedData);
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

// --- HÀM HỖ TRỢ ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// --- ĐỊNH NGHĨA INTERFACE ---
interface AuthData {
  user: {
    email: string;
  };
  token: string;
}

interface ApiProductDetail {
  _id: string;
  name: string;
  price: number;
  avatar_url?: string;
  imageUrl?: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  quantity: number;
  description?: string;
  features?: string[];
  specifications?: Record<string, string>;
  [key: string]: any;
}

// Component con để xử lý logic lấy ID và fetch dữ liệu
function ProductContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Lấy id từ URL dạng ?id=...

  const [product, setProduct] = useState<ApiProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { toast } = useToast();

  // --- EFFECT GỌI API ---
  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      setError(null);

      if (!id) {
        setError("Product ID is missing.");
        setIsLoading(false);
        return;
      }

      // 1. Lấy token
      let token: string | null = null;
      try {
        const storedData = localStorage.getItem("authData");
        // Chúng ta cho phép xem sản phẩm mà không cần login, token là optional
        if (storedData) {
          const authData: AuthData = JSON.parse(storedData);
          token = authData.token;
        }
      } catch (error) {
        console.error("Failed to parse authData", error);
        // Không bắt buộc login ở đây để xem sản phẩm
      }

      // 2. Gọi API bằng Axios
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_GATEWAY_API}/api/products/getdetailproduct/${id}`,
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {},
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

    if (id) {
      fetchProductDetails();
    }
  }, [id, toast]);

  // --- HÀM XỬ LÝ ---
  const handleAddToCart = async () => {
    if (!product) return;
    setIsAddingToCart(true);

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
        setIsAddingToCart(false);
        return;
      }
      const authData: AuthData = JSON.parse(storedData);
      token = authData.token;
    } catch (error) {
      console.error("Failed to parse authData", error);
      localStorage.removeItem("authData");
      window.location.href = "/login";
      setIsAddingToCart(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_GATEWAY_API}/api/cart/addtocart`,
        {
          productId: product._id,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data && response.data.items) {
        toast({
          title: "Added to Cart",
          description: `${quantity}x ${product.name} added to your cart.`,
        });

        try {
          const newCartItemCount = response.data.items.length;
          localStorage.setItem("cartCount", newCartItemCount.toString());
          window.dispatchEvent(
            new CustomEvent("cartUpdated", {
              detail: { newCount: newCartItemCount },
            })
          );
        } catch (e) {
          console.warn("Could not update cart count", e);
        }
      } else {
        throw new Error("Received an invalid response from the cart server.");
      }
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
      setIsAddingToCart(false);
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
          <Link href="/">
            <Button>Go Back Home</Button>
          </Link>
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
          <Link href="/">
            <Button>Go Back Home</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Product Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
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
                  {product.rating || 0} ({product.reviews || 0} reviews)
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(product.price)}
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed">
              {product.description || "No description available."}
            </p>

            {/* Features */}
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
                  disabled={product.quantity <= 0 || isAddingToCart}
                >
                  −
                </button>
                <span className="px-6 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                  disabled={product.quantity <= 0 || isAddingToCart}
                >
                  +
                </button>
              </div>
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white hover:bg-gray-800 gap-2"
                disabled={product.quantity <= 0 || isAddingToCart}
              >
                <ShoppingBag size={20} />
                {isAddingToCart
                  ? "Adding..."
                  : product.quantity <= 0
                  ? "Out of Stock"
                  : "Add to Cart"}
              </Button>
              <Button
                variant="outline"
                onClick={handleWishlist}
                className={`${isWishlisted ? "bg-red-50 text-red-600" : ""}`}
              >
                <Heart
                  size={20}
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </Button>
              <Button variant="outline">
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

export default function ProductPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductContent />
    </Suspense>
  );
}
