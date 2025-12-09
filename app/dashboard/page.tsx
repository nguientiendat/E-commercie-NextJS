"use client";

import { useState, useEffect } from "react";
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
  LucideIcon, // Import kiểu dữ liệu cho Icon
} from "lucide-react";
import { Navbar } from "@/components/navbar";

// --- 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU (INTERFACES) ---
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

const API_URL = "https://api.nguientiendat.online/api/analytics";

// --- 2. KHẮC PHỤC LỖI ICON MAP ---
// Khai báo rõ ràng: Object này có key là string, value là LucideIcon
const iconMap: Record<string, LucideIcon> = {
  "Total Revenue": DollarSign,
  "Total Orders": ShoppingCart,
  "Total Customers": Users,
  "Conversion Rate": TrendingUp,
};

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("6m");

  // --- 3. KHẮC PHỤC LỖI TYPE 'NEVER' ---
  // Nói rõ cho useState biết: state này tuân theo kiểu 'DashboardData'
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    revenueData: [],
    topProducts: [],
    metrics: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  // --- 4. KHẮC PHỤC LỖI SET ERROR ---
  // Nói rõ: state này có thể là 'string' HOẶC 'null'
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data: DashboardData = await response.json(); // Ép kiểu dữ liệu trả về
        setDashboardData(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        // Bây giờ bạn có thể set string thoải mái
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <div className="flex-1 flex items-center justify-center text-red-500">
          {error}
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
            <div className="flex gap-2">
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
            // TypeScript giờ đã hiểu metric có title là string
            // iconMap cũng đã được định nghĩa kiểu Record<string, LucideIcon>
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
