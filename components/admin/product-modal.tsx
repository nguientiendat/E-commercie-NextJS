"use client";

import React, { useState, useCallback } from "react";
import axios from "axios";
import { X, UploadCloud } from "lucide-react";

// --- 1. IMPORT REACT QUILL & DYNAMIC ---
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import CSS của Quill

// Import Dynamic để tắt SSR cho Quill (Tránh lỗi document is not defined)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
// --- COMPONENT MẪU VÀ HÀM HỖ TRỢ ---

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

export function Button({
  children,
  onClick,
  className,
  variant,
  disabled,
  type,
}: {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  className?: string;
  variant?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}) {
  const baseStyle =
    "px-4 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2";
  const variantStyle =
    variant === "outline"
      ? "bg-transparent border border-gray-300 text-gray-900 hover:bg-gray-50"
      : variant === "destructive"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"; // Sửa lại màu xanh cho đẹp
  return (
    <button
      type={type || "button"}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyle} ${className || ""}`}
    >
      {children}
    </button>
  );
}

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
  name?: string;
  value?: string | number;
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

// --- INTERFACES ---
interface AuthData {
  user: {
    email: string;
    role: string;
  };
  token: string;
}

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
  // State form
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || 0,
    quantity: product?.quantity || 0,
    discount: product?.discount || 0,
    sold_count: product?.sold_count || 0,
    days_valid: product?.days_valid || 365,
    description: product?.description || "", // Field này sẽ chứa HTML String
    frequently_asked_questions: product?.frequently_asked_questions || "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // --- 2. CẤU HÌNH TOOLBAR CHO EDITOR ---
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  // --- 3. HANDLER RIÊNG CHO DESCRIPTION (REACT QUILL) ---
  // Quill trả về string HTML trực tiếp, không phải event
  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  // Handler cho các input thường
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (product) {
      toast({
        title: "Update Logic Needed",
        description: "Update API logic has not been implemented yet.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    if (!imageFile) {
      toast({
        title: "Image Required",
        description: "Please select an image file to upload.",
        variant: "destructive",
      });
      setIsUploading(false);
      return;
    }

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
      const formDataApi = new FormData();
      formDataApi.append("name", formData.name);
      formDataApi.append("price", formData.price.toString());
      formDataApi.append("quantity", formData.quantity.toString());
      formDataApi.append("discount", formData.discount.toString());
      formDataApi.append("sold_count", formData.sold_count.toString());
      formDataApi.append("days_valid", formData.days_valid.toString());

      // Gửi chuỗi HTML Description lên Server
      formDataApi.append("description", formData.description);

      formDataApi.append(
        "frequently_asked_questions",
        formData.frequently_asked_questions
      );
      formDataApi.append("avatar_url", imageFile);

      const backendResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_GATEWAY_API}/api/products/addproduct`,
        formDataApi,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

            {/* Sold Count */}
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

            {/* Days Valid */}
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

          {/* Upload Image */}
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
                  name="avatar_url"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/png, image/jpeg, image/webp"
                  required={!product}
                />
              </label>
            </div>
          </div>

          {/* --- 4. DESCRIPTION VỚI REACT QUILL --- */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description (Rich Text)
            </label>
            {/* Wrapper div này để chỉnh style cho editor */}
            {/* bg-white: Để nền trắng cho dễ soạn thảo (vì Modal đang tối màu) */}
            {/* text-black: Để chữ màu đen */}
            <div className="bg-white text-black rounded-lg overflow-hidden">
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={handleDescriptionChange}
                modules={modules}
                className="h-64 mb-12" // mb-12 để tạo khoảng trống cho toolbar trên mobile
              />
            </div>
          </div>

          {/* FAQ */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              FAQ (Frequently Asked Questions)
            </label>
            <textarea
              name="frequently_asked_questions"
              value={formData.frequently_asked_questions}
              onChange={handleInputChange}
              placeholder="Enter FAQ for this product"
              rows={3}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white placeholder:text-slate-500 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
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
              type="button"
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
