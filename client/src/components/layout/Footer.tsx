import Link from "next/link";
import { FiInstagram, FiTwitter, FiFacebook, FiLinkedin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer id="contact" className="bg-primary text-white">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-white font-bold text-xl">
              Sericlo
            </Link>
            <p className="mt-4 text-sm opacity-80">
              Platform eco-friendly untuk pengurangan limbah tekstil dengan
              solusi inovatif.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-white hover:text-accent">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-accent">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-accent">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-accent">
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="opacity-80 hover:opacity-100">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="opacity-80 hover:opacity-100">
                  About
                </Link>
              </li>
              <li>
                <Link href="/features" className="opacity-80 hover:opacity-100">
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace"
                  className="opacity-80 hover:opacity-100"
                >
                  Marketplace
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Our Features</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/features#recycling"
                  className="opacity-80 hover:opacity-100"
                >
                  Recycling Clothes
                </Link>
              </li>
              <li>
                <Link
                  href="/features#preloved"
                  className="opacity-80 hover:opacity-100"
                >
                  Preloved Marketplace
                </Link>
              </li>
              <li>
                <Link
                  href="/features#donations"
                  className="opacity-80 hover:opacity-100"
                >
                  Clothing Donations
                </Link>
              </li>
              <li>
                <Link
                  href="/features#redesign"
                  className="opacity-80 hover:opacity-100"
                >
                  AI-powered Redesign
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <p className="opacity-80 mb-2">
              Universitas Islam Indonesia
              <br />
              Jl. Kaliurang km 14.5, Sleman, Yogyakarta
            </p>
            <p className="opacity-80">sericlo@uii.ac.id</p>
            <p className="opacity-80">+62 821 4360 9712</p>
          </div>
        </div>

        <div className="border-t border-white border-opacity-20 mt-10 pt-6 text-sm opacity-80">
          <div className="flex flex-col md:flex-row items-center">
            <p>
              &copy; {new Date().getFullYear()} Sericlo. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
