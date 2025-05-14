"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const categories = ["All", "Sustainability", "Fashion", "Recycling", "DIY"];

const articles = [
  {
    id: 1,
    title: "Fast Fashion dan Dampaknya",
    excerpt:
      "Eksplorasi bagaimana siklus produksi cepat dari fast fashion berdampak pada degradasi lingkungan dan apa yang bisa kita lakukan tentangnya.",
    image: "/education/1.jpg",
    category: "Sustainability",
    readTime: "5 min read",
    date: "May 15, 2023",
    author: "Anisa Wijaya",
  },
  {
    id: 2,
    title: "5 Cara Mengubah Pakaian Lama Menjadi Baru di Rumah",
    excerpt:
      "Belajar teknik kreatif untuk mengubah pakaian lama menjadi baru, bermanfaat tanpa keterampilan menjahit yang maju.",
    image: "/education/2.jpg",
    category: "DIY",
    readTime: "8 min read",
    date: "June 3, 2023",
    author: "Budi Santoso",
  },
];

export default function Education() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredArticles =
    selectedCategory === "All"
      ? articles
      : articles.filter((article) => article.category === selectedCategory);

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Education Resources
              </h1>
              <p className="text-lg text-secondary">
                Perluas pengetahuanmu tentang fashion berkelanjutan, daur ulang
                tekstil, dan cara membuat pilihan yang ramah lingkungan. Sumber
                belajar kami dirancang untuk menginspirasi dan memberdayakanmu
                dalam perjalanan menuju keberlan
              </p>
            </div>
            <div className="md:w-1/2 relative h-60">
              <Image
                src="/education.jpg"
                alt="Education"
                fill
                className="object-cover rounded-2xl "
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary/80 text-white text-xs px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <span>{article.date}</span>
                  <span className="mx-2">•</span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    By {article.author}
                  </span>
                  <Link
                    href={`/education/${article.id}`}
                    className="text-primary font-medium text-sm hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
