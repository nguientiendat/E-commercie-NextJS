"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface ProductCardProps {
  id: string
  name: string
  price: string
  image: string
  onAddToCart: () => void
}

export function ProductCard({ id, name, price, image, onAddToCart }: ProductCardProps) {
  return (
    <Card className="overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <Link href={`/product/${id}`}>
        <div className="relative w-full h-48 bg-gray-100">
          <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/product/${id}`}>
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-gray-600">{name}</h3>
        </Link>
        <p className="text-lg font-semibold text-gray-900 mb-4">{price}</p>
        <Button onClick={onAddToCart} className="w-full bg-black text-white hover:bg-gray-800">
          Add to Cart
        </Button>
      </div>
    </Card>
  )
}
