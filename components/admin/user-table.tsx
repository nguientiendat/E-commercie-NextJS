"use client";

import { Edit2, Trash2, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDeactivate: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserTable({
  users,
  onEdit,
  onDeactivate,
  onDelete,
}: UserTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600 text-white">Active</Badge>;
      case "inactive":
        return <Badge className="bg-orange-600 text-white">Inactive</Badge>;
      case "suspended":
        return <Badge className="bg-red-600 text-white">Suspended</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-900 border-b border-slate-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
              Address
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
              Join Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
              Orders
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
              Total Spent
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-slate-700/50 transition-colors"
            >
              <td className="px-6 py-4 text-sm font-medium text-white">
                {user.name}
              </td>
              <td className="px-6 py-4 text-sm text-slate-300">{user.email}</td>
              <td className="px-6 py-4 text-sm text-slate-300">{user.phone}</td>
              <td className="px-6 py-4 text-sm text-slate-300">
                {user.address}
              </td>
              <td className="px-6 py-4 text-sm text-slate-300">
                {user.joinDate}
              </td>
              <td className="px-6 py-4 text-sm text-white font-medium">
                {user.totalOrders}
              </td>
              <td className="px-6 py-4 text-sm text-emerald-400 font-medium">
                ${user.totalSpent.toFixed(2)}
              </td>
              <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <Button
                    onClick={() => onEdit(user)}
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => onDeactivate(user)}
                    variant="ghost"
                    size="sm"
                    className="text-orange-400 hover:bg-orange-500/20 hover:text-orange-300"
                  >
                    <Ban className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => onDelete(user)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
