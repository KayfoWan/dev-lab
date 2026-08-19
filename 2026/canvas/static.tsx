"use client";
import Style from "./rainbowParticleBackdrop.module.css";
import { useEffect, useRef } from "react";

export default function RainbowParticleBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    if(!ctx) return;

    const width = canvas.width = canvas.clientWidth;
    // const width = canvas.width = 250;
    const height = canvas.height = canvas.clientHeight;
    // const height = canvas.height = 150;

    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    let animationFrameId: number;

    const animate = () => {
      for(let y = 0; y <= height; y++) {
        for(let x = 0; x <= width; x++) {
          const index = (y * width + x) * 4;

          data[index + 0] = Math.floor(Math.random() * 256);
          data[index + 1] = Math.floor(Math.random() * 256);
          data[index + 2] = Math.floor(Math.random() * 256);
          data[index + 3] = 255;
        }
      }
      
      ctx.putImageData(imgData, 0, 0);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return(() => {
      cancelAnimationFrame(animationFrameId);
    });
  }, []);
  return(
    <canvas ref={canvasRef} className={Style.container}></canvas>
  )
}
