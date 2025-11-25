"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Product {
  id: string;
  name: string;
  [key: string]: any;
}

interface RestoreConfirmationProps {
  product: Product;
  onConfirm: (product: Product) => void;
}

export function RestoreConfirmation({
  product,
  onConfirm,
}: RestoreConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-slate-800 border-slate-700 max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <RotateCcw className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-white">Restore Product?</h3>
          </div>

          <p className="text-slate-300 mb-2">
            Are you sure you want to restore{" "}
            <span className="font-semibold">{product.name}</span>?
          </p>
          <p className="text-sm text-slate-400 mb-6">
            This product will be visible and available for sale again.
          </p>

          <div className="flex gap-3">
            <Button
              onClick={() => onConfirm(product)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Restore
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
