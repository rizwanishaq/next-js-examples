"use client";

import React, { useState, useEffect, useRef } from "react";
import * as ort from "onnxruntime-web";
import WaveformCanvas from "./_components/WavformCanvas";

import { Mic } from 'lucide-react';
import { Button } from "@/components/ui/button";

let session = null;
let modelState = null;
let attenLimDb = null;

const MODEL_SAMPLE_RATE = 48000;
const FRAME_SIZE = 480;

async function initializeDenoiserModel() {
  if (session) return true;

  try {
    ort.env.wasm.simd = true;
    session = await ort.InferenceSession.create("/denoiser_model.onnx", {
      executionProviders: ["wasm"],
      graphOptimizationLevel: "extended",
    });
    console.log("ONNX model loaded");

    modelState = new ort.Tensor("float32", new Float32Array(45304), [45304]);
    attenLimDb = new ort.Tensor("float32", new Float32Array([0.0]), []);

    return true;
  } catch (e) {
    console.error("Failed to load ONNX model:", e);
    return false;
  }
}

async function processAudioFrame(frameArray) {
  if (!session || !modelState || !attenLimDb) {
    console.error("Model not initialized.");
    return null;
  }

  if (!(frameArray instanceof Float32Array) || frameArray.length !== FRAME_SIZE) {
    console.error(`Invalid frame`);
    return new Float32Array(FRAME_SIZE).fill(0);
  }

  try {
    const feeds = {
      input_frame: new ort.Tensor("float32", frameArray, [FRAME_SIZE]),
      states: modelState,
      atten_lim_db: attenLimDb,
    };

    const results = await session.run(feeds);

    const enhancedFrame = results.enhanced_audio_frame.data;
    modelState = results.new_states;

    // Normalize max amplitude for better visualization
    let max = 0;
    for (let i = 0; i < enhancedFrame.length; i++) {
      const abs = Math.abs(enhancedFrame[i]);
      if (abs > max) max = abs;
    }
    if (max > 1) {
      for (let i = 0; i < enhancedFrame.length; i++) {
        enhancedFrame[i] /= max;
      }
    }
    return enhancedFrame;
  } catch (e) {
    console.error("process frame error", e);
    return new Float32Array(FRAME_SIZE).fill(0);
  }
}

export default function DenoiserPage() {
  const [modelReady, setModelReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);

  const [originalFrame, setOriginalFrame] = useState(null);
  const [processedFrame, setProcessedFrame] = useState(null);

  const audioContextRef = useRef(null);
  const mediaStreamSourceRef = useRef(null);
  const workletNodeRef = useRef(null);

  useEffect(() => {
    initializeDenoiserModel().then((ready) => {
      setModelReady(ready);
      if (!ready) setError("Model load failed");
    });
    return () => {
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const startRecording = async () => {
    if (!modelReady) {
      setError("Model not ready");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: MODEL_SAMPLE_RATE,
      });

      await audioContextRef.current.audioWorklet.addModule("/worklets/denoiser-processor.js");

      workletNodeRef.current = new AudioWorkletNode(audioContextRef.current, "denoiser-processor");

      workletNodeRef.current.port.onmessage = async (event) => {
        const { frame } = event.data;
        if (frame) {
          const frameData = new Float32Array(frame);
          setOriginalFrame(frameData);
          const enhancedFrame = await processAudioFrame(frameData);
          setProcessedFrame(enhancedFrame);
          if (workletNodeRef.current) {
            workletNodeRef.current.port.postMessage({ enhancedFrame });
          }
        }
      };

      mediaStreamSourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      mediaStreamSourceRef.current.connect(workletNodeRef.current);
      workletNodeRef.current.connect(audioContextRef.current.destination);

      setIsRecording(true);
      setError(null);
      console.log("Recording started with AudioWorklet");
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
  };

  const stopRecording = () => {
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }
    if (mediaStreamSourceRef.current) {
      mediaStreamSourceRef.current.disconnect();
      mediaStreamSourceRef.current.mediaStream.getTracks().forEach((track) => track.stop());
      mediaStreamSourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsRecording(false);
    setOriginalFrame(null);
    setProcessedFrame(null);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 md:py-20 flex flex-col items-center max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight text-center">
        Real-time Audio Denoiser
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-base text-neutral-600 dark:text-neutral-400 text-center">
        Experience real-time audio denoising directly in your browser. Click the microphone to start or stop.
      </p>
      <p className="mt-8 text-center font-semibold text-lg">
        Model Status:{" "}
        <span className={modelReady ? "text-green-600" : "text-red-600"}>
          {modelReady ? "Loaded" : "Loading..."}
        </span>
      </p>
      {error && (
        <p className="text-red-600 font-bold text-center mb-6">
          Error: {error}
        </p>
      )}

      <div className="text-center my-10">
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!modelReady}
          className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300
                     ${isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-gradient-to-r from-blue-700 to-purple-600 hover:brightness-110"}`}
          aria-label={isRecording ? "Stop Recording" : "Start Recording"}
        >
          <Mic size={48} />
        </Button>
      </div>

      {originalFrame && (
        <>
          <p className="mb-3 font-bold text-xl text-slate-800 dark:text-slate-100 text-center">
            Original Frame Waveform
          </p>
          <WaveformCanvas data={originalFrame} color="#1f8ef1" />
        </>
      )}

      {processedFrame && (
        <>
          <p className="mt-12 mb-3 font-bold text-xl text-green-600 text-center">
            Denoised Frame Waveform
          </p>
          <WaveformCanvas data={processedFrame} color="#2ca86c" />
        </>
      )}

      <p className="text-sm text-neutral-500 text-center mt-10">
        Note: AudioWorklet is used for smooth low-latency playback. ONNX runs on the main thread,
        streamed from the worklet.
      </p>
    </div>
  );
}
