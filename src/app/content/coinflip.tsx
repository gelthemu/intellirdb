"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/cn";

interface CoinflipProps {
  isOpen?: boolean;
}

export default function Coinflip({ isOpen = true }: CoinflipProps) {
  const [coinflipResult, setCoinflipResult] = useState<string | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleCoinflip = () => {
    setIsFlipping(true);
    setCoinflipResult(null);

    setTimeout(() => {
      const result = Math.random() < 0.5 ? "Heads" : "Tails";
      setCoinflipResult(result);
      setIsFlipping(false);
    }, 4000);
  };

  if (!isOpen) return null;

  return (
    <div className="relative w-full h-full">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <motion.div
          onClick={!isFlipping ? handleCoinflip : undefined}
          className={cn(
            "relative w-28 aspect-square flex items-center justify-center font-bold text-white",
            "border-none rounded-full overflow-hidden shadow-lg shadow-dark/60",
            isFlipping
              ? "cursor-default"
              : "cursor-pointer hover:scale-105 transition-transform"
          )}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
          animate={
            isFlipping
              ? {
                  rotateX: [0, 1800, 3600, 5400, 7200],
                  rotateY: [0, 1440, 2880, 4320, 5760],
                  rotateZ: [0, 360, 720, 1080, 1440],
                  scale: [1, 1.075, 0.5375, 1.075, 1],
                  y: [0, -50, 0, -50, 0],
                }
              : {
                  rotateX: 180,
                  rotateY: 0,
                  rotateZ: 0,
                  scale: 1,
                  y: 0,
                }
          }
          transition={
            isFlipping
              ? {
                  duration: 4,
                  ease: [0.43, 0.13, 0.23, 0.96],
                  times: [0, 0.25, 0.5, 0.75, 1],
                }
              : {
                  duration: 0.5,
                  ease: "easeOut",
                }
          }
        >
          <div className="w-full aspect-square flex items-center justify-center">
            <Image
              src="/img-coinflip.png"
              alt="Coinflip"
              width={1500}
              height={1500}
              unoptimized
              className="w-full h-full object-contain intelli-none"
              style={{
                imageRendering: "pixelated",
                transform: "rotateX(180deg)",
              }}
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: coinflipResult && !isFlipping ? 1 : 0 }}
          className="mt-6"
        >
          {coinflipResult && (
            <motion.div
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl font-bold text-dark"
            >
              {coinflipResult}!
            </motion.div>
          )}
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 text-center bg-transparent py-4">
          <span className="text-sm text-dark">
            {isFlipping ? "Flipping..." : "Click the coin to flip it!"}
          </span>
        </div>
      </div>
    </div>
  );
}
