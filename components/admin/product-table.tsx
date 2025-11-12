"use client";

import { Edit2, Trash2, RotateCcw, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Product {
  _id: string;
  name: string;
  imageUrl?: string;
  avatar_url?: string;
  price: number;
  quantity: number;
  createdAt: string;
  is_available?: boolean;
  deleted?: boolean;
}

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onRestore: (product: Product) => void;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  onRestore,
}: ProductTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-900 border-b border-slate-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
              Image
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
              Created At
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
          {products.map((product) => (
            <tr
              key={product._id}
              className="hover:bg-slate-700/50 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center overflow-hidden">
                  {product.imageUrl || product.avatar_url ? (
                    <img
                      src={product.imageUrl || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-slate-500" />
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-white">{product.name}</td>
              <td className="px-6 py-4 text-sm text-white font-medium">
                ${product.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-sm text-white">
                {product.quantity}
              </td>
              <td className="px-6 py-4 text-sm text-slate-300">
                {new Date(product.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  {product.deleted ? (
                    <Badge className="bg-red-600 text-white">Deleted</Badge>
                  ) : product.is_available ? (
                    <Badge className="bg-green-600 text-white">Available</Badge>
                  ) : (
                    <Badge className="bg-orange-600 text-white">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <Button
                    onClick={() => onEdit(product)}
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  {product.deleted ? (
                    <Button
                      onClick={() => onRestore(product)}
                      variant="ghost"
                      size="sm"
                      className="text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onDelete(product)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
