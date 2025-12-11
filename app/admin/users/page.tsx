"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UserTable } from "@/components/admin/user-table";
import { UserModal } from "@/components/admin/user-modal";
import { UserDeleteConfirmation } from "@/components/admin/user-delete-confirmation";
import { UserDeactivateConfirmation } from "@/components/admin/user-deactivate-confirmation";

// Interface này giữ nguyên để tương thích với các Component con (UserTable, UserModal...)
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive" | "suspended";
  deleted: boolean;
  role?: string; // Thêm role nếu cần hiển thị
}

// Interface cho dữ liệu trả về từ API (dựa trên cấu trúc thường gặp của Node.js/Mongo)
interface ApiUserResponse {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  phoneNumber?: string;
  address?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

export default function AdminUsersPage() {
  const router = useRouter();

  // States
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive" | "suspended"
  >("all");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);
  const [deactivateConfirm, setDeactivateConfirm] = useState<User | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- FETCH DATA TỪ API ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 1. Kiểm tra Token trong LocalStorage
        if (typeof window === "undefined") return;
        const storedAuthData = localStorage.getItem("authData");

        if (!storedAuthData) {
          router.push("/auth/login"); // Redirect nếu chưa đăng nhập
          return;
        }

        const { token } = JSON.parse(storedAuthData);

        // 2. Gọi API
        const response = await fetch(
          "https://api.nguientiendat.online/api/auth/allusers",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("authData");
          router.push("/auth/login");
          throw new Error("Phiên đăng nhập hết hạn.");
        }

        if (!response.ok) {
          throw new Error("Không thể tải danh sách người dùng.");
        }

        const rawData = await response.json();

        // Xử lý dữ liệu trả về (Có thể là mảng hoặc object chứa mảng)
        const userList: ApiUserResponse[] = Array.isArray(rawData)
          ? rawData
          : rawData.data || rawData.users || [];

        // 3. Map dữ liệu từ API sang Interface User của UI
        // Lưu ý: Các trường không có trong Auth Service (như totalOrders, totalSpent) sẽ để mặc định
        const formattedUsers: User[] = userList.map((u) => ({
          id: u._id,
          name: u.username || "No Name",
          email: u.email,
          phone: u.phoneNumber || "N/A", // Nếu API không có sđt thì để N/A
          address: u.address || "N/A",
          joinDate: u.createdAt
            ? new Date(u.createdAt).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          totalOrders: 0, // Dữ liệu này cần lấy từ Order Service (tạm thời để 0)
          totalSpent: 0, // Dữ liệu này cần lấy từ Order Service (tạm thời để 0)
          status: "active", // Logic xác định status, có thể dựa vào u.isActive
          deleted: false,
          role: u.role,
        }));

        setUsers(formattedUsers);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError(err.message || "Đã xảy ra lỗi kết nối.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  // --- LOGIC FILTER & PAGINATION (Giữ nguyên) ---
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesStatus && !user.deleted;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // --- HANDLERS (Giữ nguyên logic cập nhật state local) ---
  // Lưu ý: Để hoàn chỉnh, các hàm này cũng cần gọi API (PUT/DELETE) lên server

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = (user: User) => {
    // TODO: Gọi API cập nhật user tại đây
    if (editingUser) {
      setUsers(users.map((u) => (u.id === user.id ? user : u)));
    } else {
      setUsers([...users, { ...user, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (user: User) => {
    // TODO: Gọi API xóa user tại đây
    setUsers(
      users.map((u) => (u.id === user.id ? { ...u, deleted: true } : u))
    );
    setDeleteConfirm(null);
  };

  const handleDeactivateUser = (user: User) => {
    // TODO: Gọi API khóa user tại đây
    const newStatus = user.status === "inactive" ? "active" : "inactive";
    setUsers(
      users.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
    );
    setDeactivateConfirm(null);
  };

  // Statistics
  const activeCount = users.filter(
    (u) => u.status === "active" && !u.deleted
  ).length;
  const inactiveCount = users.filter(
    (u) => u.status === "inactive" && !u.deleted
  ).length;
  const totalRevenue = users.reduce((sum, u) => sum + u.totalSpent, 0);

  // --- RENDER LOADING / ERROR ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-slate-500">Đang tải dữ liệu người dùng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-red-500">
          <AlertCircle className="h-10 w-10 mx-auto mb-2" />
          <p>{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  // --- RENDER MAIN UI ---
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            User Management
          </h1>
          <p className="text-slate-600">
            Manage customer accounts and user information
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search users by name, email or phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 bg-white border-slate-300 text-slate-900 placeholder:text-slate-500"
              />
            </div>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(
                e.target.value as "all" | "active" | "inactive" | "suspended"
              );
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white border-slate-300 p-4">
            <div className="text-slate-600 text-sm mb-1">Total Users</div>
            <div className="text-2xl font-bold text-slate-900">
              {users.filter((u) => !u.deleted).length}
            </div>
          </Card>
          <Card className="bg-white border-slate-300 p-4">
            <div className="text-slate-600 text-sm mb-1">Active Users</div>
            <div className="text-2xl font-bold text-green-600">
              {activeCount}
            </div>
          </Card>
          <Card className="bg-white border-slate-300 p-4">
            <div className="text-slate-600 text-sm mb-1">Inactive Users</div>
            <div className="text-2xl font-bold text-orange-600">
              {inactiveCount}
            </div>
          </Card>
          <Card className="bg-white border-slate-300 p-4">
            <div className="text-slate-600 text-sm mb-1">
              Total Revenue (Est.)
            </div>
            <div className="text-2xl font-bold text-blue-600">
              ${totalRevenue.toFixed(2)}
            </div>
          </Card>
        </div>

        {/* Table */}
        <Card className="bg-white border-slate-300 overflow-hidden mb-6 text-black">
          <UserTable
            users={paginatedUsers}
            onEdit={handleEditUser}
            onDeactivate={setDeactivateConfirm}
            onDelete={setDeleteConfirm}
          />
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-slate-600 text-sm">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="border-slate-300 text-slate-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className={
                      currentPage === page
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "border-slate-300 text-slate-700 hover:bg-slate-100"
                    }
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="border-slate-300 text-slate-700"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {isModalOpen && (
        <UserModal
          user={editingUser}
          onSave={handleSaveUser}
          onClose={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
        />
      )}

      {deleteConfirm && (
        <UserDeleteConfirmation
          user={deleteConfirm}
          onConfirm={handleDeleteUser}
        />
      )}
      {deactivateConfirm && (
        <UserDeactivateConfirmation
          user={deactivateConfirm}
          onConfirm={handleDeactivateUser}
        />
      )}
    </div>
  );
}
