"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiStar, FiChevronLeft, FiChevronRight, FiUser } from "react-icons/fi";

const testimonials = [
  {
    id: 1,
    name: "Rina Setyaningrum",
    role: "Ibu Rumah Tangga",
    avatar: "/testi/1.png",
    content:
      "Sericlo benar-benar membantu aku mengurangi pakaian tak terpakai! Prosesnya mudah dan aku merasa lebih bertanggung jawab terhadap lingkungan",
    rating: 5,
    source: "Instagram",
  },
  {
    id: 2,
    name: "Kevin Santoso",
    role: "Mahasiswa",
    avatar: "/testi/2.png",
    content:
      "Marketplace Sericlo keren banget, aku berhasil jual jaket lamaku hanya dalam 2 hari. Pembelinya juga puas!",
    rating: 5,
    source: "Google Review",
  },
];

export default function UserTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay]);

  const prevTestimonial = () => {
    setAutoplay(false);
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setAutoplay(false);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Testimoni Pengguna
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Bergabunglah dengan ribuan pengguna yang telah membuat perbedaan
            dengan solusi fashion berkelanjutan Sericlo.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Main testimonial card */}
          <motion.div
            key={testimonials[activeIndex].id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8 md:p-10"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar section */}
              <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-3 border-4 border-primary/10">
                  {testimonials[activeIndex].avatar ? (
                    <Image
                      src={testimonials[activeIndex].avatar}
                      alt={testimonials[activeIndex].name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                      <FiUser className="text-primary text-2xl" />
                    </div>
                  )}
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`${
                        i < testimonials[activeIndex].rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  via {testimonials[activeIndex].source}
                </p>
              </div>

              <div className="flex-1">
                <blockquote className="text-lg md:text-xl text-gray-700 italic mb-6">
                  &ldquo;{testimonials[activeIndex].content}&rdquo;
                </blockquote>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-semibold text-primary">
                    {testimonials[activeIndex].name}
                  </p>
                  <p className="text-secondary text-sm">
                    {testimonials[activeIndex].role}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center mt-8 gap-2">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-white shadow-md text-primary hover:bg-primary hover:text-white transition-colors"
              aria-label="Previous testimonial"
            >
              <FiChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-1 mx-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setAutoplay(false);
                    setActiveIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeIndex === index
                      ? "bg-primary w-4"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-white shadow-md text-primary hover:bg-primary hover:text-white transition-colors"
              aria-label="Next testimonial"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto text-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-3xl font-bold text-primary mb-2">1000+</p>
            <p className="text-secondary">Active Users</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-3xl font-bold text-primary mb-2">430+</p>
            <p className="text-secondary">Items Recycled</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-3xl font-bold text-primary mb-2">200+</p>
            <p className="text-secondary">Preloved Items Sold</p>
          </div>
        </div>
      </div>
    </section>
  );
}
