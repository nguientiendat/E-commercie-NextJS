"use client";

import { Ban } from "lucide-react";
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

interface UserDeactivateConfirmationProps {
  user: User;
  onConfirm: (user: User) => void;
}

export function UserDeactivateConfirmation({
  user,
  onConfirm,
}: UserDeactivateConfirmationProps) {
  const isDeactivating = user.status === "active";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-slate-800 border-slate-700 max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                isDeactivating ? "bg-orange-500/20" : "bg-green-500/20"
              }`}
            >
              <Ban
                className={`w-6 h-6 ${
                  isDeactivating ? "text-orange-500" : "text-green-500"
                }`}
              />
            </div>
            <h3 className="text-lg font-bold text-white">
              {isDeactivating ? "Deactivate User?" : "Activate User?"}
            </h3>
          </div>

          <p className="text-slate-300 mb-2">
            Are you sure you want to{" "}
            {isDeactivating ? "deactivate" : "activate"}{" "}
            <span className="font-semibold">{user.name}</span>?
          </p>
          <p className="text-sm text-slate-400 mb-6">
            {isDeactivating
              ? "The user account will be deactivated and they will not be able to place orders."
              : "The user account will be activated."}
          </p>

          <div className="flex gap-3">
            <Button
              onClick={() => onConfirm(user)}
              className={`flex-1 text-white ${
                isDeactivating
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isDeactivating ? "Deactivate" : "Activate"}
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
