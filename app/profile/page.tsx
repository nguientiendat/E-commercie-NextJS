"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Package,
  Settings,
  MapPin,
  Phone,
  Mail,
  Edit2,
  LogOut,
} from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"account" | "orders" | "settings">(
    "account"
  );
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data
  const user = {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    memberSince: "January 2023",
    address: "123 Main Street, San Francisco, CA 94102",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  };

  // Mock order data
  const orders = [
    {
      id: "#ORD-001",
      date: "Nov 10, 2024",
      items: 3,
      total: "$248.50",
      status: "Delivered",
      statusColor: "bg-green-100 text-green-800",
    },
    {
      id: "#ORD-002",
      date: "Oct 28, 2024",
      items: 1,
      total: "$89.99",
      status: "Delivered",
      statusColor: "bg-green-100 text-green-800",
    },
    {
      id: "#ORD-003",
      date: "Oct 15, 2024",
      items: 2,
      total: "$156.75",
      status: "Cancelled",
      statusColor: "bg-red-100 text-red-800",
    },
    {
      id: "#ORD-004",
      date: "Sep 20, 2024",
      items: 4,
      total: "$512.00",
      status: "Delivered",
      statusColor: "bg-green-100 text-green-800",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={true} cartCount={2} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="mb-12">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="w-20 h-20 rounded-full border-2 border-black"
                />
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {user.name}
                </h1>
                <p className="text-gray-600 mb-4">
                  Member since {user.memberSince}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {user.phone}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="gap-2 bg-black text-white hover:bg-gray-800"
                >
                  <Edit2 className="w-4 h-4" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 border-gray-300 bg-transparent"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("account")}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "account"
                ? "border-black text-black"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Account
            </div>
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "orders"
                ? "border-black text-black"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Orders
            </div>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === "settings"
                ? "border-black text-black"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </div>
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {/* Account Tab */}
          {activeTab === "account" && (
            <div className="space-y-6">
              {/* Personal Information */}
              <Card className="bg-white border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Personal Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={user.name}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 rounded-lg border border-gray-300 transition ${
                        isEditing
                          ? "bg-white focus:ring-2 focus:ring-black"
                          : "bg-gray-50 text-gray-600"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 rounded-lg border border-gray-300 transition ${
                        isEditing
                          ? "bg-white focus:ring-2 focus:ring-black"
                          : "bg-gray-50 text-gray-600"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={user.phone}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 rounded-lg border border-gray-300 transition ${
                        isEditing
                          ? "bg-white focus:ring-2 focus:ring-black"
                          : "bg-gray-50 text-gray-600"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Member Since
                    </label>
                    <input
                      type="text"
                      value={user.memberSince}
                      disabled
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-600"
                    />
                  </div>
                </div>
              </Card>

              {/* Shipping Address */}
              <Card className="bg-white border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Shipping Address
                  </h2>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      Add Address
                    </Button>
                  )}
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-gray-600">{user.address}</p>
                    <p className="text-gray-600">{user.phone}</p>
                  </div>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <Card
                    key={order.id}
                    className="bg-white border border-gray-200 p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.id}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                          <span>Order Date: {order.date}</span>
                          <span>Items: {order.items}</span>
                          <span className="font-semibold text-gray-900">
                            {order.total}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${order.statusColor}`}
                        >
                          {order.status}
                        </span>
                        <Button className="mt-4 bg-black text-white hover:bg-gray-800">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="bg-white border border-gray-200 p-12 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No orders yet</p>
                  <Link href="/">
                    <Button className="mt-4 bg-black text-white hover:bg-gray-800">
                      Start Shopping
                    </Button>
                  </Link>
                </Card>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <Card className="bg-white border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Preferences
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        Email Notifications
                      </p>
                      <p className="text-sm text-gray-600">
                        Receive updates about orders and promotions
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        SMS Notifications
                      </p>
                      <p className="text-sm text-gray-600">
                        Get SMS updates on shipments
                      </p>
                    </div>
                    <input type="checkbox" className="w-5 h-5 rounded" />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Newsletter</p>
                      <p className="text-sm text-gray-600">
                        Subscribe to our weekly newsletter
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded"
                    />
                  </div>
                </div>
              </Card>

              <Card className="bg-white border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Security
                </h2>
                <Button
                  variant="outline"
                  className="border-gray-300 w-full md:w-auto bg-transparent"
                >
                  Change Password
                </Button>
              </Card>

              <Card className="bg-white border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Account
                </h2>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 w-full md:w-auto bg-transparent"
                >
                  Delete Account
                </Button>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
