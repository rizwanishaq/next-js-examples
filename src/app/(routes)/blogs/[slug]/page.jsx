"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug;

  // Simulate fetching article from static list
  const articles = [
    {
      slug: "mastering-conversational-ai",
      title: "Mastering Conversational AI",
      content: `This in-depth guide covers the architecture, training, and best practices
      for building conversational AI systems using modern frameworks and voice models. It includes
      design patterns, example code, and production deployment strategies.`,
    },
    {
      slug: "real-time-voice-agents-explained",
      title: "Real-Time Voice Agents Explained",
      content: `Learn about the pipelines, streaming architectures, and
      technical challenges behind building real-time voice agents. This article explains
      how ASR and TTS components integrate to power a human-like conversation.`,
    },
    {
      slug: "deploying-ai-voice-agents-at-scale",
      title: "Deploying AI Voice Agents at Scale",
      content: `Scaling voice agents to production involves handling concurrency, security,
      error resilience, and observability. We will share our lessons from large-scale deployments
      and recommended best practices.`,
    },
  ];

  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-3xl font-bold mb-4">Article not found</h1>
        <Link
          href="/blogs"
          className="text-primary hover:underline font-semibold"
        >
          Back to blogs
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
          {article.title}
        </motion.h1>
        <motion.article
          className="prose dark:prose-invert text-neutral-700 dark:text-neutral-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p>{article.content}</p>
        </motion.article>
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link
            href="/blogs"
            className="inline-block mt-4 text-primary font-semibold hover:underline"
          >
            ← Back to blog list
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
