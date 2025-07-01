// WaveformCanvas.jsx
import React, { useRef, useEffect } from "react";

export default function WaveformCanvas({ data, height = 120, color = "#1f8ef1" }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;

    const ctx = canvas.getContext("2d");

    function draw() {
      const width = containerRef.current.clientWidth;
      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);

      // Background with subtle gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, "#f7f9fc");
      bgGradient.addColorStop(1, "#e3e9f5");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle horizontal grid lines
      ctx.strokeStyle = "#cbd6e4";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= 4; i++) {
        const y = (height / 4) * i + 0.5;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Draw midline
      ctx.strokeStyle = "#9bb1cc";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, height / 2 + 0.5);
      ctx.lineTo(width, height / 2 + 0.5);
      ctx.stroke();

      // Draw waveform
      ctx.lineWidth = 2.5;
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, "#a0c4ff");
      ctx.strokeStyle = gradient;
      ctx.fillStyle = gradient;
      ctx.beginPath();

      const step = Math.max(1, Math.floor(data.length / width));
      let yPrev = height / 2;

      // Amplify waveform vertically for visibility
      const amplitudeScale = 2.5;

      for (let x = 0; x < width; x++) {
        const sliceStart = x * step;
        let sum = 0,
          count = 0;
        for (let j = 0; j < step; j++) {
          if (sliceStart + j < data.length) {
            sum += data[sliceStart + j];
            count++;
          }
        }
        const avg = count > 0 ? sum / count : 0;
        let y = height / 2 - avg * (height / 2) * amplitudeScale;
        y = Math.min(height - 4, Math.max(4, y));

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          const cx = (x + (x - 1)) / 2;
          ctx.quadraticCurveTo(x - 1, yPrev, cx, (yPrev + y) / 2);
        }
        yPrev = y;
      }

      ctx.lineTo(width, height / 2);
      ctx.lineTo(0, height / 2);
      ctx.closePath();

      ctx.fill();
      ctx.stroke();
    }

    draw();

    const resizeObserver = new ResizeObserver(() => {
      draw();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [data, color, height]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: "700px",
        margin: "0 auto",
        padding: "14px 0",
        backgroundColor: "#f7f9fc",
        borderRadius: 16,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.07)",
        userSelect: "none",
        cursor: "default",
        transition: "box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 14px 40px rgba(0,0,0,0.15)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.07)")}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: height,
          display: "block",
          borderRadius: 12,
        }}
      />
    </div>
  );
}
