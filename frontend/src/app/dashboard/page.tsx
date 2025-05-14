"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FiUser, FiLogOut, FiShoppingCart } from "react-icons/fi";
import { createClient } from "@/utils/supabase/client";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();

        if (!data) {
          router.push("/register");
          return;
        }

        const userData = data.session?.user;
        setUser({
          id: userData?.id || "",
          name:
            userData?.user_metadata?.name ||
            userData?.email?.split("@")[0] ||
            "User",
          email: userData?.email || "",
          avatar: userData?.user_metadata?.avatar_url || "/default-avatar.png",
        });
      } catch (err) {
        console.error("Authentication error:", err);
        router.push("/register");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        router.push("/register");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-right mr-4">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <div className="h-10 w-10 rounded-full overflow-hidden">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-lg shadow col-span-1"
          >
            <nav className="space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center px-4 py-3 text-primary bg-primary/10 rounded-lg group"
              >
                <FiUser className="mr-3" />
                <span>Profil Saya</span>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center px-4 py-3 text-primary bg-primary/10 rounded-lg group"
              >
                <FiShoppingCart className="mr-3" />
                <span>Pesanan Saya</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg group"
              >
                <FiLogOut className="mr-3" />
                <span>Keluar</span>
              </button>
            </nav>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow col-span-1 lg:col-span-3"
          >
            <h2 className="text-xl font-bold text-primary mb-6">Profil Saya</h2>

            {user && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="h-24 w-24 rounded-full overflow-hidden">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{user.name}</h3>
                    <p className="text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h4 className="font-medium text-primary mb-2">
                      Aktivitas Terakhir
                    </h4>
                    <p className="text-gray-500 text-sm">Belum ada aktivitas</p>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-lg">
                    <h4 className="font-medium text-primary mb-2">Statistik</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-500 text-sm">Produk Dijual</p>
                        <p className="font-bold text-primary">0</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Donasi</p>
                        <p className="font-bold text-primary">0</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
