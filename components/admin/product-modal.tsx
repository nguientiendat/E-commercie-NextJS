"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios"; // <-- Import
import { X, UploadCloud } from "lucide-react";

// --- COMPONENT MẪU VÀ HÀM HỖ TRỢ ---
// (Các component này được định nghĩa ở đây để tránh lỗi 'Could not resolve')

// Mock useToast
const useToast = () => {
  const toast = useCallback(
    ({
      title,
      description,
      variant,
    }: {
      title: string;
      description: string;
      variant?: string;
    }) => {
      console.log(`Toast (${variant || "default"}): ${title} - ${description}`);
      if (variant === "destructive") {
        console.error(`Toast Error: ${title} - ${description}`);
      }
    },
    []
  );
  return { toast };
};

// Component Mẫu: Button
export function Button({
  children,
  onClick,
  className,
  variant,
  size,
  disabled,
  type, // <-- SỬA LỖI: Thêm 'type' prop
}: {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  className?: string;
  variant?: string;
  size?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset"; // <-- SỬA LỖI: Định nghĩa 'type'
}) {
  const baseStyle =
    "px-4 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2";
  const variantStyle =
    variant === "outline"
      ? "bg-transparent border border-gray-300 text-gray-900 hover:bg-gray-50"
      : variant === "destructive"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-black text-white hover:bg-gray-800 disabled:opacity-50";
  return (
    <button
      type={type || "button"} // <-- SỬA LỖI: Áp dụng 'type', mặc định là "button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyle} ${className || ""}`}
    >
      {children}
    </button>
  );
}

// Component MẪu: Card
export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
}

