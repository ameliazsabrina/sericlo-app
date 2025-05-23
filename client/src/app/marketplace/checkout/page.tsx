"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FiCreditCard, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://sericlo-6e15467e3310.herokuapp.com";
const MIDTRANS_CLIENT_KEY =
  process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "SET_YOUR_CLIENT_KEY_HERE";

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

interface Order {
  id: number;
  total: number;
  created_at: string;
  items: OrderItem[];
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

export default function CheckoutPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkoutStatus, setCheckoutStatus] = useState<null | {
    success: boolean;
    message: string;
  }>(null);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
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

  const fetchOrders = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_URL}/api/cart`, {
        withCredentials: true,
      });
      if (response.data && response.data.data) {
        setOrders(response.data.data);
      } else {
        setOrders([]);
        setError("Keranjang Anda kosong.");
      }
    } catch {
      setOrders([]);
      setError("Gagal memuat keranjang. Silakan login atau coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmTransaction = async (result: MidtransResult) => {
    try {
      await axios.post(
        `${API_URL}/api/checkout/confirm`,
        {
          orderId: result.order_id,
          transactionId: result.transaction_id,
          paymentType: result.payment_type,
          status: result.transaction_status,
          amount: result.gross_amount,
        },
        { withCredentials: true }
      );
    } catch {}
  };

  const handleCheckout = async () => {
    setCheckoutStatus(null);
    try {
      const response = await axios.post(
        `${API_URL}/api/checkout`,
        {},
        { withCredentials: true }
      );

      if (response.data && response.data.success) {
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
              fetchOrders();
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
                message: "Pembayaran gagal. Silakan coba lagi.",
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
      console.error(err);
      setCheckoutStatus({
        success: false,
        message: "Gagal checkout. Silakan coba lagi.",
      });
    }
  };

  const allItems = orders.flatMap((order) => order.items);
  const total = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <main className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-white to-primary/5">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary mb-8 flex items-center gap-2">
          <FiCreditCard /> Checkout
        </h1>

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

        {!isLoading && allItems.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-primary mb-2">
              Tidak Ada Item untuk Checkout
            </h3>
            <p className="text-secondary mb-6 max-w-md mx-auto">
              {error ||
                "Keranjang Anda kosong. Tambahkan produk ke keranjang untuk checkout."}
            </p>
            <Link href="/marketplace" className="btn-primary">
              Belanja Sekarang
            </Link>
          </div>
        )}

        {!isLoading && allItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-bold text-primary mb-4">
              Ringkasan Pesanan
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Produk</th>
                    <th className="py-2 px-4 text-left">Jumlah</th>
                    <th className="py-2 px-4 text-left">Harga</th>
                    <th className="py-2 px-4 text-left">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {allItems.map((item) => (
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
                      <td className="py-2 px-4 font-semibold">
                        Rp{(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-6">
              <div className="text-xl font-bold text-accent">
                Total: Rp{total.toLocaleString()}
              </div>
            </div>
            <div className="flex justify-end mt-8">
              <button
                className="btn-primary px-8 py-3 text-lg"
                onClick={handleCheckout}
              >
                Bayar Sekarang
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
