"use client";
// export const runtime = "edge";
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import {
  ShoppingCart,
  LogOut,
  User,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
// import Link from "next/link"; // Đã được thay thế bằng <a>

// --- IMPORTS CHO CAROUSEL (MỚI) ---
// Giả lập các component này để tránh lỗi
// Bạn nên import từ thư viện UI của mình (ví dụ: shadcn)
const Carousel = ({
  children,
  className,
  opts,
  plugins,
  onMouseEnter,
  onMouseLeave,
}: {
  children: React.ReactNode;
  className?: string;
  opts?: any;
  plugins?: any[];
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => <div className={`relative ${className || ""}`}>{children}</div>;
const CarouselContent = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-hidden flex">{children}</div>
);
const CarouselItem = ({ children }: { children: React.ReactNode }) => (
  <div className="min-w-0 flex-shrink-0 flex-grow-0 basis-full">{children}</div>
);
const CarouselPrevious = ({ className }: { className?: string }) => (
  <button
    className={`absolute h-8 w-8 rounded-full bg-white/50 border border-gray-200 shadow-md flex items-center justify-center top-1/2 -translate-y-1/2 left-4 ${
      className || ""
    }`}
  >
    <ChevronLeft size={16} />
  </button>
);
const CarouselNext = ({ className }: { className?: string }) => (
  <button
    className={`absolute h-8 w-8 rounded-full bg-white/50 border border-gray-200 shadow-md flex items-center justify-center top-1/2 -translate-y-1/2 right-4 ${
      className || ""
    }`}
  >
    <ChevronRight size={16} />
  </button>
);
// Mock plugin Autoplay
const Autoplay = (options: any) => ({
  name: "autoplay",
  stop: () => {},
  reset: () => {},
  ...options,
});
// --- KẾT THÚC GIẢ LẬP CAROUSEL ---

// --- HÀM HỖ TRỢ VÀ COMPONENT MẪU ---

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
  onClick?: (e: React.MouseEvent) => void; // <-- SỬA LỖI: Bỏ '?' (optional) khỏi 'e'
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

// Hàm định dạng tiền tệ
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// --- COMPONENT MẪU: ProductCard ---
interface ProductCardProps {
  id: string;
  name: string;
  price: number; // <-- Giá đã giảm
  originalPrice: number; // <-- Giá gốc
  discount: number; // <-- % giảm giá
  image: string;
  quantity: number;
  onAddToCart: (event: React.MouseEvent) => void;
}

function ProductCard({
  id,
  name,
  price,
  originalPrice,
  discount,
  image,
  quantity,
  onAddToCart,
}: ProductCardProps) {
  const hasDiscount = discount > 0;
  const isOutOfStock = quantity <= 0;

  return (
    <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col group cursor-pointer">
      {/* 1. Phần Ảnh */}
      <div className="w-full aspect-video relative overflow-hidden">
        {/* Dùng aspect-video để ảnh rộng hơn, giống banner */}
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 ${
            isOutOfStock ? "opacity-50 grayscale" : ""
          }`}
          onError={(e) =>
            (e.currentTarget.src =
              "https://placehold.co/300x200/e2e8f0/333?text=Image")
          }
        />

        {/* Tag Hết hàng trên ảnh */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center ">
            <span className="bg-red-600 text-white px-3 py-1 rounded-md font-bold text-sm shadow-sm">
              Hết hàng
            </span>
          </div>
        )}
      </div>

      {/* 2. Phần Nội dung */}
      <div className="p-4 flex flex-col flex-grow ">
        {" "}
        {/* Nền tối giả lập giống ảnh */}
        {/* THAY ĐỔI: Tên và Số lượng trên cùng một hàng */}
        <div className="flex justify-between items-center mb-2 gap-3">
          <h3
            className="text-base font-medium text-black truncate flex-1"
            title={name}
          >
            {name}
          </h3>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-md whitespace-nowrap flex-shrink-0 ${
              isOutOfStock
                ? "bg-red-900 text-red-200"
                : "bg-slate-800 text-slate-300"
            }`}
          >
            SL: {quantity}
          </span>
        </div>
        {/* Logic hiển thị giá: Giá giảm - Giá gốc - Tag % */}
        <div className="mt-auto flex items-center gap-2 flex-wrap">
          <span className="text-black font-bold text-lg">
            {formatCurrency(price)}
          </span>

          {hasDiscount && (
            <>
              <span className="text-gray-400 text-sm line-through decoration-gray-400">
                {formatCurrency(originalPrice)}
              </span>
              <span className="bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center justify-center">
                -{discount}%
              </span>
            </>
          )}
        </div>
        {/* Ẩn nút Add to Cart để giống ảnh mẫu, 
            người dùng click vào card (thẻ a bao ngoài) để xem chi tiết 
        */}
      </div>
    </Card>
  );
}

// --- COMPONENT MẪU: ProductFilter ---
interface ProductFilterProps {
  onSortChange: (sort: string) => void;
  onCategoryChange: (category: string) => void;
  selectedSort: string;
  selectedCategory: string;
}
function ProductFilter({
  onSortChange,
  onCategoryChange,
  selectedSort,
  selectedCategory,
}: ProductFilterProps) {
  const categories = [
    { id: "all", name: "All Products" },
    { id: "audio", name: "Audio" },
    { id: "cables", name: "Cables & Adapters" },
    { id: "accessories", name: "Accessories" },
    { id: "storage", name: "Storage" },
  ];
  const sorts = [
    { id: "featured", name: "Featured" },
    { id: "price-low", name: "Price: Low to High" },
    { id: "price-high", name: "Price: High to Low" },
    { id: "newest", name: "Newest" },
  ];

  return (
    <Card className="p-6 bg-white border border-gray-200 sticky top-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Filters</h2>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Sort by</h3>
        <div className="space-y-2">
          {sorts.map((sort) => (
            <button
              key={sort.id}
              onClick={() => onSortChange(sort.id)}
              className={`w-full text-left p-2 rounded-lg ${
                selectedSort === sort.id
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {sort.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`w-full text-left p-2 rounded-lg ${
                selectedCategory === cat.id
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

// --- COMPONENT MẪU: Navbar ---
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
      console.error("Failed to parse authData in Navbar:", error);
      localStorage.removeItem("authData");
    }
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
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-700 hover:text-black font-medium">
              Products
            </a>
          </div>
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
// --- KẾT THÚC COMPONENT Navbar ---

// --- ĐỊNH NGHĨA INTERFACE DỮ LIỆU ---
interface ApiProduct {
  _id: string;
  name: string;
  avatar_url?: string;
  imageUrl?: string;
  price: number;
  category?: string;
  createdAt: string;
  discount?: number;
  quantity: number; // <-- THÊM MỚI: quantity
  [key: string]: any;
}

interface Product {
  id: string;
  name: string;
  price: number; // <-- Giá đã giảm
  originalPrice: number; // <-- Giá gốc
  discount: number; // <-- % giảm giá
  image: string;
  category: string;
  createdAt: string;
  quantity: number; // <-- THÊM MỚI: quantity
}

interface AuthData {
  user: {
    email: string;
  };
  token: string;
}

// --- COMPONENT HERO CAROUSEL ---
const carouselImages = [
  {
    src: "/carousel/banner1.jpg",
    alt: "Chương trình khuyến mãi 1",
  },
  {
    src: "/carousel/banner2.png",
    alt: "Sản phẩm mới 2",
  },
  {
    src: "/carousel/banner3.webp",
    alt: "Bộ sưu tập 3",
  },
];

function HeroCarousel() {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {carouselImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full aspect-[16/6] md:aspect-[16/5] overflow-hidden rounded-lg">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://placehold.co/1200x450/e2e8f0/333?text=Image+Not+Found")
                    }
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10" />
          <CarouselNext className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
      </div>
    </section>
  );
}
// --- KẾT THÚC COMPONENT HERO CAROUSEL ---

// --- COMPONENT TRANG CHỦ ---
export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSort, setSelectedSort] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();

  // --- LOGIC GỌI API ---
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      let token: string | null = null;

      // 1. Lấy token từ localStorage
      try {
        const storedData = localStorage.getItem("authData");
        if (storedData) {
          const authData: AuthData = JSON.parse(storedData);
          token = authData.token;
        }
        // Bỏ check bắt buộc login ở trang chủ
      } catch (error) {
        console.error("Failed to parse authData", error);
        localStorage.removeItem("authData");
      }

      // 2. Gọi API với token
      try {
        console.log("Dang fetch voi axios (Có header Auth)");

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_GATEWAY_API}/api/products/`, // Gọi qua Nginx Gateway
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {}, // Gửi header nếu có token
          }
        );

        const result = response.data;

        if (result.success && Array.isArray(result.data)) {
          // 3. Chuyển đổi (map) dữ liệu API sang định dạng component
          const mappedProducts: Product[] = result.data.map((p: ApiProduct) => {
            // --- LOGIC GIÁ MỚI ---
            const discountPercent = p.discount || 0;
            const originalPrice = p.price;
            const discountedPrice = originalPrice * (1 - discountPercent / 100);
            // --- KẾT THÚC LOGIC GIÁ MỚI ---

            return {
              id: p._id,
              name: p.name,
              price: discountedPrice,
              originalPrice: originalPrice,
              discount: discountPercent,
              quantity: p.quantity, // <-- MAP SỐ LƯỢNG
              image:
                p.imageUrl ||
                p.avatar_url ||
                "https://placehold.co/300x300/e2e8f0/333?text=Product",
              category: p.category || "accessories",
              createdAt: p.createdAt,
            };
          });
          setAllProducts(mappedProducts);
        } else {
          throw new Error(result.message || "Failed to parse product data");
        }
      } catch (error: any) {
        console.error("API Error:", error);
        let errorMessage = "Could not fetch products.";
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
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);
  // --- LOGIC LỌC VÀ SẮP XẾP ---

  // Lọc theo category
  const filteredProducts =
    selectedCategory === "all"
      ? allProducts
      : allProducts.filter((p) => p.category === selectedCategory);

  // Sắp xếp
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    // CẬP NHẬT: So sánh bằng giá ĐÃ GIẢM (price)
    const priceA = a.price;
    const priceB = b.price;

    switch (selectedSort) {
      case "price-low":
        return priceA - priceB;
      case "price-high":
        return priceB - priceA;
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return 0;
    }
  });

  const handleAddToCart = (productName: string) => {
    toast({
      title: "Added to Cart",
      description: `${productName} has been added to your cart.`,
    });
  };

  // --- RENDER ---

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroCarousel />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <ProductFilter
              onSortChange={setSelectedSort}
              onCategoryChange={setSelectedCategory}
              selectedSort={selectedSort}
              selectedCategory={selectedCategory}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Loading products...</p>
              </div>
            ) : sortedProducts.length > 0 ? (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-gray-600">
                    Showing {sortedProducts.length} of {allProducts.length}{" "}
                    products
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => (
                    // Bọc ProductCard bằng thẻ <a> (dùng 'a' thay 'Link')
                    <a
                      href={`/product?id=${product.id}`}
                      key={product.id}
                      className="group"
                    >
                      <ProductCard
                        id={product.id}
                        name={product.name}
                        image={product.image}
                        price={product.price} // Giá đã giảm (SỐ)
                        originalPrice={product.originalPrice} // Giá gốc (SỐ)
                        discount={product.discount} // % giảm (SỐ)
                        quantity={product.quantity} // Số lượng
                        onAddToCart={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(product.name);
                        }}
                      />
                    </a>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
