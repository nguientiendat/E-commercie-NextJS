"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface UserDeleteConfirmationProps {
  user: User;
  onConfirm: (user: User) => void;
}

export function UserDeleteConfirmation({
  user,
  onConfirm,
}: UserDeleteConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-slate-800 border-slate-700 max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-white">Delete User?</h3>
          </div>

          <p className="text-slate-300 mb-2">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{user.name}</span>?
          </p>
          <p className="text-sm text-slate-400 mb-6">
            This will soft delete the user account. You can restore it later.
          </p>

          <div className="flex gap-3">
            <Button
              onClick={() => onConfirm(user)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
