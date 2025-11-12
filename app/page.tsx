"use client";

import { useState, useEffect, useRef } from "react"; // Đã thêm useRef cho carousel
import axios from "axios";

// --- COMPONENT NHẬP KHẨU ---
import { useToast } from "@/hooks/use-toast";

// --- CÁC THÀNH PHẦN GIAO DIỆN PHỤ TRỢ ---
import { Button } from "@/components/ui/button";
// Thêm CardContent (thường dùng với Card)
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, LogOut, User, ShoppingBag } from "lucide-react";

// --- IMPORTS CHO CAROUSEL (MỚI) ---
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"; // Plugin để tự động chạy

// --- HÀM ĐỊNH DẠNG TIỀN TỆ ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// --- COMPONENT MẪU: ProductCard ---
// (Tránh lỗi "Could not resolve")
interface ProductCardProps {
  id: string;
  name: string;
  price: string; // Đã được định dạng
  image: string;
  onAddToCart: (event: React.MouseEvent) => void; // Chấp nhận sự kiện click
}

// KHẮC PHỤC LỖI: Cung cấp đầy đủ props cho hàm
function ProductCard({
  id,
  name,
  price,
  image,
  onAddToCart,
}: ProductCardProps) {
  return (
    <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
      <div className="w-full h-48 relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) =>
            (e.currentTarget.src =
              "https://placehold.co/300x300/e2e8f0/333?text=Image")
          }
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3
          className="text-lg font-semibold text-gray-900 truncate flex-grow"
          title={name}
        >
          {name}
        </h3>
        <p className="text-gray-700 font-bold mt-1">{price}</p>
        <Button
          onClick={onAddToCart}
          className="w-full mt-4 bg-black text-white hover:bg-gray-800 gap-2"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}

// --- COMPONENT MẪU: ProductFilter ---
// (Tránh lỗi "Could not resolve")
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
// (Tránh lỗi "Could not resolve" cho Navbar)
// Định nghĩa cấu trúc authData cho Navbar
interface NavbarAuthData {
  user: {
    email: string;
  };
  token: string;
}

// Props của Navbar - không cần cartCount
interface NavbarProps {
  // cartCount?: number // Đã xóa
}

