"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiInfo,
  FiMapPin,
  FiAlertTriangle,
  FiGift,
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiPackage,
  FiChevronRight,
  FiChevronLeft,
  FiList,
  FiUpload,
  FiX,
} from "react-icons/fi";
import axios from "axios";

export default function DonatePage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    itemType: "",
    itemDescription: "",
    itemQuantity: "",
    pickup: false,
    terms: false,
  });
  const [images, setImages] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      if (!file.type.startsWith("image/")) {
        setError("Hanya file gambar yang diperbolehkan (JPG, PNG, WEBP)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran file terlalu besar. Maksimal 5MB per file");
        return;
      }

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (!formData.terms) {
        setError("Anda harus menyetujui syarat dan ketentuan donasi");
        return;
      }

      if (images.length === 0) {
        setError("Minimal 1 gambar harus diunggah");
        return;
      }

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://sericlo-6e15467e3310.herokuapp.com";

      const formDataToSend = new FormData();

      const imageResponse = await fetch(images[0]);
      const blob = await imageResponse.blob();

      if (blob.size > 5 * 1024 * 1024) {
        setError("Ukuran file terlalu besar. Maksimal 5MB per file");
        return;
      }

      formDataToSend.append("image", blob, "image.jpg");

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "terms") {
          formDataToSend.append(key, value.toString());
        }
      });

      const apiResponse = await axios.post(
        `${API_URL}/api/donations`,
        formDataToSend,
        {
          withCredentials: false,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (apiResponse.data.success) {
        setIsSuccess(true);
      } else {
        throw new Error(apiResponse.data.error || "Failed to submit donation");
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("File too large")) {
        setError("Ukuran file terlalu besar. Maksimal 5MB per file");
      } else {
        setError(
          error instanceof Error
            ? error.message
            : "Gagal mengirim donasi. Silakan coba lagi."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  return (
    <main className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-white to-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 mb-12"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Program Donasi Pakaian
              </h1>
              <p className="text-lg text-secondary">
                Donasikan pakaian tidak terpakai Anda untuk membantu orang yang
                membutuhkan dan mengurangi limbah tekstil. Bersama kita bisa
                membuat perbedaan.
              </p>
            </div>
            <div className="md:w-1/2 relative h-60">
              <Image
                src="/donate.jpg"
                alt="Donasi Pakaian"
                fill
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <FiGift className="text-primary text-xl" />
                </div>
                <h2 className="text-xl font-bold text-primary">
                  Panduan Donasi
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-primary mb-3">
                    Item yang Bisa Didonasikan:
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Pakaian layak pakai (tanpa lubang, robekan, atau noda)",
                      "Sepatu dalam kondisi baik",
                      "Aksesori fashion (topi, syal, dll)",
                      "Tas dan ransel",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                          <FiCheckCircle className="text-green-600 text-sm" />
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-primary mb-3">
                    Yang Tidak Diterima:
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Pakaian dengan kerusakan parah",
                      "Pakaian dalam bekas",
                      "Item yang sangat kotor",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                          <FiAlertTriangle className="text-red-600 text-sm" />
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-secondary/10 p-5 rounded-xl">
                  <div className="flex items-start">
                    <div className="h-7 w-7 rounded-full bg-secondary/20 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <FiInfo className="text-secondary text-sm" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-2">
                        Tahukah Anda?
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Setiap tahun, jutaan ton limbah tekstil berakhir di
                        tempat pembuangan sampah. Dengan donasi, Anda membantu
                        mengurangi dampak lingkungan dan memberikan manfaat
                        sosial.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
            >
              {!isSuccess ? (
                <>
                  <h2 className="text-2xl font-bold text-primary mb-6">
                    Formulir Donasi
                  </h2>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6 flex items-start">
                      <FiAlertTriangle className="mt-0.5 mr-2 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  <div className="flex items-center mb-10">
                    {[1, 2, 3].map((i) => (
                      <div key={`step-${i}`} className="flex items-center">
                        <div
                          className={`flex items-center justify-center h-10 w-10 rounded-full 
                            ${
                              step >= i
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-gray-400"
                            } 
                            font-medium transition-colors cursor-pointer z-10`}
                          onClick={() => i < step && setStep(i)}
                        >
                          {i}
                        </div>
                        {i < 3 && (
                          <div
                            className={`flex-1 h-1 mx-2 rounded-full transition-colors ${
                              step > i ? "bg-primary" : "bg-gray-200"
                            }`}
                          ></div>
                        )}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit}>
                    {step === 1 && (
                      <div>
                        <h3 className="text-xl font-semibold text-primary mb-6">
                          Informasi Personal
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nama Lengkap{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiUser className="text-gray-400" />
                              </div>
                              <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="pl-10 w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="Nama lengkap Anda"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiMail className="text-gray-400" />
                              </div>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="pl-10 w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="email@example.com"
                                required
                              />
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nomor Telepon{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiPhone className="text-gray-400" />
                              </div>
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="pl-10 w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="Contoh: 081234567890"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end mt-8">
                          <button
                            type="button"
                            className="btn-primary flex items-center"
                            onClick={nextStep}
                          >
                            Selanjutnya <FiChevronRight className="ml-2" />
                          </button>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div>
                        <h3 className="text-xl font-semibold text-primary mb-6">
                          Alamat Pengambilan
                        </h3>

                        <div className="space-y-6 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Alamat Lengkap{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                <FiHome className="text-gray-400 mt-0.5" />
                              </div>
                              <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="pl-10 w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                rows={3}
                                placeholder="Nama jalan, nomor rumah, RT/RW"
                                required
                              ></textarea>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kota <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <FiMapPin className="text-gray-400" />
                                </div>
                                <select
                                  name="city"
                                  value={formData.city}
                                  onChange={handleChange}
                                  className="pl-10 w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
                                  required
                                >
                                  <option value="">Pilih Kota</option>
                                  <option value="Gunung Kidul">
                                    Gunung Kidul
                                  </option>
                                  <option value="Kulon Progo">
                                    Kulon Progo
                                  </option>
                                  <option value="Sleman">Sleman</option>
                                  <option value="Bantul">Bantul</option>
                                  <option value="Kota Yogyakarta">
                                    Kota Yogyakarta
                                  </option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kode Pos <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="5 digit kode pos"
                                required
                              />
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="pickup"
                                name="pickup"
                                checked={formData.pickup as boolean}
                                onChange={handleChange}
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                              />
                              <label
                                htmlFor="pickup"
                                className="ml-2 text-gray-700"
                              >
                                Saya ingin pakaian diambil dari lokasi saya
                                (hanya tersedia untuk area tertentu)
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between mt-8">
                          <button
                            type="button"
                            className="btn-secondary flex items-center"
                            onClick={prevStep}
                          >
                            <FiChevronLeft className="mr-2" /> Kembali
                          </button>
                          <button
                            type="button"
                            className="btn-primary flex items-center"
                            onClick={nextStep}
                          >
                            Selanjutnya <FiChevronRight className="ml-2" />
                          </button>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div>
                        <h3 className="text-xl font-semibold text-primary mb-6">
                          Informasi Donasi
                        </h3>

                        <div className="space-y-6 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tipe Item <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiPackage className="text-gray-400" />
                              </div>
                              <select
                                name="itemType"
                                value={formData.itemType}
                                onChange={handleChange}
                                className="pl-10 w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
                                required
                              >
                                <option value="">Pilih Tipe Item</option>
                                <option value="Pakaian">Pakaian</option>
                                <option value="Sepatu">Sepatu</option>
                                <option value="Aksesori">Aksesori</option>
                                <option value="Tas">Tas</option>
                                <option value="Lainnya">Lainnya</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Deskripsi Item{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                <FiList className="text-gray-400 mt-0.5" />
                              </div>
                              <textarea
                                name="itemDescription"
                                value={formData.itemDescription}
                                onChange={handleChange}
                                className="pl-10 w-full py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                rows={3}
                                placeholder="Jelaskan jenis, warna, ukuran, dan kondisi item yang akan didonasikan"
                                required
                              ></textarea>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Jumlah Item{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              name="itemQuantity"
                              value={formData.itemQuantity}
                              onChange={handleChange}
                              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                              min="1"
                              placeholder="Jumlah item yang akan didonasikan"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Foto Item <span className="text-red-500">*</span>
                            </label>
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
                                        alt={`Donation image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                      />
                                      <button
                                        type="button"
                                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                                        onClick={() => removeImage(index)}
                                      >
                                        <FiX
                                          className="text-gray-700"
                                          size={16}
                                        />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="terms"
                                name="terms"
                                checked={formData.terms as boolean}
                                onChange={handleChange}
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                required
                              />
                              <label
                                htmlFor="terms"
                                className="ml-2 text-gray-700"
                              >
                                Saya menyatakan bahwa item yang didonasikan
                                adalah layak pakai dan memenuhi kriteria donasi{" "}
                                <span className="text-red-500">*</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between mt-8">
                          <button
                            type="button"
                            className="btn-secondary flex items-center"
                            onClick={prevStep}
                          >
                            <FiChevronLeft className="mr-2" /> Kembali
                          </button>
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
                                Kirim Donasi <FiChevronRight className="ml-2" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-6"
                >
                  <div className="flex justify-center mb-6">
                    <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                      <FiCheckCircle className="text-green-600 text-4xl" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-primary mb-4">
                    Terima Kasih Atas Donasi Anda!
                  </h2>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Formulir donasi Anda telah kami terima. Silakan hubungi
                    admin kami melalui WhatsApp untuk proses selanjutnya.
                  </p>
                  <a
                    href={`https://wa.me/6282143609712?text=${encodeURIComponent(
                      `📦 Hai Admin Sericlo, saya ${formData.fullName} ingin donasi:\n\nJenis: ${formData.itemType}\nDeskripsi: ${formData.itemDescription}\nJumlah: ${formData.itemQuantity}\nAlamat: ${formData.address}, ${formData.city}, ${formData.postalCode}\nTelepon: ${formData.phone}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center"
                  >
                    <span className="mr-2">📦</span> Kirim via WhatsApp
                  </a>
                  <div className="mt-6">
                    <Link
                      href="/"
                      className="text-primary hover:text-primary/80"
                    >
                      Kembali ke Beranda
                    </Link>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
