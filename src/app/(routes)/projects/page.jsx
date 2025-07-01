"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

export default function ProjectsPage() {
  const latestRef = useRef(null);

  const projects = [
    {
      title: "Conversational Voicebot",
      excerpt: "An end-to-end voice agent powered by ASR, NLU, and TTS with real-time streaming.",
      slug: "conversational-voicebot",
    },
    {
      title: "AI Document Summarizer",
      excerpt: "A tool that summarizes long documents using transformer-based language models.",
      slug: "ai-document-summarizer",
    },
    {
      title: "Real-Time Speech Denoiser",
      excerpt: "A dashboard to monitor and analyze live call center interactions using speech recognition.",
      slug: "denoiser",
    },
  ];

  const scrollToLatest = () => {
    latestRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 md:py-20 flex flex-col items-center">
      <main className="z-10 mt-12 text-center">
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Featured <span className="text-primary">AI Projects</span>
        </motion.h1>

        <motion.p
          className="mt-6 max-w-2xl mx-auto text-lg text-neutral-600 dark:text-neutral-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Discover innovative projects exploring the future of voice, AI, and natural language.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <Button
            className="w-60 text-lg py-6 font-semibold dark:bg-white dark:text-black dark:hover:bg-gray-200"
            onClick={scrollToLatest}
          >
            View Latest Projects
          </Button>
        </motion.div>
      </main>

      <motion.div
        ref={latestRef}
        id="latest-projects"
        className="mt-16 w-full max-w-5xl px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              className="rounded-2xl shadow-md bg-white dark:bg-slate-800 p-6 hover:shadow-xl transition"
              whileHover={{ scale: 1.03 }}
            >
              <h2 className="text-xl font-bold mb-2">{project.title}</h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">{project.excerpt}</p>
              <Link
                href={`/projects/${project.slug}`}
                className="text-primary font-semibold hover:underline"
              >
                View Project →
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
