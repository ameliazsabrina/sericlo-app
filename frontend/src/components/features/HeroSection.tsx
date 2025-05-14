"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HeroSection() {
  return (
    <section className="relative pt-16 md:pt-24 pb-20 overflow-hidden bg-gradient-to-br from-background to-secondary/10">
      <div className="absolute top-0 right-0 w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-accent rounded-full opacity-20 blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[150px] h-[150px] md:w-[250px] md:h-[250px] bg-primary rounded-full opacity-10 blur-2xl -z-10"></div>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-lg"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Kelola Limbah Tekstil Secara Bijak dan Inovatif.
            </h1>
            <p className="text-lg md:text-xl text-secondary mb-8 leading-relaxed">
              Bersama Sericlo, ciptakan masa depan fashion yang berkelanjutan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/sell"
                className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-secondary transition-all shadow-lg hover:shadow-xl text-center"
              >
                Mulai Sekarang
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative h-[400px] md:h-[500px]"
          >
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              className="w-full h-full rounded-2xl shadow-xl overflow-hidden"
            >
              <SwiperSlide className="relative w-full h-full">
                <Image
                  src="/slider/1.jpg"
                  alt="Sustainable Fashion"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                  <h3 className="text-xl font-bold">Sustainable Fashion</h3>
                  <p className="text-sm">
                    Berkomitmen pada praktik ramah lingkungan
                  </p>
                </div>
              </SwiperSlide>
              <SwiperSlide className="relative w-full h-full">
                <Image
                  src="/slider/2.jpg"
                  alt="Recycled Materials"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                  <h3 className="text-xl font-bold">Recycled Materials</h3>
                  <p className="text-sm">
                    Mengembalikan kehidupan kepada tekstil
                  </p>
                </div>
              </SwiperSlide>
              <SwiperSlide className="relative w-full h-full">
                <Image
                  src="/slider/3.jpg"
                  alt="Fashion Forward"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                  <h3 className="text-xl font-bold">Fashion Forward</h3>
                  <p className="text-sm">
                    Style yang tidak menghilangkan planet
                  </p>
                </div>
              </SwiperSlide>
            </Swiper>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
