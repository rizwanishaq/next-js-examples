"use client";

import React, { useState, useEffect, useRef } from "react";
import * as ort from "onnxruntime-web";
import WaveformCanvas from "./_components/WavformCanvas";

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
          workletNodeRef.current.port.postMessage({ enhancedFrame });
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
    <div
      style={{
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#264653" }}>Client-Side Audio Denoiser (48kHz, AudioWorklet)</h1>
      <p style={{ textAlign: "center", fontWeight: "600", marginBottom: 24 }}>
        Model Status:{" "}
        <span style={{ color: modelReady ? "#2a9d8f" : "#e76f51", fontWeight: "700" }}>
          {modelReady ? "Loaded" : "Loading..."}
        </span>
      </p>
      {error && (
        <p
          style={{
            color: "#e63946",
            fontWeight: "700",
            textAlign: "center",
            marginBottom: 24,
            userSelect: "none",
          }}
        >
          Error: {error}
        </p>
      )}

      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!modelReady}
          style={{
            padding: "14px 32px",
            fontSize: 18,
            fontWeight: "600",
            backgroundColor: isRecording ? "#e63946" : "#2a9d8f",
            color: "white",
            border: "none",
            borderRadius: 30,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(42, 157, 143, 0.5)",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = isRecording ? "#d62828" : "#21867a")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = isRecording ? "#e63946" : "#2a9d8f")
          }
        >
          {isRecording ? "Stop Live Denoising" : "Start Live Denoising"}
        </button>
      </div>

      {originalFrame && (
        <>
          <p
            style={{
              marginBottom: 12,
              fontWeight: "700",
              fontSize: 20,
              color: "#264653",
              textAlign: "center",
              userSelect: "none",
            }}
          >
            Original Frame Waveform
          </p>
          <WaveformCanvas data={originalFrame} color="#1f8ef1" />
        </>
      )}

      {processedFrame && (
        <>
          <p
            style={{
              marginTop: 48,
              marginBottom: 12,
              fontWeight: "700",
              fontSize: 20,
              color: "#2a9d8f",
              textAlign: "center",
              userSelect: "none",
            }}
          >
            Denoised Frame Waveform
          </p>
          <WaveformCanvas data={processedFrame} color="#2ca86c" />
        </>
      )}

      <p
        style={{
          fontSize: 13,
          color: "#8892a0",
          textAlign: "center",
          marginTop: 40,
          userSelect: "none",
        }}
      >
        Note: AudioWorklet is used for smooth low-latency playback. ONNX runs on the main thread,
        streamed from the worklet.
      </p>
    </div>
  );
}
