"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UserTable } from "@/components/admin/user-table";
import { UserModal } from "@/components/admin/user-modal";
import { UserDeleteConfirmation } from "@/components/admin/user-delete-confirmation";
import { UserDeactivateConfirmation } from "@/components/admin/user-deactivate-confirmation";

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
}

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1-555-0101",
    address: "123 Main St, New York, NY 10001",
    joinDate: "2024-01-15",
    totalOrders: 12,
    totalSpent: 1250.5,
    status: "active",
    deleted: false,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1-555-0102",
    address: "456 Oak Ave, Los Angeles, CA 90001",
    joinDate: "2024-02-20",
    totalOrders: 8,
    totalSpent: 890.25,
    status: "active",
    deleted: false,
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael@example.com",
    phone: "+1-555-0103",
    address: "789 Pine Rd, Chicago, IL 60601",
    joinDate: "2024-01-10",
    totalOrders: 25,
    totalSpent: 3450.0,
    status: "active",
    deleted: false,
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "+1-555-0104",
    address: "321 Elm St, Houston, TX 77001",
    joinDate: "2024-03-05",
    totalOrders: 3,
    totalSpent: 250.75,
    status: "inactive",
    deleted: false,
  },
  {
    id: "5",
    name: "Robert Brown",
    email: "robert@example.com",
    phone: "+1-555-0105",
    address: "654 Maple Dr, Phoenix, AZ 85001",
    joinDate: "2023-12-01",
    totalOrders: 45,
    totalSpent: 7890.0,
    status: "suspended",
    deleted: false,
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive" | "suspended"
  >("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);
  const [deactivateConfirm, setDeactivateConfirm] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and search logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesStatus && !user.deleted;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = (user: User) => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === user.id ? user : u)));
    } else {
      setUsers([...users, { ...user, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (user: User) => {
    setUsers(
      users.map((u) => (u.id === user.id ? { ...u, deleted: true } : u))
    );
    setDeleteConfirm(null);
  };

  const handleDeactivateUser = (user: User) => {
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
  const suspendedCount = users.filter(
    (u) => u.status === "suspended" && !u.deleted
  ).length;
  const totalRevenue = users.reduce((sum, u) => sum + u.totalSpent, 0);

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
            <div className="text-slate-600 text-sm mb-1">Total Revenue</div>
            <div className="text-2xl font-bold text-blue-600">
              ${totalRevenue.toFixed(2)}
            </div>
          </Card>
        </div>

        {/* Table */}
        <Card className="bg-white border-slate-300 overflow-hidden mb-6">
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
