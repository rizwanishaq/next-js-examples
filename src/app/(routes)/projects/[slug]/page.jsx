"use client";

import React, { useState, useEffect, useRef } from "react";
import * as ort from "onnxruntime-web";

// global model state
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
  const [testOutput, setTestOutput] = useState("");
  const [processingTest, setProcessingTest] = useState(false);

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
          const enhancedFrame = await processAudioFrame(new Float32Array(frame));
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
  };

  const handleProcessTestFrame = async () => {
    if (!modelReady) {
      alert("Model not ready yet!");
      return;
    }
    setProcessingTest(true);
    try {
      const dummyFrame = new Float32Array(FRAME_SIZE);
      for (let i = 0; i < FRAME_SIZE; i++) {
        dummyFrame[i] = Math.sin(i * 0.1) * 0.5;
      }
      const denoised = await processAudioFrame(dummyFrame);
      setTestOutput(denoised.slice(0, 20).join(", ") + "...");
    } catch (e) {
      setError(e.message);
    } finally {
      setProcessingTest(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Client-Side Audio Denoiser (48kHz, AudioWorklet)</h1>
      <p>Model Status: {modelReady ? "Loaded" : "Loading..."}</p>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!modelReady}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: isRecording ? "#dc3545" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          {isRecording ? "Stop Live Denoising" : "Start Live Denoising"}
        </button>
        <button
          onClick={handleProcessTestFrame}
          disabled={!modelReady || processingTest}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {processingTest ? "Processing..." : "Process Test Frame"}
        </button>
      </div>

      {isRecording && <p>🎤 Listening and denoising in real time with AudioWorklet</p>}

      {testOutput && (
        <div>
          <h3>Test Frame Output</h3>
          <p style={{ fontSize: "12px", maxWidth: "600px", wordBreak: "break-all" }}>{testOutput}</p>
        </div>
      )}

      <p style={{ fontSize: "12px", color: "#666" }}>
        Note: AudioWorklet is used for smooth low-latency playback. ONNX runs on the main thread, streamed
        from the worklet.
      </p>
    </div>
  );
}
