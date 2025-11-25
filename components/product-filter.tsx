"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ProductFilterProps {
  onSortChange: (sort: string) => void
  onCategoryChange: (category: string) => void
  selectedSort: string
  selectedCategory: string
}

export function ProductFilter({ onSortChange, onCategoryChange, selectedSort, selectedCategory }: ProductFilterProps) {
  return (
    <Card className="p-6 bg-white border border-gray-200">
      <div className="space-y-6">
        {/* Sort */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Sort by</h3>
          <div className="space-y-2">
            {[
              { value: "featured", label: "Featured" },
              { value: "price-low", label: "Price: Low to High" },
              { value: "price-high", label: "Price: High to Low" },
              { value: "newest", label: "Newest" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={`block w-full text-left px-4 py-2 rounded transition-colors ${
                  selectedSort === option.value ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Category</h3>
          <div className="space-y-2">
            {[
              { value: "all", label: "All Products" },
              { value: "audio", label: "Audio" },
              { value: "cables", label: "Cables & Adapters" },
              { value: "accessories", label: "Accessories" },
              { value: "storage", label: "Storage" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => onCategoryChange(option.value)}
                className={`block w-full text-left px-4 py-2 rounded transition-colors ${
                  selectedCategory === option.value
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reset Filters */}
        <Button
          variant="outline"
          className="w-full text-gray-900 border-gray-200 bg-transparent"
          onClick={() => {
            onSortChange("featured")
            onCategoryChange("all")
          }}
        >
          Reset Filters
        </Button>
      </div>
    </Card>
  )
}