// Component MẪu: Input
export function Input({
  type,
  name,
  value,
  onChange,
  required,
  placeholder,
  className,
  step,
  min,
  max,
}: {
  type: string;
  name?: string; // name là optional cho type='file'
  value?: string | number; // value là optional cho type='file'
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
  step?: string;
  min?: string;
  max?: string;
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      step={step}
      min={min}
      max={max}
      className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 ${
        className || ""
      }`}
    />
  );
}

// --- KẾT THÚC COMPONENT MẪU ---

// --- INTERFACES ---
interface AuthData {
  user: {
    email: string;
    role: string;
  };
  token: string;
}

// Interface Product từ props
interface Product {
  id: string;
  name: string;
  imageUrl: string;
  imagePublicId: string;
  price: number;
  quantity: number;
  sold_count: number;
  frequently_asked_questions: string;
  discount: number;
  days_valid: number;
  deleted: boolean;
  description: string;
  discounted_price: number;
  is_available: boolean;
}

interface ProductModalProps {
  product: Product | null;
  onSave: (newProduct: any) => void;
  onClose: () => void;
}

// --- COMPONENT MODAL CHÍNH ---
export function ProductModal({ product, onSave, onClose }: ProductModalProps) {
  // Trạng thái cho các trường form
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || 0,
    quantity: product?.quantity || 0,
    discount: product?.discount || 0,
    sold_count: product?.sold_count || 0,
    days_valid: product?.days_valid || 365,
    description: product?.description || "",
    frequently_asked_questions: product?.frequently_asked_questions || "",
  });

  // State MỚI
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" ||
        name === "quantity" ||
        name === "discount" ||
        name === "days_valid" ||
        name === "sold_count"
          ? Number(value)
          : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // --- HÀM SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (product) {
      // Logic "Edit" (chưa làm)
      toast({
        title: "Update Logic Needed",
        description: "Update API logic has not been implemented yet.",
        variant: "destructive",
      });
      return;
    }

    // --- LOGIC TẠO MỚI (CREATE) ---
    setIsUploading(true);

    // 1. Kiểm tra file ảnh
    if (!imageFile) {
      toast({
        title: "Image Required",
        description: "Please select an image file to upload.",
        variant: "destructive",
      });
      setIsUploading(false);
      return;
    }

    // 2. Lấy token
    let token: string | null = null;
    try {
      const storedData = localStorage.getItem("authData");
      if (!storedData) throw new Error("User not authenticated.");
      token = (JSON.parse(storedData) as AuthData).token;
      if (!token) throw new Error("Token not found.");
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "Please log in again.",
        variant: "destructive",
      });
      setIsUploading(false);
      return;
    }

    try {
      // --- BƯỚC 1: TẠO FORMDATA ---
      const formDataApi = new FormData();

      // --- BƯỚC 2: APPEND CÁC TRƯỜNG DỮ LIỆU ---
      formDataApi.append("name", formData.name);
      formDataApi.append("price", formData.price.toString());
      formDataApi.append("quantity", formData.quantity.toString());
      formDataApi.append("discount", formData.discount.toString());
      formDataApi.append("sold_count", formData.sold_count.toString());
      formDataApi.append("days_valid", formData.days_valid.toString());
      formDataApi.append("description", formData.description);
      formDataApi.append(
        "frequently_asked_questions",
        formData.frequently_asked_questions
      );

      // --- BƯỚC 3: APPEND FILE ẢNH ---
      formDataApi.append("avatar_url", imageFile);

      // --- BƯỚC 4: GỌI API BACKEND ---
      const backendResponse = await axios.post(
        "http://localhost:3002/addproduct",
        formDataApi, // Gửi FormData
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Type' sẽ được axios tự động đặt là 'multipart/form-data'
          },
        }
      );

      if (backendResponse.data && backendResponse.data.success) {
        toast({
          title: "Product Created",
          description: `${formData.name} has been added successfully.`,
        });
        onSave(backendResponse.data.data);
        onClose();
      } else {
        throw new Error(
          backendResponse.data.message || "Failed to create product."
        );
      }
    } catch (error: any) {
      console.error("Submit Error:", error);
      let msg = "An unknown error occurred.";
      if (axios.isAxiosError(error) && error.response) {
        msg =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
      } else if (error.message) {
        msg = error.message;
      }
      toast({
        title: "Operation Failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-slate-800 border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-6 bg-slate-900 border-b border-slate-700 z-10">
          <h2 className="text-xl font-bold text-white">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
            disabled={isUploading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tên sản phẩm */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Product Name *
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                required
                placeholder="Enter product name"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            {/* Giá */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Price *
              </label>
              <Input
                type="number"
                name="price"
                value={formData.price || ""}
                onChange={handleInputChange}
                required
                min="0"
                placeholder="0"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            {/* Số lượng */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Quantity *
              </label>
              <Input
                type="number"
                name="quantity"
                value={formData.quantity || ""}
                onChange={handleInputChange}
                required
                min="0"
                placeholder="0"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            {/* Giảm giá */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Discount (%)
              </label>
              <Input
                type="number"
                name="discount"
                value={formData.discount || ""}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="0.1"
                placeholder="0"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            {/* Số lượng đã bán (Sold Count) */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Sold Count (Initial)
              </label>
              <Input
                type="number"
                name="sold_count"
                value={formData.sold_count || ""}
                onChange={handleInputChange}
                min="0"
                placeholder="0"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            {/* Ngày hiệu lực */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Days Valid
              </label>
              <Input
                type="number"
                name="days_valid"
                value={formData.days_valid || ""}
                onChange={handleInputChange}
                min="1"
                placeholder="365"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* --- Input tải ảnh --- */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Product Image (avatar_url) *
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-700 hover:bg-slate-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400">
                  <UploadCloud className="w-8 h-8 mb-2" />
                  {imageFile ? (
                    <p className="font-semibold text-blue-400">
                      {imageFile.name}
                    </p>
                  ) : (
                    <>
                      <p className="mb-2 text-sm">Click to upload</p>
                      <p className="text-xs">PNG, JPG, or WEBP</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  name="avatar_url" // <-- Key cho BE
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/png, image/jpeg, image/webp"
                  required={!product} // Chỉ bắt buộc khi tạo mới
                />
              </label>
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              placeholder="Enter product description"
              rows={3}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* FAQ */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              FAQ (Frequently Asked Questions)
            </label>
            <textarea
              name="frequently_asked_questions"
              value={formData.frequently_asked_questions || ""}
              onChange={handleInputChange}
              placeholder="Enter FAQ for this product"
              rows={3}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Nút Submit */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit" // <-- SỬA LỖI: Thêm type
              className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
              disabled={isUploading}
            >
              {isUploading
                ? "Submitting..."
                : product
                ? "Update Product"
                : "Create Product"}
            </Button>
            <Button
              type="button" // <-- SỬA LỖI: Thêm type
              onClick={onClose}
              variant="outline"
              className="border-slate-600 text-slate-300 bg-transparent"
              disabled={isUploading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
