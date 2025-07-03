"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, Bot, Waves, Mic } from "lucide-react";

export default function ProjectsPage() {
  const latestRef = useRef<HTMLDivElement>(null);

  const projects = [
    {
      title: "Conversational Voicebot",
      excerpt:
        "An end-to-end voice agent powered by ASR, NLU, and TTS with real-time streaming.",
      slug: "ai_agent",
      icon: Bot,
    },
    {
      title: "Real-Time Speech Denoiser",
      excerpt:
        "A dashboard to monitor and analyze live call center interactions using speech recognition.",
      slug: "denoiser",
      icon: Waves,
    },
    {
      title: "Voice Activity Detection",
      excerpt: "Detect speech activity with microphone input and VAD.",
      slug: "vad",
      icon: Mic,
    }
  ];

  const scrollToLatest = () => {
    latestRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 flex flex-col items-center px-4 py-12 md:py-24">
      <main className="text-center space-y-6">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Elevating <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Voice AI</span>
        </motion.h1>

        <motion.p
          className="max-w-2xl mx-auto text-lg text-neutral-700 dark:text-neutral-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Innovative, human-centric projects exploring speech, language, and real-time AI systems.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Button
            onClick={scrollToLatest}
            className="px-8 py-5 rounded-full text-lg font-semibold shadow-xl bg-gradient-to-r from-primary to-purple-600 text-white hover:brightness-110 transition"
          >
            View Latest Projects
          </Button>
        </motion.div>
      </main>

      <motion.section
        ref={latestRef}
        id="latest-projects"
        className="w-full max-w-7xl mt-24 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <motion.h2
          className="text-center text-4xl font-bold text-slate-800 dark:text-slate-100 mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          Latest Creations
        </motion.h2>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              className="relative rounded-3xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white/60 dark:from-slate-800/40 to-slate-100/40 dark:to-slate-900/30 backdrop-blur-xl shadow-xl p-6 transition-transform hover:scale-105 hover:shadow-2xl"
              whileHover={{ y: -5 }}
            >
              {/* floating icon */}
              <div className="absolute -top-6 -right-6 bg-primary text-white p-3 rounded-full shadow-lg">
                {project.icon && <project.icon className="w-6 h-6" />}
              </div>

              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
                {project.title}
              </h3>
              <p className="text-neutral-700 dark:text-neutral-400 mb-4">
                {project.excerpt}
              </p>
              <Link
                href={`/projects/${project.slug}`}
                className="inline-flex items-center gap-1 text-primary font-semibold hover:underline mt-2"
              >
                View Project <ArrowRight className="w-4 h-4" />
              </Link>
              {/* subtle gradient overlay on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-purple-600/10 opacity-0 hover:opacity-100 transition"></div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
