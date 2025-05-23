"use client";

import Link from "next/link";
import { FiRefreshCw, FiShoppingBag, FiGift, FiTool } from "react-icons/fi";
import { motion } from "framer-motion";

const features = [
  {
    id: "recycling",
    icon: <FiRefreshCw size={32} />,
    title: "Recycling Clothes",
    description:
      "Ubah pakaian lama menjadi material baru untuk fashion berkelanjutan.",
    link: "/features#recycling",
  },
  {
    id: "preloved",
    icon: <FiShoppingBag size={32} />,
    title: "Preloved Marketplace",
    description:
      "Jual dan beli pakaian bekas berkualitas untuk mengurangi limbah tekstil.",
    link: "/features#preloved",
  },
  {
    id: "donations",
    icon: <FiGift size={32} />,
    title: "Clothing Donations",
    description:
      "Donasikan pakaian yang tidak terpakai kepada yang membutuhkan.",
    link: "/features#donations",
  },
  {
    id: "redesign",
    icon: <FiTool size={32} />,
    title: "AI-powered Redesign",
    description:
      "Gunakan AI untuk mendesain ulang pakaian lama menjadi fashion baru.",
    link: "/features#redesign",
  },
];

export default function FeaturesOverview() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="section bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Fitur Utama Kami
          </h2>
          <p className="text-primary max-w-2xl mx-auto">
            Solusi komprehensif untuk mengurangi limbah tekstil dan mendukung
            industri fashion berkelanjutan.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              className="relative bg-gradient-to-br from-white to-gray-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow transform hover:scale-105"
            >
              <div className="flex justify-center items-center w-16 h-16 rounded-full bg-primary text-white mb-4 mx-auto hover:animate-spin-slow">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-primary text-center mb-3">
                {feature.title}
              </h3>
              <p className="text-secondary text-center mb-6">
                {feature.description}
              </p>
              <Link
                href={feature.link}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-primary font-medium flex items-center hover:text-secondary transition-colors"
              >
                Explore more
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
