"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FiFilter,
  FiGrid,
  FiList,
  FiSearch,
  FiShoppingBag,
  FiPlus,
  FiMapPin,
  FiUser,
  FiTag,
} from "react-icons/fi";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://sericlo-6e15467e3310.herokuapp.com";

interface Product {
  id: number;
  name: string;
  price: number;
  condition: string;
  size: string;
  type: string;
  description: string;
  material?: string;
  brand?: string;
  image: string;
  seller: string;
  location: string;
  createdAt: string;
  updatedAt?: string;
}

const types = ["Semua", "Kemeja", "Kaos", "Celana", "Dress", "Jaket", "Rok"];
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const conditions = ["Seperti Baru", "Sangat Baik", "Baik", "Cukup Baik"];

export default function MarketplacePage() {
  const [view, setView] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("Semua");
  const [filters, setFilters] = useState({
    size: "",
    condition: "",
    minPrice: "",
    maxPrice: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(`${API_URL}/api/products`, {
        withCredentials: true,
      });

      if (response.data && response.data.data) {
        setProducts(response.data.data || []);
        setError("");
      } else {
        setProducts([]);
        setError(
          "Belum ada produk tersedia. Jadilah yang pertama menjual di marketplace kami!"
        );
      }
    } catch (err) {
      console.error(err);
      setProducts([]);
      setError("Gagal memuat produk. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchProducts();
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(
        `${API_URL}/api/products/search/${searchTerm}`,
        {
          withCredentials: true,
        }
      );

      setProducts(response.data.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Gagal mencari produk. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        `${API_URL}/api/products/filter`,
        {
          type: selectedType !== "Semua" ? selectedType : "",
          ...filters,
        },
        {
          withCredentials: true,
        }
      );

      setProducts(response.data.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Gagal memfilter produk. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    if (
      searchTerm &&
      !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !product.type.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    if (selectedType !== "Semua" && product.type !== selectedType) {
      return false;
    }

    if (filters.size && product.size !== filters.size) {
      return false;
    }

    if (filters.condition && product.condition !== filters.condition) {
      return false;
    }

    if (filters.minPrice && product.price < parseInt(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && product.price > parseInt(filters.maxPrice)) {
      return false;
    }

    return true;
  });

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setSelectedType("Semua");
    setFilters({
      size: "",
      condition: "",
      minPrice: "",
      maxPrice: "",
    });
    setSearchTerm("");
    fetchProducts();
  };

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Marketplace Preloved
              </h1>
              <p className="text-lg text-secondary">
                Temukan fashion preloved berkualitas dengan harga terjangkau
                sambil berkontribusi pada gerakan fashion berkelanjutan.
              </p>

              <div className="mt-6 relative">
                <input
                  type="text"
                  placeholder="Cari pakaian preloved..."
                  className="w-full py-3 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                >
                  <FiSearch />
                </button>
              </div>
            </div>
            <div className="md:w-1/2 relative h-60">
              <Image
                src="/marketplace.jpg"
                alt="Marketplace"
                fill
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between mb-8">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-primary mr-4">
              {filteredProducts.length} Produk Ditemukan
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-primary px-3 py-2 rounded-md bg-primary/10 hover:bg-primary/20"
            >
              <FiFilter className="mr-1" />
              {showFilters ? "Sembunyikan Filter" : "Tampilkan Filter"}
            </button>
          </div>

          <div className="flex items-center mt-4 sm:mt-0">
            <Link href="/sell" className="btn-primary flex items-center mr-4">
              <FiPlus className="mr-2" /> Jual Barang
            </Link>
            <div className="flex items-center bg-white border rounded-md">
              <button
                className={`p-2 ${
                  view === "grid" ? "text-primary" : "text-gray-400"
                }`}
                onClick={() => setView("grid")}
              >
                <FiGrid />
              </button>
              <button
                className={`p-2 ${
                  view === "list" ? "text-primary" : "text-gray-400"
                }`}
                onClick={() => setView("list")}
              >
                <FiList />
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-primary">Filter Lanjutan</h3>
              <button
                className="text-secondary text-sm hover:text-primary"
                onClick={resetFilters}
              >
                Reset Filter
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Ukuran
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={filters.size}
                  onChange={(e) => handleFilterChange("size", e.target.value)}
                >
                  <option value="">Semua Ukuran</option>
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Kondisi
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={filters.condition}
                  onChange={(e) =>
                    handleFilterChange("condition", e.target.value)
                  }
                >
                  <option value="">Semua Kondisi</option>
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Harga Minimum (Rp)
                </label>
                <input
                  type="number"
                  placeholder="Harga minimum"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Harga Maksimum (Rp)
                </label>
                <input
                  type="number"
                  placeholder="Harga maksimum"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={handleFilter} className="btn-primary">
                Terapkan Filter
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-8">
          {types.map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedType === type
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={product.image || "/images/sustainable-fashion.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-black/80 text-white text-xs px-3 py-1 rounded-full">
                      {product.type}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-black/40 text-white text-xs px-3 py-1 rounded-full">
                      {product.condition}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <span>{product.size}</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">
                    {product.name}
                  </h3>
                  <p className="text-xl font-semibold text-accent mb-4">
                    Rp{product.price.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiUser className="mr-1" />
                      <span className="mr-3">{product.seller}</span>
                      <FiMapPin className="mr-1" />
                      <span>{product.location}</span>
                    </div>
                    <Link
                      href={`/marketplace/${product.id}`}
                      className="text-primary font-medium text-sm hover:underline"
                    >
                      Lihat Detail →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative h-48 md:h-auto md:w-48 flex-shrink-0">
                    <Image
                      src={product.image || "/images/sustainable-fashion.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary/80 text-white text-xs px-3 py-1 rounded-full">
                        {product.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-grow">
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-primary mb-2">
                          {product.name}
                        </h3>
                        <p className="text-xl font-semibold text-accent mb-3">
                          Rp{product.price.toLocaleString()}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center">
                            <FiTag className="mr-1" /> {product.size}
                          </span>
                          <span className="flex items-center">
                            Kondisi: {product.condition}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-start md:items-end justify-between mt-4 md:mt-0">
                        <div className="text-sm text-gray-500">
                          <div className="flex items-center mb-1">
                            <FiUser className="mr-1" />
                            <span>{product.seller}</span>
                          </div>
                          <div className="flex items-center">
                            <FiMapPin className="mr-1" />
                            <span>{product.location}</span>
                          </div>
                        </div>
                        <Link
                          href={`/marketplace/${product.id}`}
                          className="btn-primary mt-4"
                        >
                          Lihat Detail
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {(filteredProducts.length === 0 || error) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-lg shadow-md"
          >
            <div className="text-primary mb-4">
              <FiShoppingBag size={60} className="mx-auto opacity-30" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">
              {error || "Tidak Ada Produk Ditemukan"}
            </h3>
            <p className="text-secondary mb-6 max-w-md mx-auto">
              {error
                ? "Silahkan coba lagi nanti atau tambahkan produk Anda sendiri."
                : "Tidak ada produk yang sesuai dengan filter yang Anda pilih. Coba ubah filter atau reset filter."}
            </p>
            {!error && (
              <button className="btn-primary" onClick={resetFilters}>
                Reset Filter
              </button>
            )}
            <Link href="/sell" className="btn-primary ml-4">
              Jual Produk
            </Link>
          </motion.div>
        )}

        <div className="mt-16 bg-secondary/10 rounded-2xl p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Punya Pakaian yang Tidak Terpakai?
            </h2>
            <p className="text-gray-600 mb-6">
              Jual pakaian bekas Anda di marketplace kami dan berkontribusi pada
              gerakan fashion berkelanjutan. Dapatkan tambahan penghasilan
              sekaligus membantu lingkungan.
            </p>
            <Link
              href="/sell"
              className="btn-primary inline-flex items-center px-8 py-3"
            >
              <FiPlus className="mr-2" /> Jual Pakaian Sekarang
            </Link>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center my-12">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </main>
  );
}
