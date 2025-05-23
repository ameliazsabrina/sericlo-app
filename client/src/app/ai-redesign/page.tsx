"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiUpload, FiSend, FiZap, FiFilter } from "react-icons/fi";
import axios from "axios";
import { createClient } from "@/utils/supabase/client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://sericlo-6e15467e3310.herokuapp.com";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

const categories = ["All", "Casual", "Formal", "Streetwear", "Vintage"];

interface Redesign {
  id: string;
  original_image: string;
  style: string;
  description: string;
  status: string;
  created_at: string;
  ideas: unknown[];
}

export default function AiRedesign() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [redesignPrompt, setRedesignPrompt] = useState("");
  const [style, setStyle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redesignHistory, setRedesignHistory] = useState<Redesign[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!uploadedImage || !style) {
      setError("Please upload an image and select a style");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const base64Data = uploadedImage.split(",")[1];
      const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(
        (res) => res.blob()
      );

      const formData = new FormData();
      formData.append("image", blob, "image.jpg");
      formData.append("style", style);
      if (redesignPrompt) {
        formData.append("description", redesignPrompt);
      }

      const response = await api.post("/api/ai/redesign", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      fetchRedesignHistory();

      window.location.href = `/ai-redesign/${response.data.data.id}`;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchRedesignHistory = async () => {
    try {
      const response = await api.get("/api/ai");
      setRedesignHistory(response.data.data);
    } catch (err) {
      console.error("Error fetching redesign history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchRedesignHistory();
  }, []);

  const filteredHistory =
    selectedCategory === "All"
      ? redesignHistory
      : redesignHistory.filter(
          (redesign) => redesign.style === selectedCategory
        );

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                AI-Powered Clothing Redesign
              </h1>
              <p className="text-lg text-secondary">
                Ubah pakaian lamamu menjadi karya fashion baru dengan alat
                desain ulang berbasis AI kami. Unggah foto pakaianmu dan temukan
                ide-ide desain kreatif lengkap dengan panduan langkah demi
                langkah.
              </p>
            </div>
            <div className="md:w-1/2 relative h-60">
              <Image
                src="/ai.jpg"
                alt="AI Redesign"
                fill
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8 mb-16">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Try Our AI Redesign Tool
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 h-80">
              {uploadedImage ? (
                <div className="relative w-full h-full">
                  <Image
                    src={uploadedImage}
                    alt="Uploaded garment"
                    fill
                    className="object-contain"
                  />
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="absolute top-2 right-2 bg-primary text-white p-2 rounded-full"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <FiUpload className="mx-auto text-gray-400 text-4xl mb-3" />
                  <p className="text-gray-500 mb-4">Unggah foto pakaianmu</p>
                  <label className="btn-primary cursor-pointer">
                    <span>Pilih Gambar</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="mb-4">
                <label className="text-primary font-medium mb-2 block">
                  Gaya:
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                >
                  <option value="">Pilih gaya</option>
                  {categories.slice(1).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <label className="text-primary font-medium mb-2">
                Prompt Redesain:
              </label>
              <textarea
                className="border border-gray-300 rounded-lg p-4 h-40 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Contoh: 'Saya ingin mengubah kaos lama ini menjadi cropped top dengan tambahan dekorasi' atau 'Saya butuh ide untuk mendaur ulang jeans ini menjadi sesuatu yang baru'"
                value={redesignPrompt}
                onChange={(e) => setRedesignPrompt(e.target.value)}
              ></textarea>

              {error && <p className="text-red-500 mb-4">{error}</p>}

              <button
                className="btn-primary flex items-center justify-center"
                disabled={!uploadedImage || !style || loading}
                onClick={handleSubmit}
              >
                {loading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                ) : (
                  <FiZap className="mr-2" />
                )}
                {loading ? "Membuat..." : "Buat Desain Baru dengan AI"}
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">
              Your Redesign History
            </h2>
            <div className="flex items-center gap-4">
              <FiFilter className="text-gray-500" />
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {historyLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 text-lg">
                Belum ada desain yang dibuat. Mulai dengan membuat desain Anda
                pertama kali!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHistory.map((redesign) => (
                <motion.div
                  key={redesign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={redesign.original_image}
                      alt={redesign.style}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/30 text-white text-xs px-3 py-1 rounded-full">
                        {redesign.style}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-black/30 text-white text-xs px-3 py-1 rounded-full">
                        {redesign.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <span>
                        {new Date(redesign.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-2">
                      {redesign.style} Redesign
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {redesign.description || "No description provided"}
                    </p>
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/ai-redesign/${redesign.id}`}
                        className="text-primary font-medium text-sm hover:underline"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 bg-secondary/10 rounded-2xl p-8 bg-gradient-to-br from-background to-secondary/10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-primary mb-6 text-center">
              Cara Kerja AI Redesign Kami
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="rounded-full bg-primary/20 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FiUpload className="text-primary text-2xl" />
                </div>
                <h3 className="font-bold text-primary mb-2">Upload</h3>
                <p className="text-gray-600">
                  Ambil foto pakaian yang ingin kamu desain ulang dan unggah ke
                  platform kami.
                </p>
              </div>

              <div className="text-center">
                <div className="rounded-full bg-primary/20 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FiZap className="text-primary text-2xl" />
                </div>
                <h3 className="font-bold text-primary mb-2">Generate</h3>
                <p className="text-gray-600">
                  AI kami akan menganalisis pakaianmu dan menghasilkan berbagai
                  konsep desain ulang berdasarkan tren terkini.
                </p>
              </div>

              <div className="text-center">
                <div className="rounded-full bg-primary/20 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FiSend className="text-primary text-2xl" />
                </div>
                <h3 className="font-bold text-primary mb-2">Create</h3>
                <p className="text-gray-600">
                  Dapatkan panduan lengkap dan pola untuk mengubah pakaianmu
                  menjadi sesuatu yang baru.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
