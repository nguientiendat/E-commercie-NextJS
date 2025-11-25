"use client"

import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Review {
  id: string
  author: string
  rating: number
  title: string
  text: string
  date: string
  helpful: number
}

const mockReviews: Review[] = [
  {
    id: "1",
    author: "John Doe",
    rating: 5,
    title: "Excellent Quality!",
    text: "These headphones have amazing sound quality and comfort. Highly recommend for anyone looking for premium audio equipment.",
    date: "2 weeks ago",
    helpful: 24,
  },
  {
    id: "2",
    author: "Sarah Smith",
    rating: 4,
    title: "Great Product, Minor Issues",
    text: "Good quality overall. Battery life is solid, but the case could be better designed.",
    date: "1 month ago",
    helpful: 12,
  },
  {
    id: "3",
    author: "Mike Johnson",
    rating: 5,
    title: "Best Purchase Ever",
    text: "Worth every penny! The noise cancellation is top-notch and the design is sleek.",
    date: "2 months ago",
    helpful: 31,
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} size={16} className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
      ))}
    </div>
  )
}

export function ProductReviews() {
  const averageRating = (mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length).toFixed(1)

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <Card className="p-6 bg-white border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">{averageRating}</div>
            <StarRating rating={Math.round(Number.parseFloat(averageRating))} />
            <p className="text-sm text-gray-600 mt-2">Based on {mockReviews.length} reviews</p>
          </div>
          <div className="md:col-span-2 space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = mockReviews.filter((r) => r.rating === rating).length
              const percentage = (count / mockReviews.length) * 100
              return (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-12">{rating} star</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-yellow-400 h-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-sm text-gray-600">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
        <Button className="w-full bg-black text-white hover:bg-gray-800">Write a Review</Button>
      </Card>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {mockReviews.map((review) => (
          <Card key={review.id} className="p-6 bg-white border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-semibold text-gray-900">{review.author}</p>
                  <span className="text-sm text-gray-500">• {review.date}</span>
                </div>
                <StarRating rating={review.rating} />
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
            <p className="text-gray-700 mb-4">{review.text}</p>
            <div className="flex items-center gap-4">
              <button className="text-sm text-gray-600 hover:text-gray-900">👍 Helpful ({review.helpful})</button>
              <button className="text-sm text-gray-600 hover:text-gray-900">👎 Not Helpful</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
