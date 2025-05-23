"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (event === "SIGNED_IN" && session) {
          router.replace("/marketplace");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleGoogle = async () => {
    if (isAuthenticating) return;

    setIsAuthenticating(true);
    setError("");

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
          redirectTo: `${window.location.origin}/marketplace`,
        },
      });

      if (error) throw error;

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      setError(
        "Failed to connect to authentication service. Please try again later."
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (loading) {
    return (
      <main className="pt-40 pb-8 min-h-screen bg-gradient-to-b from-white to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden p-8 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-40 pb-8 min-h-screen bg-gradient-to-b from-white to-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <Link href="/" className="inline-block mb-6">
                <Image src="/logo.png" alt="Sericlo" width={50} height={50} />
              </Link>
              <h1 className="text-2xl font-bold text-primary mb-2">
                Daftar Akun Baru
              </h1>
              <p className="text-secondary">
                Bergabunglah dengan komunitas sustainable fashion
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGoogle}
              disabled={isAuthenticating}
            >
              {isAuthenticating ? (
                <span className="animate-spin mr-2">⟳</span>
              ) : (
                <FaGoogle className="text-primary" />
              )}
              {isAuthenticating
                ? "Menghubungkan..."
                : "Lanjutkan dengan Google"}
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
