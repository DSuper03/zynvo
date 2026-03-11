"use client";

import { gsap } from "gsap";
import React, { useEffect, useRef } from "react";
import { Rock_Salt } from "next/font/google";
import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "@/context/authContex";
const rockSalt = Rock_Salt({
  subsets: ["latin"],
  weight: ["400"],
});

interface CrowdCanvasProps {
  src: string;
  rows?: number;
  cols?: number;
}

const CrowdCanvas = ({ src, rows = 15, cols = 7 }: CrowdCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const config = {
      src,
      rows,
      cols,
    };

    // UTILS
    const randomRange = (min: number, max: number) =>
      min + Math.random() * (max - min);
    const randomIndex = (array: any[]) => randomRange(0, array.length) | 0;
    const removeFromArray = (array: any[], i: number) => array.splice(i, 1)[0];
    const removeItemFromArray = (array: any[], item: any) =>
      removeFromArray(array, array.indexOf(item));
    const removeRandomFromArray = (array: any[]) =>
      removeFromArray(array, randomIndex(array));
    const getRandomFromArray = (array: any[]) => array[randomIndex(array) | 0];

    // TWEEN FACTORIES
    const resetPeep = ({ stage, peep }: { stage: any; peep: any }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const heightRatio = Math.min(1, stage.height / 380);
      const offsetY =
        (100 - 250 * gsap.parseEase("power2.in")(Math.random())) * heightRatio;
      const startY = stage.height - peep.height + offsetY;
      let startX: number;
      let endX: number;

      if (direction === 1) {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return {
        startX,
        startY,
        endX,
      };
    };

    const normalWalk = ({ peep, props }: { peep: any; props: any }) => {
      const { startX, startY, endX } = props;
      const xDuration = 10;
      const yDuration = 0.25;

      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.5, 1.5));
      tl.to(
        peep,
        {
          duration: xDuration,
          x: endX,
          ease: "none",
        },
        0,
      );
      tl.to(
        peep,
        {
          duration: yDuration,
          repeat: xDuration / yDuration,
          yoyo: true,
          y: startY - 10,
        },
        0,
      );

      return tl;
    };

    const walks = [normalWalk];

    // TYPES
    type Peep = {
      image: HTMLImageElement;
      rect: number[];
      naturalRect: number[];
      width: number;
      height: number;
      drawArgs: any[];
      x: number;
      y: number;
      anchorY: number;
      scaleX: number;
      walk: any;
      setRect: (rect: number[], scale?: number) => void;
      render: (ctx: CanvasRenderingContext2D) => void;
    };

    // FACTORY FUNCTIONS
    const createPeep = ({
      image,
      rect,
    }: {
      image: HTMLImageElement;
      rect: number[];
    }): Peep => {
      const peep: Peep = {
        image,
        rect: [],
        naturalRect: [],
        width: 0,
        height: 0,
        drawArgs: [],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        setRect: (rect: number[], scale: number = 1) => {
          peep.naturalRect = rect;
          peep.rect = rect;
          peep.width = rect[2] * scale;
          peep.height = rect[3] * scale;
          peep.drawArgs = [peep.image, ...rect, 0, 0, peep.width, peep.height];
        },
        render: (ctx: CanvasRenderingContext2D) => {
          ctx.save();
          ctx.translate(peep.x, peep.y);
          ctx.scale(peep.scaleX, 1);
          ctx.drawImage(
            peep.image,
            peep.naturalRect[0],
            peep.naturalRect[1],
            peep.naturalRect[2],
            peep.naturalRect[3],
            0,
            0,
            peep.width,
            peep.height,
          );
          ctx.restore();
        },
      };

      peep.setRect(rect);
      return peep;
    };

    // MAIN
    const img = document.createElement("img");
    const stage = {
      width: 0,
      height: 0,
    };

    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];

    const createPeeps = () => {
      const { rows, cols } = config;
      const { naturalWidth: width, naturalHeight: height } = img;
      const total = rows * cols;
      const rectWidth = width / rows;
      const rectHeight = height / cols;

      for (let i = 0; i < total; i++) {
        allPeeps.push(
          createPeep({
            image: img,
            rect: [
              (i % rows) * rectWidth,
              ((i / rows) | 0) * rectHeight,
              rectWidth,
              rectHeight,
            ],
          }),
        );
      }
    };

    const initCrowd = () => {
      while (availablePeeps.length) {
        addPeepToCrowd().walk.progress(Math.random());
      }
    };

    const addPeepToCrowd = () => {
      const peep = removeRandomFromArray(availablePeeps);
      const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({
          peep,
          stage,
        }),
      }).eventCallback("onComplete", () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;

      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);

      return peep;
    };

    const removePeepFromCrowd = (peep: Peep) => {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    let rafId: number | null = null;
    let isVisible = true;

    const render = () => {
      if (!canvas || !isVisible) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const dpr = window.devicePixelRatio || 1;
      ctx.save();
      ctx.scale(dpr, dpr);

      crowd.forEach((peep) => {
        peep.render(ctx);
      });

      ctx.restore();

      if (isVisible) {
        rafId = requestAnimationFrame(render);
      }
    };

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      stage.width = canvas.clientWidth || canvas.offsetWidth || 300;
      stage.height = canvas.clientHeight || canvas.offsetHeight || 200;
      canvas.width = stage.width * dpr;
      canvas.height = stage.height * dpr;

      const isMobile = stage.width < 640;
      const baseHeight = isMobile ? 280 : 380;
      const baseFactor = Math.min(stage.width / 640, stage.height / baseHeight);

      // FIX: bumped mobile min from 0.18→0.25 and max from 0.45→0.5
      const scaleFactor = isMobile
        ? Math.max(0.25, Math.min(0.5, baseFactor))
        : Math.max(0.45, Math.min(1, baseFactor));

      allPeeps.forEach((peep) => {
        peep.setRect(peep.naturalRect, scaleFactor);
      });

      crowd.forEach((peep) => {
        peep.walk.kill();
      });

      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      initCrowd();
    };

    const init = () => {
      createPeeps();
      resize();
      rafId = requestAnimationFrame(render);
    };

    img.onload = init;
    img.src = config.src;

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => resize(), 150);
    };

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(canvas);
    }

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && !rafId) {
        rafId = requestAnimationFrame(render);
      } else if (!isVisible && rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      resizeObserver?.disconnect();
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      clearTimeout(resizeTimeout);
      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });
    };
  }, [src, rows, cols]);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full block"
      style={{ display: "block" }}
    />
  );
};

