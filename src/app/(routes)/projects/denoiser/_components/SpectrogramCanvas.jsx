import React, { useEffect, useRef } from "react";

function hannWindow(length) {
  const window = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    window[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (length - 1)));
  }
  return window;
}

function fft(input) {
  // Basic FFT implementation using Web Audio API's AnalyserNode is easier,
  // but for a frame-sized 480 sample FFT, we can do a simple FFT library or naive DFT.
  // For demo purposes, we'll use a naive DFT for one frame.

  const N = input.length;
  const real = new Float32Array(N);
  const imag = new Float32Array(N);

  for (let k = 0; k < N; k++) {
    let sumReal = 0;
    let sumImag = 0;
    for (let n = 0; n < N; n++) {
      const angle = (2 * Math.PI * k * n) / N;
      sumReal += input[n] * Math.cos(angle);
      sumImag -= input[n] * Math.sin(angle);
    }
    real[k] = sumReal;
    imag[k] = sumImag;
  }

  const magnitudes = new Float32Array(N / 2);
  for (let i = 0; i < N / 2; i++) {
    magnitudes[i] = Math.sqrt(real[i] ** 2 + imag[i] ** 2);
  }
  return magnitudes;
}

export default function SpectrogramCanvas({ data, width = 480, height = 128, color = "#2ca86c" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Parameters for spectrogram calculation
    const frameSize = 256; // smaller window for better time resolution
    const hopSize = 64;
    const windowFunc = hannWindow(frameSize);

    const numFrames = Math.floor((data.length - frameSize) / hopSize) + 1;

    // Prepare 2D array to hold magnitudes [time][freq]
    let spectrogram = [];
    for (let i = 0; i < numFrames; i++) {
      const start = i * hopSize;
      let segment = data.slice(start, start + frameSize);
      if (segment.length < frameSize) {
        // zero-pad
        segment = Float32Array.from([...segment, ...new Float32Array(frameSize - segment.length)]);
      }
      // Apply window function
      for (let j = 0; j < frameSize; j++) {
        segment[j] *= windowFunc[j];
      }
      const mags = fft(segment);
      spectrogram.push(mags);
    }

    // Normalize magnitudes for display (log scale)
    let maxMag = 0;
    for (const frame of spectrogram) {
      for (const mag of frame) {
        if (mag > maxMag) maxMag = mag;
      }
    }
    maxMag = maxMag || 1;

    // Draw spectrogram (time on X, freq on Y)
    // We'll map time frames to width, frequency bins to height
    for (let x = 0; x < spectrogram.length; x++) {
      const frame = spectrogram[x];
      for (let y = 0; y < frame.length; y++) {
        const mag = frame[y] / maxMag;
        // Convert mag to a color intensity
        const intensity = Math.min(1, Math.max(0, mag));
        const alpha = intensity;
        ctx.fillStyle = `rgba(44, 168, 108, ${alpha})`; // greenish color with varying alpha
        // y = 0 is lowest freq, so invert to draw bottom up
        ctx.fillRect(
          (x * width) / spectrogram.length,
          height - (y * height) / frame.length,
          width / spectrogram.length,
          height / frame.length
        );
      }
    }
  }, [data, width, height, color]);

  return <canvas ref={canvasRef} width={width} height={height} style={{ width: "100%", maxWidth: width }} />;
}
