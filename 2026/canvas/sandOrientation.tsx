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

    type Grain = [number, number, number] | null;
    let grid: Grain[][] = Array.from({length: height}, () => Array(width).fill(null));

    let hue = 0;

    const isEmpty = (x: number, y: number, currentGrid: Grain[][]) => {
      if(x < 0 || x >= width || y < 0 || y >= height) return false;
      return currentGrid[y][x] == null;
    };

    const getRainbowColor = (h: number): [number, number, number] => {
      const s = 0.9, l = 0.6;
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs(((h/60) % 2) - 1));
      const m = l - c / 2;
      let r = 0, g = 0, b = 0;

      if(h < 60) {
        r = c;
        g = x;
      } else if(h < 120) {
        r = x;
        g = c;
      } else if(h < 180) {
        g = c;
        b = x;
      } else if(h < 240) {
        g = x;
        b = c;
      } else if(h < 300) {
        r = x;
        b = c;
      } else {
        r = c;
        b = x;
      }

      return [
        Math.floor((r + m) * 255),
        Math.floor((g + m) * 255),
        Math.floor((b + m) * 255),
      ];
    };

    const animate = () => {
      
      hue = (hue + 1) % 360;
      const sandColor = getRainbowColor(hue);
      for(let offset = 0; offset < 5; offset++) {
        if(Math.random() > 0.3) {
          grid[0][20 + offset] = sandColor;
        }
      }

      const nextGrid: Grain[][] = Array.from({length: height}, () => Array(width).fill(null));

      for(let y = height - 1; y >= 0; y--) {
        for(let x = 0; x < width; x++) {
          const current = grid[y][x];
          if(!current) continue;

          if(y === height - 1) {
            nextGrid[y][x] = current;
            continue;
          }

          let gx = 0;
          let gy = 1;

          const handleDeviceOrientation = (e) => {
            if(e.gamma === null || e.beta === null) return;

            gx = Math.max(-1, Math.min(1, e.gamma/45));
            gy = Math.max(-1, Math.min(1, e.beta/45));
          };

          window.addEventListener("deviceorientation", handleDeviceOrientation);
          const down = isEmpty(Math.round(gx), Math.round(gy) + 1, grid) && isEmpty(Math.round(gx), Math.round(gy) + 1, nextGrid);

          const dir = Math.random() < 0.5 ? 1 : -1;
          const diag1 = isEmpty(Math.round(gx) + dir, Math.round(gy) + 1, grid) && isEmpty(Math.round(gx) + dir, Math.round(gy) + 1, nextGrid);
          const diag2 = isEmpty(Math.round(gx) - dir, Math.round(gy) + 1, grid) && isEmpty(Math.round(gx) - dir, Math.round(gy) + 1, nextGrid);

          if(down) {
            nextGrid[Math.round(gy) + 1][Math.round(gx)] = current;
          } else if(diag1) {
            nextGrid[Math.round(gy) + 1][Math.round(gx) + dir] = current;
          } else if(diag2) {
            nextGrid[Math.round(gy) + 1][Math.round(gx) - dir] = current;
          } else {
            nextGrid[y][x] = current;
          }
        }
      }

      grid = nextGrid;

      for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {
          const index = (y * width + x) * 4;
          const grain = grid[y][x];

          if(grain) {
            data[index + 0] = grain[0];
            data[index + 1] = grain[1];
            data[index + 2] = grain[2];
            data[index + 3] = 255;
          } else {
            data[index + 0] = 0;
            data[index + 1] = 0;
            data[index + 2] = 0;
            data[index + 3] = 0;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return(() => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    });
  }, []);
  return(
    <canvas ref={canvasRef} className={Style.container}></canvas>
  )
}
