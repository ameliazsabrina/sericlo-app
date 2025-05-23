"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Link from "next/link";
import { FaClock, FaCalendar, FaUser, FaArrowLeft } from "react-icons/fa";

const articles = [
  {
    id: "1",
    title: "The Impact of Fast Fashion on Our Environment",
    excerpt:
      "Fast fashion has revolutionized the way we consume clothing, but at what cost to our planet?",
    image: "/education/1.jpg",
    category: "Sustainability",
    readTime: "5 min",
    date: "May 15, 2023",
    author: "Najwa Aulia",
    content: `
   
  <p>Fast fashion telah mengubah industri pakaian, menawarkan tren terbaru dengan harga terjangkau dan produksi yang sangat cepat. Namun, kenyamanan ini membawa dampak besar terhadap lingkungan.</p>

  <h2>Dampak Lingkungan</h2>
  <p>Industri fashion adalah salah satu penyumbang polusi terbesar di dunia, bertanggung jawab atas <strong>10% emisi karbon</strong> setiap tahunnya. Pakaian dari fast fashion sering hanya dipakai beberapa kali sebelum dibuang, sehingga menambah jumlah sampah tekstil di tempat pembuangan akhir.</p>

  <p>Pencemaran air juga menjadi masalah besar. Pewarnaan tekstil adalah penyebab kedua terbesar pencemaran air bersih di dunia. Selama proses produksi dan pencucian, <strong>bahan kimia</strong> dan <strong>mikroplastik</strong> dilepaskan ke dalam aliran air.</p>

  <h2>Konsumsi Sumber Daya</h2>
  <p>Fast fashion membutuhkan sumber daya yang sangat besar. Untuk membuat satu kaos katun saja, dibutuhkan sekitar <strong>2.700 liter air</strong>—cukup untuk kebutuhan minum satu orang selama 2,5 tahun. Bahan sintetis seperti poliester berasal dari bahan bakar fosil dan melepaskan mikroplastik setiap kali dicuci.</p>

  <h2>Dampak Sosial</h2>
  <p>Selain dampak terhadap lingkungan, fast fashion juga sering melibatkan praktik kerja yang tidak adil di negara berkembang. Para pekerja kerap menghadapi <strong>kondisi kerja yang tidak aman</strong>, <strong>upah rendah</strong>, dan <strong>jam kerja yang panjang</strong> demi memenuhi target produksi yang ketat.</p>

  <h2>Alternatif yang Lebih Berkelanjutan</h2>
  <p>Kita bisa membuat pilihan yang lebih ramah lingkungan dengan:</p>
  <ul>
    <li>Membeli lebih sedikit pakaian, tetapi yang berkualitas tinggi dan tahan lama</li>
    <li>Mendukung merek yang berkomitmen pada praktik etis dan berkelanjutan</li>
    <li>Berbelanja pakaian bekas di toko thrift atau platform online</li>
    <li>Menyewa pakaian untuk acara-acara khusus daripada membeli baru</li>
    <li>Merawat pakaian dengan baik agar lebih awet</li>
  </ul>

  <p>Dengan membuat pilihan yang lebih sadar dalam konsumsi pakaian, kita bisa membantu mengurangi dampak negatif industri fashion terhadap lingkungan dan mendukung praktik yang lebih berkelanjutan di masa depan.</p>
</section>
    `,
  },
  {
    id: "2",
    title: "5 Cara Mengubah Pakaian Lama Menjadi Baru di Rumah",
    excerpt:
      "Learn how to breathe new life into your old wardrobe with these creative upcycling techniques.",
    image: "/education/2.jpg",
    category: "DIY",
    readTime: "7 min",
    date: "June 3, 2023",
    author: "Michael Chang",
    content: `
   <p>Upcycling adalah proses mengubah pakaian lama menjadi produk baru yang bermanfaat, memperpanjang umur pakaiannya dan mengurangi limbah. Proses kreatif ini tidak hanya baik untuk lingkungan, tetapi juga memungkinkan ekspresi pribadi lewat fashion.</p>

  <h2>Memulai Upcycling</h2>
  <p>Sebelum membuang pakaian lama, pikirkan potensi transformasinya. Pakaian yang bernoda, robek, atau bergaya kuno bisa diberi kehidupan baru melalui upcycling. Keterampilan dasar menjahit sangat membantu, tetapi tidak selalu diperlukan—banyak proyek yang hanya membutuhkan sedikit jahitan atau bisa menggunakan lem kain sebagai alternatif.</p>

  <h2>Proyek Upcycling Sederhana</h2>
  <p>Berikut beberapa ide upcycling untuk pemula:</p>
  <ul>
    <li>Mengubah kaos lama menjadi tas belanja yang bisa digunakan ulang</li>
    <li>Mengubah jeans menjadi celana pendek atau rok denim</li>
    <li>Membuat sarung bantal patchwork dari sisa kain</li>
    <li>Membuat headband atau scrunchie dari kain elastis</li>
    <li>Mengubah sweater menjadi sarung tangan atau topi musim dingin</li>
  </ul>

  <h2>Teknik Tingkat Lanjut</h2>
  <p>Seiring keterampilan berkembang, Anda bisa mencoba proyek yang lebih kompleks seperti:</p>
  <ul>
    <li>Menggabungkan beberapa pakaian menjadi satu pakaian baru</li>
    <li>Menambahkan bordir atau aplikasi untuk mempercantik pakaian polos</li>
    <li>Membuat quilt dari kain kenangan seperti kaos konser</li>
    <li>Mendesain ulang pakaian formal agar bisa digunakan sehari-hari</li>
  </ul>

  <h2>Alat yang Diperlukan</h2>
  <p>Perlengkapan dasar untuk upcycling meliputi:</p>
  <ul>
    <li>Gunting tajam khusus kain</li>
    <li>Meteran kain dan kapur kain untuk penandaan</li>
    <li>Jarum dan benang dengan berbagai warna</li>
    <li>Mesin jahit (opsional tetapi sangat membantu)</li>
    <li>Lem kain untuk proyek tanpa jahitan</li>
  </ul>

  <p>Upcycling bukan hanya praktik ramah lingkungan—tetapi juga wadah kreatif untuk mengembangkan gaya unik Anda sambil berkontribusi pada industri fashion yang lebih berkelanjutan. Mulailah dari proyek sederhana dan lihat bagaimana keterampilan serta kreativitas Anda berkembang seiring waktu.</p>
    `,
  },
  {
    id: "3",
    title: "Understanding Sustainable Fabrics: A Guide for Conscious Consumers",
    excerpt:
      "Navigate the complex world of textile sustainability with this comprehensive guide to eco-friendly fabrics.",
    image: "/images/education/sustainable-fabrics.jpg",
    category: "Sustainability",
    readTime: "8 min",
    date: "April 22, 2023",
    author: "Sarah Williams",
    content: `
      <p>As environmental awareness grows, more consumers are seeking sustainable fabric options. Understanding the environmental impact of different textiles can help you make more informed choices when purchasing clothing.</p>
      
      <h2>Natural Fibers</h2>
      <p>Natural fibers like cotton, wool, and linen are biodegradable but vary greatly in sustainability depending on how they're produced:</p>
      <ul>
        <li><strong>Organic Cotton</strong>: Grown without synthetic pesticides or fertilizers, organic cotton uses 88% less water and 62% less energy than conventional cotton.</li>
        <li><strong>Linen</strong>: Made from flax plants that require minimal water and pesticides, linen is highly durable and biodegradable.</li>
        <li><strong>Hemp</strong>: One of the most sustainable crops, hemp grows quickly without pesticides and improves soil health.</li>
        <li><strong>Wool</strong>: A renewable resource that's biodegradable, though ethical concerns about animal treatment should be considered.</li>
      </ul>
      
      <h2>Regenerated Fibers</h2>
      <p>These fibers use existing materials to create new textiles:</p>
      <ul>
        <li><strong>Tencel (Lyocell)</strong>: Made from sustainably harvested wood pulp in a closed-loop process that reuses water and solvents.</li>
        <li><strong>Modal</strong>: Similar to Tencel but specifically made from beech trees, requiring less land and water than cotton.</li>
        <li><strong>Recycled Polyester</strong>: Created from post-consumer plastic bottles, reducing landfill waste and petroleum use.</li>
      </ul>
      
      <h2>Innovative Sustainable Materials</h2>
      <p>The textile industry is developing exciting new sustainable options:</p>
      <ul>
        <li><strong>Piñatex</strong>: A leather alternative made from pineapple leaf fibers, a byproduct of fruit harvesting.</li>
        <li><strong>Orange Fiber</strong>: Created from citrus juice byproducts that would otherwise be discarded.</li>
        <li><strong>Mycelium</strong>: Leather-like material grown from mushroom roots, fully biodegradable and renewable.</li>
      </ul>
      
      <h2>Certifications to Look For</h2>
      <p>When shopping, these certifications can help identify truly sustainable options:</p>
      <ul>
        <li>Global Organic Textile Standard (GOTS)</li>
        <li>OEKO-TEX Standard 100</li>
        <li>Bluesign certified</li>
        <li>Cradle to Cradle</li>
        <li>Fair Trade Certified</li>
      </ul>
      
      <p>By choosing sustainable fabrics, you're supporting innovation in the textile industry and reducing your environmental footprint. Every purchase is a vote for the kind of world you want to live in.</p>
    `,
  },
  {
    id: "4",
    title:
      "The Art of Proper Clothing Care: Extending the Life of Your Wardrobe",
    excerpt:
      "Discover how proper garment care can reduce waste and save money while keeping your clothes looking their best.",
    image: "/images/education/clothing-care.jpg",
    category: "Fashion",
    readTime: "6 min",
    date: "July 12, 2023",
    author: "David Miller",
    content: `
      <p>Proper clothing care is one of the simplest yet most effective ways to practice sustainable fashion. By extending the lifespan of your garments, you reduce the need for replacements, saving resources and reducing waste.</p>
      
      <h2>Washing Wisely</h2>
      <p>How you wash your clothes significantly impacts their longevity:</p>
      <ul>
        <li>Wash clothes less frequently—many items like jeans and sweaters don't need washing after every wear</li>
        <li>Use cold water when possible to preserve colors and fibers while saving energy</li>
        <li>Turn garments inside out to reduce abrasion on the visible surfaces</li>
        <li>Use gentle, eco-friendly detergents in appropriate amounts</li>
        <li>Avoid overloading the washing machine, which can cause excessive friction</li>
      </ul>
      
      <h2>Drying Techniques</h2>
      <p>Dryers are convenient but can be harsh on fabrics:</p>
      <ul>
        <li>Air-dry delicate items by laying them flat or hanging them up</li>
        <li>If using a dryer, choose lower heat settings to reduce fiber damage</li>
        <li>Remove clothes while slightly damp to reduce wrinkles and prevent over-drying</li>
        <li>Clean the lint filter after each use for efficiency and safety</li>
      </ul>
      
      <h2>Storage Solutions</h2>
      <p>Proper storage prevents unnecessary wear and damage:</p>
      <ul>
        <li>Fold heavy knits rather than hanging them to prevent stretching</li>
        <li>Use padded or wooden hangers for structured garments like suits and coats</li>
        <li>Store seasonal items clean and in breathable containers with cedar blocks or lavender sachets as natural moth deterrents</li>
        <li>Keep clothing out of direct sunlight to prevent fading</li>
      </ul>
      
      <h2>Maintenance and Repair</h2>
      <p>Regular maintenance extends garment life:</p>
      <ul>
        <li>Address small issues like loose buttons or minor tears promptly</li>
        <li>Learn basic mending skills or find a reliable tailor or repair service</li>
        <li>Use fabric shavers to remove pilling from sweaters and knits</li>
        <li>Polish and condition leather goods regularly</li>
        <li>Consider waterproofing outerwear seasonally</li>
      </ul>
      
      <p>By investing time in proper clothing care, you're not just maintaining your wardrobe—you're practicing sustainable consumption and reducing your environmental footprint. Quality care transforms fast fashion into slow fashion, regardless of where your clothes came from originally.</p>
    `,
  },
  {
    id: "5",
    title: "The Rise of Textile Recycling: Innovations Closing the Loop",
    excerpt:
      "Explore how new technologies are transforming textile waste into valuable resources in the circular economy.",
    image: "/images/education/textile-recycling.jpg",
    category: "Recycling",
    readTime: "9 min",
    date: "August 5, 2023",
    author: "Priya Patel",
    content: `
      <p>Textile waste represents one of the fastest-growing waste streams globally, with the average person discarding about 70 pounds of clothing and other textiles annually. Fortunately, innovations in textile recycling are creating new possibilities for closing the loop in fashion's circular economy.</p>
      
      <h2>The Textile Waste Challenge</h2>
      <p>Understanding the scope of the problem helps appreciate the importance of recycling solutions:</p>
      <ul>
        <li>Only about 15% of textiles are currently recycled or reused</li>
        <li>Synthetic fibers can take hundreds of years to decompose</li>
        <li>Landfilled textiles release methane as they decompose and leach dyes and chemicals into soil</li>
        <li>Even natural fibers create environmental problems when landfilled in large volumes</li>
      </ul>
      
      <h2>Mechanical Recycling</h2>
      <p>Traditional textile recycling involves mechanical processes:</p>
      <ul>
        <li>Sorting textiles by color and material composition</li>
        <li>Shredding fabrics into fibers</li>
        <li>Spinning these fibers into new yarn</li>
      </ul>
      <p>While effective for some applications, mechanical recycling typically produces lower-quality fibers suitable mainly for industrial applications like insulation or stuffing.</p>
      
      <h2>Chemical Recycling Breakthroughs</h2>
      <p>New chemical processes are revolutionizing textile recycling:</p>
      <ul>
        <li>Polymer recycling can break down polyester to its molecular components, creating virgin-quality recycled polyester</li>
        <li>Cellulose dissolution processes can transform cotton waste into new regenerated fibers like lyocell</li>
        <li>Blended fabrics, previously difficult to recycle, can now be separated into their component fibers</li>
      </ul>
      
      <h2>Innovative Startups Leading the Way</h2>
      <p>Companies at the forefront of textile recycling innovation include:</p>
      <ul>
        <li><strong>Worn Again Technologies</strong>: Developing technology to separate and recapture polyester and cotton from mixed-fiber textiles</li>
        <li><strong>Renewcell</strong>: Creating Circulose®, a biodegradable raw material made from recycled cotton textiles</li>
        <li><strong>Evrnu</strong>: Engineers NuCycl™ technology that breaks down cotton waste to the molecular level to create high-performance fibers</li>
        <li><strong>BlockTexx</strong>: Uses chemical separation technology to recover polyester and cellulose from textiles</li>
      </ul>
      
      <h2>Consumer Participation</h2>
      <p>Individuals can support textile recycling by:</p>
      <ul>
        <li>Using clothing collection programs offered by retailers like H&M, Patagonia, and The North Face</li>
        <li>Seeking out products made from recycled textiles</li>
        <li>Supporting policies that promote textile recycling infrastructure</li>
        <li>Donating wearable items to second-hand stores and sending damaged textiles to specialized recyclers</li>
      </ul>
      
      <p>While challenges remain in scaling these technologies, textile recycling innovations represent a crucial step toward a more sustainable fashion industry. By transforming waste into resources, these innovations help reduce the environmental impact of our clothing consumption.</p>
    `,
  },
];

