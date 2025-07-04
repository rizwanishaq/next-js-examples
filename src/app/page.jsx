"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background px-6 md:px-8 py-10 md:py-20 flex flex-col items-center max-w-7xl mx-auto">

      <main className="z-10 mt-12 text-center">
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {["Conversational", "AI", "Assistant"].map((word, index) => (
            <motion.span
              key={index}
              className="inline-block mr-2"
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                delay: index * 0.15,
                duration: 0.5,
                ease: "easeOut",
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          className="mt-6 max-w-2xl mx-auto text-lg text-neutral-600 dark:text-neutral-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Power natural conversations in text and voice. Our AI assistant understands, responds, and takes action in real-time — making your applications smarter than ever.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <Link href={"/ai_agent"}>
            <Button
              className="w-60 text-lg py-6 font-semibold rounded-full
                        bg-gradient-to-r from-primary to-purple-600 text-white hover:brightness-110
                        dark:bg-gradient-to-r dark:from-primary dark:to-purple-600"
            >
              Launch AI Agent
            </Button>
          </Link>
        </motion.div>

        <motion.div
          className="mt-16 w-full max-w-5xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <motion.svg
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full aspect-[16/9]"
          >
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="25%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="75%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>

            {/* Bottom wave */}
            <motion.path
              fill="url(#waveGradient)"
              fillOpacity="0.3"
              d="M0,192L48,192C96,192,192,192,288,181.3C384,171,480,149,576,154.7C672,160,768,192,864,197.3C960,203,1056,181,1152,165.3C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              animate={{
                d: [
                  "M0,192L48,192C96,192,192,192,288,181.3C384,171,480,149,576,154.7C672,160,768,192,864,197.3C960,203,1056,181,1152,165.3C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,160L48,144C96,128,192,96,288,96C384,96,480,128,576,138.7C672,149,768,139,864,144C960,149,1056,171,1152,176C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,192L48,192C96,192,192,192,288,181.3C384,171,480,149,576,154.7C672,160,768,192,864,197.3C960,203,1056,181,1152,165.3C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                ],
              }}
              transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
            />

            {/* Top wave */}
            <motion.path
              fill="url(#waveGradient)"
              fillOpacity="0.5"
              d="M0,160L40,160C80,160,160,160,240,170.7C320,181,400,203,480,197.3C560,192,640,160,720,154.7C800,149,880,171,960,181.3C1040,192,1120,192,1200,181.3C1280,171,1360,149,1400,138.7L1440,128L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
              animate={{
                d: [
                  "M0,160L40,160C80,160,160,160,240,170.7C320,181,400,203,480,197.3C560,192,640,160,720,154.7C800,149,880,171,960,181.3C1040,192,1120,192,1200,181.3C1280,171,1360,149,1400,138.7L1440,128L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z",
                  "M0,144L40,138.7C80,133,160,122,240,112C320,102,400,96,480,101.3C560,107,640,123,720,122.7C800,123,880,107,960,117.3C1040,128,1120,165,1200,186.7C1280,208,1360,213,1400,213.3L1440,213L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z",
                  "M0,160L40,160C80,160,160,160,240,170.7C320,181,400,203,480,197.3C560,192,640,160,720,154.7C800,149,880,171,960,181.3C1040,192,1120,192,1200,181.3C1280,171,1360,149,1400,138.7L1440,128L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z",
                ],
              }}
              transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
            />
          </motion.svg>
        </motion.div>
      </main>
    </div>
  );
}
