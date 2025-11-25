"use client"

import Image from "next/image"
import { Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CartItemProps {
  id: string
  name: string
  price: string
  image: string
  quantity: number
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}

export function CartItem({ id, name, price, image, quantity, onQuantityChange, onRemove }: CartItemProps) {
  const priceNum = Number.parseInt(price.replace(/\D/g, ""))
  const subtotal = priceNum * quantity

  return (
    <div className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg">
      {/* Product Image */}
      <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
        <Image src={image || "/placeholder.svg"} alt={name} width={80} height={80} className="object-contain" />
      </div>

      {/* Product Details */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 mb-1">{name}</h3>
        <p className="text-gray-600 mb-3">{price}</p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="p-1 border border-gray-300 rounded hover:bg-gray-100"
          >
            <Minus size={16} />
          </button>
          <span className="px-3 py-1 font-semibold">{quantity}</span>
          <button
            onClick={() => onQuantityChange(quantity + 1)}
            className="p-1 border border-gray-300 rounded hover:bg-gray-100"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Price and Remove */}
      <div className="flex flex-col items-end justify-between">
        <p className="text-lg font-bold text-gray-900">{subtotal.toLocaleString()}₫</p>
        <Button variant="ghost" onClick={onRemove} className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <Trash2 size={18} />
        </Button>
      </div>
    </div>
  )
}
