"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiCalendar,
  FiScissors,
  FiBarChart2,
  FiInfo,
  FiEye,
  FiTool,
} from "react-icons/fi";
import { LuLeaf } from "react-icons/lu";
import axios from "axios";
import { createClient } from "@/utils/supabase/client";
import ReactMarkdown from "react-markdown";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://sericlo-6e15467e3310.herokuapp.com";

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

interface RedesignIdea {
  title: string;
  description: string;
  steps: string[];
  difficulty: string;
  materials: string[];
  sustainability_impact: string;
  visual_description: string;
}

interface Redesign {
  id: string;
  original_image: string;
  style: string;
  description: string;
  ideas: string;
  status: string;
  created_at: string;
}

const cleanMarkdown = (str: string) =>
  str
    .replace(/^\s*[*_`#>-]+|[*_`#>-]+\s*$/g, "") // remove leading/trailing markdown
    .replace(/^\s*\*+|\*+\s*$/g, "") // remove leading/trailing asterisks
    .replace(/^\s*:+|:+\s*$/g, "") // remove leading/trailing colons
    .replace(/^\s*\d+\.?\)?\s*/, "") // remove leading numbers
    .trim();

const parseIdeas = (ideasData: string): RedesignIdea[] => {
  try {
    const parsed = JSON.parse(ideasData);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (typeof parsed === "object" && parsed !== null) {
      return [parsed];
    }
  } catch {}

  try {
    const ideas: RedesignIdea[] = [];

    let ideaSections = ideasData
      .split(/###\s+Idea\s+\d+:|---/)
      .filter((section) => section.trim());

    if (ideaSections.length <= 1) {
      ideaSections = ideasData
        .split(/\n\s*(?:Idea|Option|Redesign)\s*\d+\s*[:|-]/i)
        .filter((section) => section.trim());
    }

    for (let i = 0; i < ideaSections.length; i++) {
      const section = ideaSections[i].trim();
      if (!section) continue;

      let title = `Ide Redesign ${i + 1}`;

      const titleMatch =
        section.match(/\*\*Deskripsi:\*\*\s*(.*?)(?:\n|$)/) ||
        section.match(/\*\*1\.\s*Title:\*\*\s*(.*?)(?:\n|$)/) ||
        section.match(/^(.+?)(?:\n|$)/);

      if (titleMatch && titleMatch[1]) {
        title = cleanMarkdown(titleMatch[1]);
      }

      let description = "";
      const descMatch =
        section.match(/\*\*Deskripsi:\*\*\s*(.*?)(?:\n\n|\*\*Langkah)/) ||
        section.match(/\*\*2\.\s*Description:\*\*\s*(.*?)(?:\n\n|\*\*3\.)/) ||
        section.match(/Deskripsi:\s*(.*?)(?:\n\n|Langkah)/i);

      if (descMatch && descMatch[1]) {
        description = cleanMarkdown(descMatch[1]);
      } else {
        const firstPara = section.split(/\n\n/)[0].trim();
        description =
          firstPara !== title
            ? cleanMarkdown(firstPara)
            : "Tidak ada deskripsi.";
      }

      const steps: string[] = [];
      const stepsMatch =
        section.match(
          /\*\*Langkah-langkah:\*\*\s*([\s\S]*?)(?:\n\n\*\*Tingkat|$)/
        ) ||
        section.match(
          /\*\*3\.\s*Step-by-Step Instructions:\*\*\s*([\s\S]*?)(?:\n\n\*\*4\.|$)/
        ) ||
        section.match(
          /(?:Langkah|Steps|Instructions|How to)(?:\s*:)?\s*([\s\S]*?)(?:\n\s*(?:Bahan|Materials|Difficulty|Sustainability|Tingkat|$))/i
        );

      if (stepsMatch && stepsMatch[1]) {
        const stepsText = stepsMatch[1].trim();
        const stepLines = stepsText
          .split(/\n\s*\d+[.)]\s*/)
          .filter((s) => s.trim());
        steps.push(...stepLines.map(cleanMarkdown));
      }

      let difficulty = "Medium";
      const difficultyMatch =
        section.match(/\*\*Tingkat Kesulitan:\*\*\s*(.*?)(?:\n|$)/) ||
        section.match(
          /\*\*4\.\s*Estimated Difficulty Level:\*\*\s*(.*?)(?:\n|$)/
        ) ||
        section.match(
          /(?:Tingkat Kesulitan|Difficulty)(?:\s*:)?\s*(.*?)(?:\n|$)/i
        );

      if (difficultyMatch && difficultyMatch[1]) {
        difficulty = cleanMarkdown(difficultyMatch[1]);
      }

      const materials: string[] = [];
      const materialsMatch =
        section.match(
          /\*\*Bahan dan Alat:\*\*\s*([\s\S]*?)(?:\n\n\*\*Dampak|$)/
        ) ||
        section.match(
          /\*\*5\.\s*Required Materials and Tools:\*\*\s*([\s\S]*?)(?:\n\n\*\*6\.|$)/
        ) ||
        section.match(
          /(?:Bahan dan Alat|Materials)(?:\s*:)?\s*([\s\S]*?)(?:\n\s*(?:Dampak|Difficulty|Sustainability|$))/i
        );

      if (materialsMatch && materialsMatch[1]) {
        const materialsText = materialsMatch[1].trim();
        const materialLines = materialsText
          .split(/\n\s*[-•]\s*/)
          .filter((s) => s.trim());
        materials.push(...materialLines.map(cleanMarkdown));
      }

      let sustainability = "";
      const sustainabilityMatch =
        section.match(
          /\*\*Dampak Keberlanjutan:\*\*\s*([\s\S]*?)(?:\n\n\*\*Deskripsi Visual|$)/
        ) ||
        section.match(
          /\*\*6\.\s*Sustainability Impact:\*\*\s*([\s\S]*?)(?:\n|$)/
        ) ||
        section.match(
          /(?:Dampak Keberlanjutan|Sustainability)(?:\s*:)?\s*([\s\S]*?)(?:\n\s*(?:Deskripsi Visual|Visual|$))/i
        );

      if (sustainabilityMatch && sustainabilityMatch[1]) {
        sustainability = cleanMarkdown(sustainabilityMatch[1]);
      }

      let visual = "";
      const visualMatch =
        section.match(/\*\*Deskripsi Visual:\*\*\s*([\s\S]*?)(?:\n\s*$)/) ||
        section.match(
          /(?:Deskripsi Visual|Visual)(?:\s*:)?\s*([\s\S]*?)(?:\n\s*$)/i
        );

      if (visualMatch && visualMatch[1]) {
        visual = cleanMarkdown(visualMatch[1]);
      }

      ideas.push({
        title,
        description,
        steps,
        difficulty,
        materials,
        sustainability_impact: sustainability,
        visual_description: visual,
      });
    }

    if (ideas.length > 0) {
      return ideas;
    }
  } catch {}

  return [
    {
      title: "Saran Redesign",
      description: ideasData,
      steps: [],
      difficulty: "Unknown",
      materials: [],
      sustainability_impact: "",
      visual_description: "",
    },
  ];
};

const getDifficultyColor = (difficulty: string) => {
  const lowerDifficulty = difficulty.toLowerCase();
  if (
    lowerDifficulty.includes("easy") ||
    lowerDifficulty.includes("beginner") ||
    lowerDifficulty.includes("mudah")
  ) {
    return "bg-green-100 text-green-800";
  } else if (
    lowerDifficulty.includes("medium") ||
    lowerDifficulty.includes("intermediate") ||
    lowerDifficulty.includes("menengah")
  ) {
    return "bg-yellow-100 text-yellow-800";
  } else if (
    lowerDifficulty.includes("hard") ||
    lowerDifficulty.includes("advanced") ||
    lowerDifficulty.includes("sulit") ||
    lowerDifficulty.includes("lanjut")
  ) {
    return "bg-red-100 text-red-800";
  }
  return "bg-blue-100 text-blue-800";
};

const Card = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => <div className={`p-4 border-b ${className}`}>{children}</div>;

const CardTitle = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>;

const CardContent = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => <div className={`p-6 ${className}`}>{children}</div>;

const Badge = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <span
    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${className}`}
  >
    {children}
  </span>
);

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

const SectionHeader = ({
  icon,
  title,
  className = "",
}: {
  icon: React.ReactNode;
  title: string;
  className?: string;
}) => (
  <div className={`flex items-center mb-3 ${className}`}>
    <div className="text-primary mr-2">{icon}</div>
    <h3 className="font-semibold text-lg">{title}</h3>
  </div>
);

const IdeaCard = ({ idea }: { idea: RedesignIdea }) => {
  const getLocalizedTitles = () => {
    const isIndonesian =
      idea.title.match(/croptop|daster|renda|kain/i) ||
      idea.description.match(/daster|kain|jahit|potong/i);

    return {
      description: isIndonesian ? "Deskripsi" : "Description",
      steps: isIndonesian ? "Langkah-langkah" : "Steps",
      materials: isIndonesian ? "Bahan dan Alat" : "Materials Needed",
      difficulty: isIndonesian ? "Tingkat Kesulitan" : "Difficulty Level",
      sustainability: isIndonesian
        ? "Dampak Keberlanjutan"
        : "Sustainability Impact",
      visual: isIndonesian ? "Deskripsi Visual" : "Visual Description",
    };
  };

  const titles = getLocalizedTitles();

  return (
    <Card className="overflow-hidden border border-gray-100 transition-all hover:shadow-md">
      <CardHeader className="bg-primary/5 pb-3">
        <CardTitle className="text-xl text-primary">{idea.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <SectionHeader
            icon={<FiInfo className="h-5 w-5" />}
            title={titles.description}
          />
          <div className="prose prose-primary max-w-none text-gray-700">
            <ReactMarkdown>{idea.description}</ReactMarkdown>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {idea.steps.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg h-full">
              <SectionHeader
                icon={<FiScissors className="h-5 w-5" />}
                title={titles.steps}
              />
              <ol className="space-y-3 ml-5">
                {idea.steps.map((step, stepIndex) => (
                  <li
                    key={stepIndex}
                    className="text-gray-700 list-decimal marker:text-primary marker:font-bold"
                  >
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {idea.materials.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg h-full">
              <SectionHeader
                icon={<FiTool className="h-5 w-5" />}
                title={titles.materials}
              />
              <ul className="space-y-2 ml-5">
                {idea.materials.map((material, materialIndex) => (
                  <li
                    key={materialIndex}
                    className="text-gray-700 list-disc marker:text-primary"
                  >
                    {material}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {idea.difficulty && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <SectionHeader
                icon={<FiBarChart2 className="h-5 w-5" />}
                title={titles.difficulty}
              />
              <Badge className={getDifficultyColor(idea.difficulty)}>
                {idea.difficulty}
              </Badge>
            </div>
          )}

          {idea.sustainability_impact && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <SectionHeader
                icon={<LuLeaf className="h-5 w-5 text-green-600" />}
                title={titles.sustainability}
              />
              <div className="prose prose-green max-w-none text-gray-700">
                <ReactMarkdown>{idea.sustainability_impact}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        {idea.visual_description && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <SectionHeader
              icon={<FiEye className="h-5 w-5" />}
              title={titles.visual}
            />
            <div className="prose max-w-none text-gray-700">
              <ReactMarkdown>{idea.visual_description}</ReactMarkdown>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const AIRedesignDetailPage = () => {
  const params = useParams();
  const [redesign, setRedesign] = useState<Redesign | null>(null);
  const [parsedIdeas, setParsedIdeas] = useState<RedesignIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawIdeas, setRawIdeas] = useState<string>("");
  const id = params.id as string;

  useEffect(() => {
    const fetchRedesign = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/ai/${id}`);
        const { data } = res.data;
        setRedesign(data);
        setRawIdeas(data.ideas);

        const ideas = parseIdeas(data.ideas);
        setParsedIdeas(ideas);
      } catch (err) {
        console.error("Failed to load redesign:", err);
        setError("Gagal memuat hasil redesign");
      } finally {
        setLoading(false);
      }
    };

    fetchRedesign();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 w-48 mb-6">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="h-12 w-3/4 mb-4">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="h-6 w-1/3 mb-8">
            <Skeleton className="h-full w-full" />
          </div>

          <div className="h-32 w-full mb-8">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-96">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !redesign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-500">
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              {error || "Redesign not found"}
            </p>
            <Link href="/ai-redesign">
              <button className="w-full bg-primary text-white rounded-md px-4 py-2 flex items-center justify-center">
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Return to AI Redesign
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 pb-16"
    >
      <div className="bg-white p-6 border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/ai-redesign"
            className="inline-flex items-center text-gray-600 hover:text-primary transition-colors"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
          <h1 className="text-3xl font-bold text-primary mt-4">
            {redesign.style} Redesign
          </h1>
          <div className="flex items-center text-gray-500 mt-2">
            <FiCalendar className="mr-2 h-4 w-4" />
            <span>
              Dibuat pada{" "}
              {new Date(redesign.created_at).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Card className="mb-8 border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <FiInfo className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
              <div className="prose prose-primary max-w-none text-gray-700">
                <ReactMarkdown>{redesign.description}</ReactMarkdown>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8 sticky top-[73px] z-10 bg-gray-50 pt-2">
          <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide">
            {parsedIdeas.map((idea, index) => (
              <a
                key={index}
                href={`#idea-${index}`}
                className="px-4 py-2 bg-white rounded-full shadow-sm text-sm font-medium text-gray-700 hover:bg-primary hover:text-white transition-colors whitespace-nowrap"
              >
                {idea.title.length > 25
                  ? `${idea.title.substring(0, 25)}...`
                  : idea.title}
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:sticky lg:top-[140px] lg:self-start"
          >
            <Card className="h-full border-t-4 border-t-primary">
              <CardHeader className="pb-2 bg-primary/5">
                <CardTitle className="flex items-center">
                  <FiEye className="h-5 w-5 mr-2 text-primary" />
                  Gambar Asli
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-square rounded-md overflow-hidden border border-gray-200">
                  <Image
                    src={redesign.original_image || "/placeholder.svg"}
                    alt="Original garment"
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="space-y-12">
              {parsedIdeas.map((idea, index) => (
                <div key={index} id={`idea-${index}`}>
                  <IdeaCard idea={idea} />
                </div>
              ))}
            </div>

            {parsedIdeas.length === 1 &&
              parsedIdeas[0].title === "Saran Redesign" && (
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Raw Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <ReactMarkdown>{rawIdeas}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIRedesignDetailPage;
