"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FiPackage, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

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
  order_id: string;
  total: number;
  created_at: string;
  status: string;
  payment_type: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.get("/api/orders");
      if (response.data && response.data.data) {
        setOrders(response.data.data);
      } else {
        setOrders([]);
        setError("Belum ada pesanan.");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
      setError("Gagal memuat pesanan. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
      case "settlement":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "failed":
      case "expire":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
      case "settlement":
        return <FiCheckCircle className="text-green-600" />;
      case "pending":
        return <FiClock className="text-yellow-600" />;
      case "failed":
      case "expire":
        return <FiXCircle className="text-red-600" />;
      default:
        return <FiPackage className="text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-white to-primary/5">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary mb-8">
          Riwayat Pesanan
        </h1>

        {isLoading && (
          <div className="flex justify-center my-12">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}

        {!isLoading && orders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-primary mb-4">
              <FiPackage size={60} className="mx-auto opacity-30" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">
              Belum Ada Pesanan
            </h3>
            <p className="text-secondary mb-6 max-w-md mx-auto">
              {error || "Anda belum memiliki pesanan."}
            </p>
          </div>
        )}

        {!isLoading && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-primary">
                        Order #{order.order_id}
                      </h2>
                      <p className="text-gray-500 text-sm">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-2 px-4 text-left">Produk</th>
                          <th className="py-2 px-4 text-left">Jumlah</th>
                          <th className="py-2 px-4 text-left">Harga</th>
                          <th className="py-2 px-4 text-left">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="py-2 px-4 flex items-center gap-3">
                              <Image
                                src={
                                  item.image ||
                                  "/images/sustainable-fashion.svg"
                                }
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded"
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

                  <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="text-sm text-gray-500">
                      Metode Pembayaran: {order.payment_type}
                    </div>
                    <div className="text-xl font-bold text-accent">
                      Total: Rp{order.total.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