interface Article {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  content: string;
}

const ArticlePage = () => {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const id = params.id;

  useEffect(() => {
    const foundArticle = articles.find((article) => article.id === id);
    setArticle(foundArticle || null);
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading article...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative w-full bg-gradient-to-r from-emerald-50 to-emerald-100 py-12 mb-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center mb-2">
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
              {article.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl">
            {article.excerpt}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-lg p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center">
              <FaUser className="h-4 w-4 mr-1" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center">
              <FaCalendar className="h-4 w-4 mr-1" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center">
              <FaClock className="h-4 w-4 mr-1" />
              <span>{article.readTime} read</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Table of Contents
            </h3>
            <div className="space-y-2">
              {article.content
                .match(/<h2>(.*?)<\/h2>/g)
                ?.map((match, index) => {
                  const title = match.replace(/<h2>(.*?)<\/h2>/, "$1");
                  const anchor = `section-${index + 1}`;
                  return (
                    <div key={index} className="flex items-center text-sm">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mr-2 text-xs font-medium">
                        {index + 1}
                      </div>
                      <a
                        href={`#${anchor}`}
                        className="text-gray-700 hover:text-emerald-600 transition-colors"
                      >
                        {title}
                      </a>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="relative">
            <div className="mb-8">
              <Link
                href="/education"
                className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
              >
                <FaArrowLeft className="mr-2 h-3 w-3" />
                Back to Articles
              </Link>
            </div>

            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-strong:font-semibold prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{
                __html: article.content
                  .replace(/<h2>(.*?)<\/h2>/g, (match, content) => {
                    const i =
                      article.content.split(match, 1).join("").match(/<h2>/g)
                        ?.length || 0;
                    return `<h2 id="section-${
                      i + 1
                    }" class="flex items-center border-l-4 border-emerald-500 pl-4 py-1 mt-10 mb-6">${content}</h2>`;
                  })
                  .replace(/<ul>/g, '<ul class="space-y-2 my-6 ml-6">')
                  .replace(/<li>/g, '<li class="pl-2">')
                  .replace(/<p>/g, '<p class="mb-6">')
                  .replace(
                    /<strong>/g,
                    '<strong class="text-emerald-700 font-semibold">'
                  ),
              }}
            />

            <div className="mt-12 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                  {article.category}
                </span>
                <span className="text-sm text-gray-500">
                  Published on {article.date}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
