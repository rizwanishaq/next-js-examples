"use client";

import { useState, useEffect } from "react";
import { useMicVAD } from "@ricky0123/vad-react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, StopCircle } from "lucide-react";
import { float32ToWavBlob } from "@/lib/utils";

export default function VoiceActivityPage() {
  const [isListening, setIsListening] = useState(false);
  const [speechLogs, setSpeechLogs] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const vad = useMicVAD({
    onSpeechStart: () => {
      if (!isListening) return;
      setIsSpeaking(true);
      setSpeechLogs((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: `Speech started at ${new Date().toLocaleTimeString()}`,
          audioURL: null,
        },
      ]);
    },
    onSpeechEnd: (audioData) => {
      if (!isListening) return;
      setIsSpeaking(false);

      let audioBlob;
      if (audioData instanceof Float32Array) {
        audioBlob = float32ToWavBlob(audioData);
      } else if (audioData instanceof Blob) {
        audioBlob = audioData;
      } else {
        audioBlob = null;
      }

      const audioURL = audioBlob ? URL.createObjectURL(audioBlob) : null;

      setSpeechLogs((prev) => {
        const newLogs = [...prev];
        const lastIndex = newLogs.length - 1;
        if (lastIndex >= 0) {
          newLogs[lastIndex] = {
            ...newLogs[lastIndex],
            text: `Speech ended at ${new Date().toLocaleTimeString()}`,
            audioURL,
          };
        } else {
          newLogs.push({
            id: Date.now(),
            text: `Speech ended at ${new Date().toLocaleTimeString()}`,
            audioURL,
          });
        }
        return newLogs;
      });
    },
  });

  useEffect(() => {
    if (!isListening) setIsSpeaking(false);
  }, [isListening]);

  const barVariants = {
    idle: { scaleY: 1, opacity: 0.4 },
    speaking: {
      scaleY: [1, 2.5, 1.5, 3, 1],
      opacity: [0.4, 1, 0.6, 1, 0.4],
      transition: {
        repeat: Infinity,
        duration: 1.2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <main className="min-h-screen px-6 py-12 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 transition-colors flex items-center justify-center">
      <div
        className="
          grid
          w-full max-w-7xl
          grid-cols-1
          gap-10
          md:grid-cols-[1fr_auto_1fr]
          md:gap-20
          items-center
          px-4
          "
      >
        {/* Mic container on left (on desktop col 1), centered vertically */}
        <section className="flex flex-col items-center md:items-center md:justify-center md:row-start-1 md:col-start-1">
          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-8 select-none text-center max-w-xs">
            Voice Activity Detection
          </h1>

          <p className="text-center text-lg text-neutral-700 dark:text-neutral-400 mb-8 select-none min-h-[48px] max-w-xs px-2">
            {isListening
              ? isSpeaking
                ? "🎙️ Listening... User is speaking."
                : "👂 Listening... Waiting for speech."
              : "Click the mic to start listening."}
          </p>

          <div className="relative flex flex-col items-center justify-center w-44 h-44 rounded-full bg-gradient-to-tr from-primary to-purple-600 shadow-lg shadow-purple-400/60">
            <AnimatePresence>
              {isListening && isSpeaking && (
                <>
                  {[0, 0.6, 1.2].map((delay, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 0.2, scale: 1.7 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                        duration: 2,
                        delay,
                      }}
                      className="absolute rounded-full border-2 border-white"
                      style={{ width: 180, height: 180 }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            <motion.button
              onClick={() => setIsListening(!isListening)}
              className={`relative z-20 w-32 h-32 rounded-full flex items-center justify-center
                bg-white dark:bg-neutral-900
                shadow-xl shadow-black/30
                hover:brightness-110
                focus:outline-none
                ring-4 ring-transparent
                ${isListening ? "ring-purple-600" : "ring-transparent"}
                transition-all duration-300`}
              whileTap={{ scale: 0.95 }}
              aria-label={isListening ? "Stop Listening" : "Start Listening"}
            >
              {isListening ? (
                <StopCircle className="w-16 h-16 text-purple-600" />
              ) : (
                <Mic className="w-16 h-16 text-purple-600" />
              )}
            </motion.button>

            <div className="absolute bottom-6 flex space-x-1">
              {[...Array(5)].map((_, idx) => (
                <motion.div
                  key={idx}
                  className="w-2 h-6 bg-purple-500 rounded"
                  variants={barVariants}
                  animate={isSpeaking ? "speaking" : "idle"}
                  style={{ originY: "bottom" }}
                  transition={{
                    delay: idx * 0.15,
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 1.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Spacer for center column on desktop */}
        <div className="hidden md:block md:col-start-2" />

        {/* Speech logs on right (col 3) */}
        <aside
          className="
            w-full
            max-w-md
            md:col-start-3
            max-h-[80vh]
            rounded-xl
            bg-white/90
            dark:bg-neutral-900/90
            backdrop-blur-md
            shadow-lg
            shadow-purple-400/30
            overflow-y-auto
            p-6
            flex
            flex-col
            border
            border-purple-300/40
          "
        >
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6 select-none">
            Speech Logs
          </h2>
          {speechLogs.length > 0 ? (
            <ul className="space-y-5 text-neutral-800 dark:text-neutral-300 text-base leading-relaxed">
              {speechLogs.map(({ id, text, audioURL }) => (
                <li key={id} className="flex flex-col space-y-2">
                  <span className="border-l-4 border-purple-600 pl-3 select-text break-words">
                    {text}
                  </span>
                  {audioURL && (
                    <audio
                      controls
                      src={audioURL}
                      className="w-full rounded-md"
                      preload="none"
                    />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="italic text-neutral-600 dark:text-neutral-400 select-none text-center">
              No speech detected yet.
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}
