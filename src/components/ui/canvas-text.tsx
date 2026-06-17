"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type CanvasTextProps = {
  text: string;
  className?: string;
  backgroundClassName?: string;
  colors?: string[];
  lineGap?: number;
  animationDuration?: number;
};

const defaultColors = [
  "rgba(0, 0, 0, 1)",
  "rgba(0, 0, 0, 0.85)",
  "rgba(0, 0, 0, 0.7)",
  "rgba(0, 0, 0, 0.55)",
  "rgba(0, 0, 0, 0.4)",
];

export function CanvasText({
  text,
  className,
  backgroundClassName,
  colors = defaultColors,
  lineGap = 4,
  animationDuration = 20,
}: CanvasTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const render = () => {
      const rect = wrapper.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        rafId = requestAnimationFrame(render);
        return;
      }

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      const lineHeight = Math.max(lineGap, rect.height / colors.length);
      const progress =
        ((performance.now() / 1000) % animationDuration) / animationDuration;

      colors.forEach((color, index) => {
        const offset = (progress * rect.width * 2 + index * lineHeight) % (rect.width * 2);
        ctx.fillStyle = color;
        ctx.fillRect(offset - rect.width, index * lineHeight, rect.width, lineHeight);
        ctx.fillRect(offset, index * lineHeight, rect.width, lineHeight);
      });

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(rafId);
  }, [animationDuration, colors, lineGap]);

  return (
    <span
      ref={wrapperRef}
      className={cn(
        "relative inline-block overflow-hidden rounded-xl px-3 py-1 text-white",
        backgroundClassName,
        className,
      )}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      <span className="relative z-10 whitespace-nowrap">{text}</span>
    </span>
  );
}
