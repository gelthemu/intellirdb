"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="relative w-full h-full">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div
          onClick={!isFlipping ? handleCoinflip : undefined}
          className={cn(
            "relative w-32 aspect-square flex items-center justify-center font-bold",
            "border-4 border-double border-dark rounded-full overflow-hidden",
            isFlipping
              ? "cursor-default opacity-50 bg-dark/20"
              : "cursor-pointer bg-dark/40"
          )}
        >
          {isFlipping ? "Flipping..." : "Flip Coin"}
        </div>
        <div
          className={cn("mt-2", coinflipResult ? "opacity-100" : "opacity-0")}
        >
          {coinflipResult ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className={cn("text-lg font-bold")}
            >
              {coinflipResult}
            </motion.div>
          ) : (
            <div className="text-lg font-bold">{"Flip Coin"}</div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 text-center bg-transparent py-4">
          <span className="text-sm">Click the coin to flip it!</span>
        </div>
      </div>
    </div>
  );
}
