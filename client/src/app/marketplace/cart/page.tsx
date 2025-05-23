"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  FiShoppingBag,
  FiCheckCircle,
  FiXCircle,
  FiTrash,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://sericlo-6e15467e3310.herokuapp.com";
const MIDTRANS_CLIENT_KEY =
  process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "SET_YOUR_CLIENT_KEY_HERE";

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

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
  created_at: string;
}

interface MidtransResult {
  transaction_id: string;
  order_id: string;
  payment_type: string;
  transaction_status: string;
  transaction_time: string;
  status_code: string;
  gross_amount: string;
}

declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options: {
          onSuccess: (result: MidtransResult) => void;
          onPending: (result: MidtransResult) => void;
          onError: (result: MidtransResult) => void;
          onClose: () => void;
        }
      ) => void;
    };
  }
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkoutStatus, setCheckoutStatus] = useState<null | {
    success: boolean;
    message: string;
  }>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCart();
    const script = document.createElement("script");
    script.src = "https://app.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "SET_YOUR_CLIENT_KEY_HERE"
    );
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchCart = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.get("/api/cart");
      if (response.data && response.data.data) {
        setCartItems(response.data.data);
      } else {
        setCartItems([]);
        setError("Keranjang Anda kosong.");
      }
    } catch (err) {
      console.error(err);
      setCartItems([]);
      setError("Gagal memuat keranjang. Silakan login atau coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCartItem = async (id: string) => {
    try {
      await api.delete(`/api/cart/${id}`);
      fetchCart();
    } catch {}
  };

  const confirmTransaction = async (result: MidtransResult) => {
    try {
      await api.post("/api/checkout/confirm", {
        orderId: result.order_id,
        transactionId: result.transaction_id,
        paymentType: result.payment_type,
        status: result.transaction_status,
        amount: result.gross_amount,
      });
    } catch (err) {
      console.error("Failed to confirm transaction:", err);
    }
  };

  const handleCheckout = async () => {
    setCheckoutStatus(null);
    try {
      const response = await api.post("/api/checkout");

      if (response.data.success) {
        const transactionToken = response.data.token;

        if (typeof window.snap !== "undefined") {
          window.snap.pay(transactionToken, {
            onSuccess: async function (result: MidtransResult) {
              console.log("onSuccess", result);
              await confirmTransaction(result);
              setCheckoutStatus({
                success: true,
                message: "Pembayaran berhasil!",
              });
              fetchCart();
              setTimeout(() => router.push("/dashboard"), 2000);
            },
            onPending: async function (result: MidtransResult) {
              await confirmTransaction(result);
              setCheckoutStatus({
                success: false,
                message: "Menunggu pembayaran...",
              });
            },
            onError: async function (result: MidtransResult) {
              await confirmTransaction(result);
              setCheckoutStatus({
                success: false,
                message: "Pembayaran gagal.",
              });
            },
            onClose: function () {
              setCheckoutStatus({
                success: false,
                message: "Anda menutup popup tanpa menyelesaikan pembayaran.",
              });
            },
          });
        } else {
          setCheckoutStatus({
            success: false,
            message: "Gagal memuat Midtrans. Silakan coba lagi.",
          });
        }
      } else {
        setCheckoutStatus({
          success: false,
          message: response.data.error || "Gagal checkout.",
        });
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setCheckoutStatus({
        success: false,
        message: "Gagal checkout. Silakan coba lagi.",
      });
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-white to-primary/5">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary mb-8">Keranjang Saya</h1>

        {isLoading && (
          <div className="flex justify-center my-12">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}

        {checkoutStatus && (
          <div
            className={`mb-6 flex items-center gap-2 p-4 rounded-lg shadow text-lg font-medium ${
              checkoutStatus.success
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {checkoutStatus.success ? <FiCheckCircle /> : <FiXCircle />}
            {checkoutStatus.message}
          </div>
        )}

        {!isLoading && cartItems.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-primary mb-4">
              <FiShoppingBag size={60} className="mx-auto opacity-30" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">
              Keranjang Kosong
            </h3>
            <p className="text-secondary mb-6 max-w-md mx-auto">
              {error || "Belum ada pesanan di keranjang Anda."}
            </p>
            <Link href="/marketplace" className="btn-primary">
              Belanja Sekarang
            </Link>
          </div>
        )}

        {!isLoading && cartItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-primary mb-2">
                  Keranjang Belanja
                </h2>
                <p className="text-gray-500 text-sm">{cartItems.length} item</p>
              </div>
              <div className="text-xl font-semibold text-accent mt-2 md:mt-0">
                Total: Rp{total.toLocaleString()}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Produk</th>
                    <th className="py-2 px-4 text-left">Jumlah</th>
                    <th className="py-2 px-4 text-left">Harga</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2 px-4 flex items-center gap-3">
                        <Image
                          src={item.image || "/images/sustainable-fashion.svg"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                          width={48}
                          height={48}
                        />
                        <span>{item.name}</span>
                      </td>
                      <td className="py-2 px-4">{item.quantity}</td>
                      <td className="py-2 px-4">
                        Rp{item.price.toLocaleString()}
                      </td>

                      <td className="py-2 px-4">
                        <button
                          onClick={() => handleDeleteCartItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                className="btn-primary px-8 py-3 text-lg"
                onClick={handleCheckout}
                disabled={
                  isLoading || checkoutStatus?.message.includes("Pembayaran")
                }
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                ) : (
                  "Bayar Sekarang"
                )}
              </button>
            </div>
          </div>
        )}

        {checkoutStatus && (
          <div
            className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50`}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3
                className={`text-xl font-bold mb-4 ${
                  checkoutStatus.success ? "text-green-600" : "text-red-600"
                }`}
              >
                {checkoutStatus.message}
              </h3>
              <button
                className="w-full py-2 bg-primary text-white rounded-md hover:bg-secondary transition"
                onClick={() => setCheckoutStatus(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
