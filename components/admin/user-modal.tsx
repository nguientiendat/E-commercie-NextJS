"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

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

interface UserModalProps {
  user: User | null;
  onSave: (user: User) => void;
  onClose: () => void;
}

export function UserModal({ user, onSave, onClose }: UserModalProps) {
  const [formData, setFormData] = useState<Partial<User>>(
    user || {
      name: "",
      email: "",
      phone: "",
      address: "",
      joinDate: new Date().toISOString().split("T")[0],
      totalOrders: 0,
      totalSpent: 0,
      status: "active",
      deleted: false,
    }
  );

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "totalOrders" || name === "totalSpent"
          ? Number(value)
          : name === "status"
          ? (value as "active" | "inactive" | "suspended")
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const userToSave: User = {
      id: user?.id || "",
      name: formData.name || "",
      email: formData.email || "",
      phone: formData.phone || "",
      address: formData.address || "",
      joinDate: formData.joinDate || "",
      totalOrders: formData.totalOrders || 0,
      totalSpent: formData.totalSpent || 0,
      status:
        (formData.status as "active" | "inactive" | "suspended") || "active",
      deleted: formData.deleted || false,
    };

    onSave(userToSave);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-slate-800 border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-6 bg-slate-900 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">
            {user ? "Edit User" : "Add New User"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name *
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                required
                placeholder="Enter full name"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email *
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                required
                placeholder="Enter email"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Phone *
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
                required
                placeholder="Enter phone number"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Join Date
              </label>
              <Input
                type="date"
                name="joinDate"
                value={formData.joinDate || ""}
                onChange={handleInputChange}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Total Orders
              </label>
              <Input
                type="number"
                name="totalOrders"
                value={formData.totalOrders || ""}
                onChange={handleInputChange}
                min="0"
                placeholder="0"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Total Spent ($)
              </label>
              <Input
                type="number"
                name="totalSpent"
                value={formData.totalSpent || ""}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status || "active"}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Address
            </label>
            <Input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleInputChange}
              placeholder="Enter address"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
            >
              {user ? "Update User" : "Create User"}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-slate-600 text-slate-300 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
