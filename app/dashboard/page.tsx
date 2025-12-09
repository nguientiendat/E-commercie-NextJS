"use client";

import { useState, useEffect } from "react";
// Import useRouter để chuyển hướng nếu chưa đăng nhập
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  LucideIcon,
  Package,
} from "lucide-react";
import { Navbar } from "@/components/navbar";

// --- 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU ---
interface RevenueItem {
  month: string;
  revenue: number;
  orders: number;
  customers: number;
}

interface ProductItem {
  id: number;
  name: string;
  sales: number;
  revenue: string;
}

interface MetricItem {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

interface DashboardData {
  revenueData: RevenueItem[];
  topProducts: ProductItem[];
  metrics: MetricItem[];
}

// Cập nhật đúng Endpoint theo yêu cầu
const API_URL = "https://api.nguientiendat.online/api/analytics/dashboard";

const iconMap: Record<string, LucideIcon> = {
  "Total Revenue": DollarSign,
  "Total Orders": ShoppingCart,
  "Total Customers": Users,
  "Conversion Rate": TrendingUp,
};

export default function DashboardPage() {
  const router = useRouter(); // Hook để redirect
  const [timeRange, setTimeRange] = useState("6m");

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    revenueData: [],
    topProducts: [],
    metrics: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // --- BƯỚC 1: LẤY TOKEN TỪ LOCAL STORAGE ---
        // Cần kiểm tra window vì Next.js render server-side
        if (typeof window === "undefined") return;

        const storedAuthData = localStorage.getItem("authData");

        if (!storedAuthData) {
          throw new Error("Bạn chưa đăng nhập (Không tìm thấy authData).");
        }

        let token = "";
        let userRole = "";

        try {
          const parsedData = JSON.parse(storedAuthData);
          // Theo cấu trúc bạn đưa: {"user":{...}, "token": "..."}
          token = parsedData.token;
          userRole = parsedData.user?.role;
        } catch (e) {
          throw new Error("Dữ liệu đăng nhập bị lỗi.");
        }

        if (!token) {
          throw new Error("Token không hợp lệ.");
        }

        // --- BƯỚC 2: GỌI API VỚI METHOD POST & HEADER ---
        const response = await fetch(API_URL, {
          method: "POST", // Theo yêu cầu của bạn
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Gửi Token chuẩn JWT
            // Nếu API Gateway cần header role riêng thì bỏ comment dòng dưới:
            // "x-role": userRole
          },
          body: JSON.stringify({
            // Nếu Backend cần body gì thì thêm vào đây, ví dụ timeRange
            timeRange: timeRange,
          }),
        });

        if (response.status === 401 || response.status === 403) {
          // Nếu token hết hạn hoặc không có quyền -> Redirect về login
          router.push("/auth/login");
          throw new Error(
            "Phiên đăng nhập hết hạn hoặc không có quyền truy cập."
          );
        }

        if (!response.ok) {
          throw new Error(`Lỗi server: ${response.statusText}`);
        }

        const data = await response.json();

        // Kiểm tra cấu trúc trả về (nếu backend bọc trong field success)
        // Nếu backend trả về { success: true, revenueData: [...], ... }
        if (data.revenueData) {
          setDashboardData(data);
        } else {
          // Fallback nếu cấu trúc khác
          setDashboardData(data.data || data);
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Không thể tải dữ liệu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange, router]); // Thêm timeRange để reload khi đổi filter

  // --- RENDERING (GIỮ NGUYÊN) ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-red-500 gap-4">
          <p>{error}</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
          >
            Quay lại trang đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Dashboard Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Welcome back! Here&apos;s your sales performance
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Button Quản lý sản phẩm */}
              <a
                href="https://nguientiendat.online/admin/products"
                className="px-4 py-2 bg-primary text-primary-foreground rounded font-medium hover:opacity-90 transition flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                Quản lý sản phẩm
              </a>

              {/* Time Range Buttons */}
              {["1m", "3m", "6m", "1y"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-sm font-medium rounded border transition ${
                    timeRange === range
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:border-primary"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardData.metrics.map((metric) => {
            const Icon = iconMap[metric.title] || TrendingUp;

            return (
              <Card key={metric.title} className="border border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {metric.value}
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-semibold mt-2 ${
                      metric.isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {metric.isPositive ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {metric.change} from last month
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Revenue Chart */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-foreground">
                Revenue & Orders
              </CardTitle>
              <CardDescription>
                Monthly revenue and order trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dashboardData.revenueData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--chart-1))"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--chart-1))"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--chart-1))"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Top Products</CardTitle>
            <CardDescription>
              Best performing products this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Product
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Sales
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.topProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-border hover:bg-muted/50 transition"
                    >
                      <td className="py-3 px-4 text-foreground">
                        {product.name}
                      </td>
                      <td className="py-3 px-4 text-foreground font-semibold">
                        {product.sales.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-foreground">
                        {product.revenue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
