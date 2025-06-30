"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

export default function BlogPage() {
  const latestRef = useRef(null);

  // Articles with proper slugs
  const articles = [
    {
      title: "Mastering Conversational AI",
      excerpt:
        "A guide to building advanced conversational experiences using modern frameworks and voice models.",
      slug: "mastering-conversational-ai",
    },
    {
      title: "Real-Time Voice Agents Explained",
      excerpt:
        "Understand how real-time ASR and TTS pipelines power seamless human-like conversations.",
      slug: "real-time-voice-agents-explained",
    },
    {
      title: "Deploying AI Voice Agents at Scale",
      excerpt:
        "Tips and patterns to roll out voice agents with reliability and resilience in production.",
      slug: "deploying-ai-voice-agents-at-scale",
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
          Latest <span className="text-primary">AI Blog</span> Articles
        </motion.h1>

        <motion.p
          className="mt-6 max-w-2xl mx-auto text-lg text-neutral-600 dark:text-neutral-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Dive deeper into the world of voice agents, conversational interfaces, and AI technology.
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
            Read Latest Articles
          </Button>
        </motion.div>
      </main>

      <motion.div
        ref={latestRef}
        id="latest-articles"
        className="mt-16 w-full max-w-5xl px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, idx) => (
            <motion.div
              key={idx}
              className="rounded-2xl shadow-md bg-white dark:bg-slate-800 p-6 hover:shadow-xl transition"
              whileHover={{ scale: 1.03 }}
            >
              <h2 className="text-xl font-bold mb-2">{article.title}</h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">{article.excerpt}</p>
              <Link
                href={`/blogs/${article.slug}`}
                className="text-primary font-semibold hover:underline"
              >
                Read more →
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
