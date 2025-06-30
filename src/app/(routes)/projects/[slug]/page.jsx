"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug;

  // Match the same projects data from the main projects page
  const projects = [
    {
      slug: "conversational-voicebot",
      title: "Conversational Voicebot",
      excerpt: "An end-to-end voice agent powered by ASR, NLU, and TTS with real-time streaming.",
      details: `This project builds a voice agent capable of understanding and responding
        to user requests in real time using automatic speech recognition, natural language
        understanding, and text-to-speech technologies. It supports natural conversations
        with continuous streaming audio processing.`,
    },
    {
      slug: "ai-document-summarizer",
      title: "AI Document Summarizer",
      excerpt: "A tool that summarizes long documents using transformer-based language models.",
      details: `This project implements a transformer-based summarization system
        that ingests long documents and produces concise summaries to improve
        reading efficiency and comprehension.`,
    },
    {
      slug: "real-time-speech-analytics",
      title: "Real-Time Speech Analytics",
      excerpt: "A dashboard to monitor and analyze live call center interactions using speech recognition.",
      details: `A dashboard solution that leverages speech recognition and analytics
        to provide real-time insights into call center conversations, enabling
        monitoring of key metrics and agent performance.`,
    },
  ];

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-3xl font-bold mb-4">Project not found</h1>
        <Link
          href="/projects"
          className="text-primary hover:underline font-semibold"
        >
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10 md:py-20 flex flex-col items-center">
      <main className="max-w-3xl">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 mb-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {project.title}
        </motion.h1>

        <motion.section
          className="prose dark:prose-invert text-neutral-700 dark:text-neutral-300 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p>{project.excerpt}</p>
        </motion.section>

        <motion.article
          className="prose dark:prose-invert text-neutral-700 dark:text-neutral-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p>{project.details}</p>
        </motion.article>

        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Link
            href="/projects"
            className="inline-block mt-4 text-primary font-semibold hover:underline"
          >
            ← Back to projects list
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