const Skiper39 = () => {
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const { user, login, hardLogout } = useAuth();

  useEffect(() => {
    if (!headlineRef.current) return;

    gsap.fromTo(
      headlineRef.current,
      { y: 120, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        delay: 0.4,
      },
    );
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-yellow-300 text-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.5),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(234,179,8,0.6),_transparent_60%)] opacity-70" />

      {/* FIX: balanced padding for comfortable spacing */}
      <div
        ref={headlineRef}
        className="relative z-10 flex flex-col items-center justify-center px-4 pt-12 pb-6 text-center text-black sm:pb-24 md:pb-28"
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <p
            className={`${rockSalt.className} tracking-tight text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight`}
          >
            Zynvo Social
          </p>
          <p className="text-xs sm:text-base md:text-lg lg:text-2xl font-mono font-bold tracking-wide">
            Your one place for campus, clubs and events.
          </p>
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 sm:mt-6">
            {user ? (
              <div className="flex flex-col items-center gap-4">
                <p className="font-mono text-sm sm:text-base font-bold tracking-wide">
                  👋 Hey there,{" "}
                  <span className="underline underline-offset-4 decoration-black/40">
                    {user.name?.split(" ")[0] ?? "there"}
                  </span>
                  ! Ready to explore?
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={login}
                    className="bg-black p-0 rounded-full w-12 h-12 flex items-center justify-center transition-all hover:scale-105 shadow-lg hover:shadow-black/40"
                  >
                    <img
                      src={user.pfp}
                      alt="profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </Button>
                  <button
                    onClick={hardLogout}
                    className="rounded-full bg-black px-5 py-2 text-xs sm:text-sm font-semibold text-yellow-300 hover:bg-black/80 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button className="rounded-full bg-black px-6 py-2 text-xs sm:text-sm font-semibold text-yellow-300 hover:bg-black/90 transition-colors">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    variant="outline"
                    className="rounded-full border-2 border-black bg-yellow-200/80 px-6 py-2 text-xs sm:text-sm font-semibold text-black hover:bg-yellow-300 transition-colors"
                  >
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* FIX: balanced canvas height */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{ height: "clamp(200px, 42vh, 55vh)" }}
      >
        {/* FIX: balanced gradient height */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-yellow-300 to-transparent z-10 pointer-events-none" />
        <CrowdCanvas
          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/open-peeps-sheet.png"
          rows={15}
          cols={7}
        />
      </div>
    </div>
  );
};

export { CrowdCanvas, Skiper39 };

/**
 * Skiper 39 Canvas_Landing_004 — React + Canvas
 * Inspired by and adapted from https://codepen.io/zadvorsky/pen/xxwbBQV
 * illustration by https://www.openpeeps.com/
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 * These animations aren't associated with the codepen.io . They're independent recreations meant to study interaction design
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.in
 * Twitter: https://x.com/Gur__vi
 */