export function Navbar({}: NavbarProps) {
  const [authInfo, setAuthInfo] = useState<{ email: string } | null>(null);
  const [cartCount, setCartCount] = useState(0); // Navbar tự quản lý giỏ hàng (ví dụ)

  // Effect để đọc localStorage khi component mount
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("authData");
      if (storedData) {
        const authData: NavbarAuthData = JSON.parse(storedData);
        if (authData.user && authData.user.email) {
          setAuthInfo({ email: authData.user.email });
        }
      }
      // TODO: Logic đọc giỏ hàng (ví dụ: từ localStorage)
      // const storedCart = localStorage.getItem("cart");
      // if (storedCart) {
      //   setCartCount(JSON.parse(storedCart).length);
      // }
    } catch (error) {
      console.error("Failed to parse authData in Navbar:", error);
      localStorage.removeItem("authData");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authData");
    // localStorage.removeItem("cart"); // Xóa cả giỏ hàng nếu cần
    setAuthInfo(null);
    window.location.reload(); // Tải lại trang để về trạng thái đăng xuất
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <span className="text-xl font-bold text-black">MyEcom</span>
          </a>

          {/* Center - Products Link */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-700 hover:text-black font-medium">
              Products
            </a>
          </div>

          {/* Right - Cart and Auth */}
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
// Dữ liệu từ API
interface ApiProduct {
  _id: string;
  name: string;
  avatar_url?: string; // API có lúc dùng 'avatar_url'
  imageUrl?: string; // có lúc dùng 'imageUrl'
  price: number;
  category?: string; // API không trả về category, nhưng ta thêm vào để logic cũ hoạt động
  createdAt: string;
  [key: string]: any; // Cho các trường khác
}

// Dữ liệu đã được chuẩn hóa cho component
interface Product {
  id: string;
  name: string;
  price: number; // Sẽ giữ là số để sắp xếp
  image: string;
  category: string; // Sẽ gán giá trị mặc định
  createdAt: string; // Thêm trường createdAt
}

// Định nghĩa cấu trúc authData từ localStorage
interface AuthData {
  user: {
    email: string;
    // ... các trường user khác
  };
  token: string;
}

// --- (THÊM MỚI) COMPONENT HERO CAROUSEL ---

// CHỈNH SỬA TẠI ĐÂY: Thêm đường dẫn đến các ảnh của bạn
// Đường dẫn này giả định ảnh nằm trong thư mục /public/carousel/
const carouselImages = [
  {
    src: "/carousel/banner1.jpg", // Ví dụ: /public/carousel/banner1.jpg
    alt: "Chương trình khuyến mãi 1",
  },
  {
    src: "/carousel/banner2.png", // Ví dụ: /public/carousel/banner2.png
    alt: "Sản phẩm mới 2",
  },
  {
    src: "/carousel/banner3.webp", // Ví dụ: /public/carousel/banner3.webp
    alt: "Bộ sưu tập 3",
  },
];

function HeroCarousel() {
  // Setup plugin autoplay
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true }) // 5 giây
  );

  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            loop: true, // Lặp vô hạn
          }}
        >
          <CarouselContent>
            {carouselImages.map((image, index) => (
              <CarouselItem key={index}>
                {/* Chúng ta dùng div với aspect-ratio để đảm bảo kích thước
                  trước khi ảnh tải xong, tránh nhảy layout (CLS)
                */}
                <div className="relative w-full aspect-[16/6] md:aspect-[16/5] overflow-hidden rounded-lg">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      // Ảnh dự phòng nếu link hỏng
                      (e.currentTarget.src =
                        "https://placehold.co/1200x450/e2e8f0/333?text=Image+Not+Found")
                    }
                  />
                  {/* TÙY CHỌN: Nếu bạn muốn giữ lại text
                    Bạn có thể bỏ comment khối div này để hiện text trên ảnh
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center p-4">
                    <h1 className="text-4xl font-bold text-white mb-4">
                      Premium Tech Accessories
                    </h1>
                    <p className="text-lg text-gray-200">
                      Discover our curated collection...
                    </p>
                  </div> 
                  */}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Nút điều hướng (ẩn trên di động, hiện trên desktop) */}
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
  // const [cartCount, setCartCount] = useState(0); // ĐÃ XÓA - Navbar tự quản lý
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
        if (!storedData) {
          toast({
            title: "Authentication Error",
            description: "Please log in to view products.",
            variant: "destructive",
          });
          window.location.href = "/login"; // Chuyển hướng nếu chưa đăng nhập
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

      // 2. Gọi API với token
      try {
        console.log("Dang fetch voi axios (Có header Auth)");

        const response = await axios.get(
          "http://localhost:3002", // Gọi qua Nginx Gateway
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = response.data;

        if (result.success && Array.isArray(result.data)) {
          // 3. Chuyển đổi (map) dữ liệu API sang định dạng component
          const mappedProducts: Product[] = result.data
            .filter((p: ApiProduct) => p.price > 0) // Lọc các sản phẩm có giá âm
            .map((p: ApiProduct) => ({
              id: p._id,
              name: p.name,
              price: p.price, // Giữ là SỐ để sắp xếp
              image:
                p.imageUrl ||
                p.avatar_url ||
                "https://placehold.co/300x300/e2e8f0/333?text=Product", // Dùng ảnh đại diện (với fallback)
              category: p.category || "accessories", // Gán category mặc định vì API không có
              createdAt: p.createdAt,
            }));
          setAllProducts(mappedProducts);
        } else {
          throw new Error(result.message || "Failed to parse product data");
        }
      } catch (error: any) {
        console.error("API Error:", error);

        // --- Xử lý lỗi Axios (chi tiết hơn) ---
        let errorMessage = "Could not fetch products.";
        if (axios.isAxiosError(error) && error.response) {
          // Lỗi từ server (4xx, 5xx)
          errorMessage =
            error.response.data?.message ||
            `Server error: ${error.response.status}`;
        } else if (axios.isAxiosError(error) && error.request) {
          // Lỗi mạng (không kết nối được)
          errorMessage = "Network Error: Could not connect to the server.";
        } else if (error.message) {
          // Lỗi khác (ví dụ: lỗi parsing ở trên hoặc lỗi logic)
          errorMessage = error.message;
        }
        // --- Kết thúc xử lý lỗi ---

        toast({
          title: "Error",
          description: errorMessage, // Dùng errorMessage chi tiết
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
    // CẬP NHẬT: So sánh trực tiếp bằng SỐ, không cần parse string
    const priceA = a.price;
    const priceB = b.price;

    switch (selectedSort) {
      case "price-low":
        return priceA - priceB;
      case "price-high":
        return priceB - priceA;
      case "newest":
        // Sắp xếp theo ngày tạo (mới nhất trước)
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default: // 'featured' hoặc mặc định
        return 0; // Hoặc logic 'featured' của bạn, ví dụ: theo sold_count
    }
  });

  const handleAddToCart = (productName: string) => {
    // setCartCount(cartCount + 1); // ĐÃ XÓA - Navbar không nhận prop này
    toast({
      title: "Added to Cart",
      description: `${productName} has been added to your cart.`,
    });
    // Ghi chú: Navbar sẽ cần logic riêng để cập nhật số lượng (ví dụ: đọc từ localStorage hoặc Context)
  };

  // --- RENDER ---

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> {/* <-- Navbar tự quản lý state */}
      {/* Hero Section (ĐÃ THAY THẾ BẰNG CAROUSEL) */}
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
                {/* Bạn có thể thêm spinner ở đây */}
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
                    // Bọc ProductCard bằng thẻ <a>
                    <a
                      href={`/product/${product.id}`}
                      key={product.id}
                      className="group"
                    >
                      <ProductCard
                        id={product.id} // Truyền prop
                        name={product.name} // Truyền prop
                        image={product.image} // Truyền prop
                        price={formatCurrency(product.price)} // Định dạng giá thành chuỗi VND
                        onAddToCart={(e) => {
                          // Ngăn thẻ <a> điều hướng khi nhấp vào nút
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
