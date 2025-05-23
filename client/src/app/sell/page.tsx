"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiUpload,
  FiType,
  FiList,
  FiAlertCircle,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import { RiPriceTag3Line } from "react-icons/ri";
import axios from "axios";
import { createClient } from "@/utils/supabase/client";

const clothingTypes = [
  "Kemeja",
  "Kaos",
  "Celana",
  "Dress",
  "Jaket",
  "Rok",
  "Sweater",
  "Cardigan",
  "Lainnya",
];

const clothingSizes = ["XS", "S", "M", "L", "XL", "XXL"];

const conditions = ["Seperti Baru", "Sangat Baik", "Baik", "Cukup Baik"];

const towns = [
  "Gunung Kidul",
  "Kulon Progo",
  "Bantul",
  "Sleman",
  "Kota Yogyakarta",
];

export default function SellPage() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    type: "",
    size: "",
    condition: "",
    town: "",
    detailedAddress: "",
    description: "",
  });

  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    addImages(files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    const files = e.dataTransfer.files;
    if (!files) return;

    addImages(files);
  };

  const addImages = (files: FileList) => {
    if (images.length + files.length > 5) {
      setError("Maksimal 5 gambar dapat diunggah");
      return;
    }

    setError("");

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      setImageFiles((prev) => [...prev, file]);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages((prev) => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.price ||
      !formData.type ||
      !formData.size ||
      !formData.condition ||
      !formData.town ||
      !formData.detailedAddress ||
      !formData.description
    ) {
      setError("Semua field harus diisi");
      return;
    }

    if (images.length === 0 || imageFiles.length === 0) {
      setError("Minimal 1 gambar harus diunggah");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError("Anda harus login untuk menjual produk");
        return;
      }

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      formDataToSend.append("image", imageFiles[0]);

      const result = await axios.post(
        `${API_URL}/api/products`,
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!result.data.success) {
        throw new Error(result.data.error || "Failed to create product");
      }

      setFormData({
        name: "",
        price: "",
        type: "",
        size: "",
        condition: "",
        town: "",
        detailedAddress: "",
        description: "",
      });
      setImages([]);
      setImageFiles([]);

      alert("Produk berhasil diposting!");

      window.location.href = "/marketplace";
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Gagal menambahkan produk. Silakan coba lagi.";

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-white to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-primary mb-2">
              Jual Barang
            </h1>
            <p className="text-secondary mb-8">
              Jual pakaian bekas Anda dan berkontribusi pada gerakan fashion
              berkelanjutan
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6 flex items-start">
                <FiAlertCircle className="mt-0.5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-primary mb-6">
                    Informasi Produk
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Nama Produk
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Contoh: Kemeja Flannel Uniqlo"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Harga (Rp)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <RiPriceTag3Line className="text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="Contoh: 150000"
                          className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="type"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Jenis Pakaian
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiType className="text-gray-400" />
                        </div>
                        <select
                          id="type"
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                          className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
                        >
                          <option value="">Pilih jenis pakaian</option>
                          {clothingTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="size"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Ukuran
                      </label>
                      <select
                        id="size"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
                      >
                        <option value="">Pilih ukuran</option>
                        {clothingSizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="condition"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Kondisi
                      </label>
                      <select
                        id="condition"
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
                      >
                        <option value="">Pilih kondisi</option>
                        {conditions.map((condition) => (
                          <option key={condition} value={condition}>
                            {condition}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="town"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Kabupaten/Kota
                      </label>
                      <select
                        id="town"
                        name="town"
                        value={formData.town}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
                      >
                        <option value="">Pilih kabupaten/kota</option>
                        {towns.map((town) => (
                          <option key={town} value={town}>
                            {town}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="detailedAddress"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Alamat Lengkap
                      </label>
                      <input
                        type="text"
                        id="detailedAddress"
                        name="detailedAddress"
                        value={formData.detailedAddress}
                        onChange={handleChange}
                        placeholder="Masukkan alamat lengkap Anda"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Deskripsi
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <FiList className="text-gray-400 mt-0.5" />
                        </div>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Jelaskan detail produk Anda (warna, bahan, kondisi, dll)"
                          className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-primary mb-6">
                    Foto Produk
                  </h2>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center ${
                      dragging
                        ? "border-primary bg-primary/5"
                        : "border-gray-300"
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                  >
                    <FiUpload className="text-4xl text-gray-400 mb-3" />
                    <p className="text-center text-gray-500 mb-2">
                      Seret & lepas foto di sini, atau
                    </p>
                    <label className="btn-primary cursor-pointer">
                      <span>Pilih Foto</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Format: JPG, PNG. Maks. 5 foto
                    </p>
                  </div>

                  {images.length > 0 && (
                    <div className="mt-6">
                      <p className="text-sm text-gray-700 mb-3">
                        {images.length} foto diunggah
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {images.map((image, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-md overflow-hidden border border-gray-200"
                          >
                            <Image
                              src={image}
                              alt={`Product image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                              onClick={() => removeImage(index)}
                            >
                              <FiX className="text-gray-700" size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Link href="/marketplace" className="btn-secondary mr-4">
                    Batal
                  </Link>
                  <button
                    type="submit"
                    className="btn-primary flex items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Memproses...
                      </>
                    ) : (
                      <>
                        Posting Produk <FiChevronRight className="ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-secondary/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">
                Tips untuk Penjualan Cepat
              </h3>
              <ul className="space-y-2 text-secondary">
                <li className="flex items-start">
                  <div className="bg-primary/10 rounded-full p-1 mr-3 mt-0.5">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <span>
                    Gunakan foto yang jelas dengan pencahayaan yang baik
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 rounded-full p-1 mr-3 mt-0.5">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <span>Buat deskripsi produk yang detail dan jujur</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 rounded-full p-1 mr-3 mt-0.5">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <span>
                    Tetapkan harga yang wajar berdasarkan kondisi barang
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 rounded-full p-1 mr-3 mt-0.5">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <span>Sebutkan ukuran sesuai dengan label asli pakaian</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
