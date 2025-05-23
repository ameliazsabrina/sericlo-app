"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiShoppingBag,
  FiMapPin,
  FiUser,
  FiClock,
  FiInfo,
  FiChevronRight,
  FiAlertCircle,
} from "react-icons/fi";
import axios from "axios";
import { createClient } from "@/utils/supabase/client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://sericlo-6e15467e3310.herokuapp.com";

interface Product {
  id: string;
  name: string;
  price: number;
  condition: string;
  size: string;
  type: string;
  description: string;
  material?: string;
  brand?: string;
  image: string;
  seller_name: string;
  location: string;
  created_at: Date;
  updated_at?: Date;
}

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [purchaseStatus, setPurchaseStatus] = useState<{
    loading: boolean;
    success: boolean;
    message: string;
  }>({
    loading: false,
    success: false,
    message: "",
  });

  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      try {
        const productId = params.id;
        const response = await axios.get(
          `${API_URL}/api/products/${productId}`,
          {
            withCredentials: true,
          }
        );
        setProduct(response.data.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [params.id]);

  const handleBuyProduct = async () => {
    setPurchaseStatus({
      loading: true,
      success: false,
      message: "",
    });

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setPurchaseStatus({
          loading: false,
          success: false,
          message: "Silakan login terlebih dahulu",
        });
        return;
      }

      const cartResponse = await axios.get(`${API_URL}/api/cart`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const existingCartItem = cartResponse.data.data.find(
        (item: CartItem) => item.product_id === product?.id
      );

      if (existingCartItem) {
        setPurchaseStatus({
          loading: false,
          success: false,
          message: "Anda sudah menambahkan produk ini ke keranjang",
        });
        setTimeout(() => {
          router.push("/marketplace/cart");
        }, 2000);
        return;
      }

      await axios.post(
        `${API_URL}/api/cart/add`,
        {
          product_id: product?.id,
          quantity: 1,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      setPurchaseStatus({
        loading: false,
        success: true,
        message: "Produk berhasil ditambahkan ke keranjang",
      });

      setTimeout(() => {
        router.push("/marketplace/cart");
      }, 2000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Gagal melakukan pembelian. Silakan coba lagi.";
      setPurchaseStatus({
        loading: false,
        success: false,
        message: errorMessage,
      });
    }
  };

  if (isLoading) {
    return (
      <main className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-white to-primary/5">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-4">Memuat produk...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-white to-primary/5">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <FiInfo className="text-red-500 text-4xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-primary mb-2">
              Produk Tidak Ditemukan
            </h1>
            <p className="text-gray-600 mb-6">
              Maaf, produk yang Anda cari tidak tersedia.
            </p>
            <Link
              href="/marketplace"
              className="btn-primary inline-flex items-center"
            >
              <FiArrowLeft className="mr-2" /> Kembali ke Marketplace
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-white to-primary/5">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center text-sm">
            <Link
              href="/marketplace"
              className="text-gray-500 hover:text-primary"
            >
              Marketplace
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-primary font-medium">{product.name}</span>
          </nav>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6 flex items-start">
            <FiAlertCircle className="mt-0.5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {purchaseStatus.message && (
          <div
            className={`border p-4 rounded-lg mb-6 flex items-start ${
              purchaseStatus.success
                ? "bg-green-50 border-green-200 text-green-600"
                : "bg-red-50 border-red-200 text-red-600"
            }`}
          >
            {purchaseStatus.success ? (
              <FiChevronRight className="mt-0.5 mr-2 flex-shrink-0" />
            ) : (
              <FiAlertCircle className="mt-0.5 mr-2 flex-shrink-0" />
            )}
            <span>{purchaseStatus.message}</span>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="relative aspect-square rounded-xl overflow-hidden mb-4 border border-gray-100">
                  <Image
                    src={product.image || "/images/sustainable-fashion.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                      {product.name}
                    </h1>
                    <p className="text-2xl font-bold text-accent mb-4">
                      Rp{product.price.toLocaleString()}
                    </p>
                  </div>
                  <span className="bg-primary/10 text-primary text-sm py-1 px-3 rounded-full">
                    {product.condition}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-700">
                        <FiUser className="text-primary mr-2" />
                        <span className="font-medium">
                          {product.seller_name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiMapPin className="mr-2" />
                      <span>{product.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiClock className="mr-2" />
                      <span>
                        Diposting pada{" "}
                        {product.created_at
                          ? new Date(product.created_at).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-primary mb-2">
                      Deskripsi
                    </h2>
                    <p className="text-gray-700">{product.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Ukuran
                      </h3>
                      <p className="text-gray-800">{product.size}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Tipe
                      </h3>
                      <p className="text-gray-800">{product.type}</p>
                    </div>
                    {product.material && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Material
                        </h3>
                        <p className="text-gray-800">{product.material}</p>
                      </div>
                    )}
                    {product.brand && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Brand
                        </h3>
                        <p className="text-gray-800">{product.brand}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    className={`btn-primary flex-1 flex items-center justify-center ${
                      purchaseStatus.loading
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={handleBuyProduct}
                    disabled={purchaseStatus.loading || purchaseStatus.success}
                  >
                    {purchaseStatus.loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Memproses...
                      </>
                    ) : (
                      <>
                        <FiShoppingBag className="mr-2" /> Beli Sekarang
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/marketplace"
              className="inline-flex items-center text-primary hover:underline font-medium"
            >
              <FiArrowLeft className="mr-2" />
              Kembali ke Marketplace
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
