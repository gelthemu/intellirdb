"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useWindow } from "@/app/contexts/window";
import { useRadio } from "@/app/contexts/radio";
import { cn } from "@/lib/cn";

type CoinResult = "heads" | "tails" | null;

interface CoinStats {
  heads: number;
  tails: number;
}

const STORAGE_KEY = "v_coinflip";

const CoinFlip: React.FC = () => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<CoinResult>(null);
  const [flipCount, setFlipCount] = useState(0);
  const [stats, setStats] = useState<CoinStats>({
    heads: 0,
    tails: 0,
  });
  const { playBeep } = useRadio();
  const { setDialogTitle } = useWindow();

  useEffect(() => {
    try {
      const savedStats = localStorage.getItem(STORAGE_KEY);
      if (savedStats) {
        const parsed = JSON.parse(savedStats);
        setStats(parsed);
        setFlipCount(parsed.heads + parsed.tails);
      }
    } catch (error) {
      console.error("Error loading coin flip stats:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error("Error saving coin flip stats:", error);
    }
  }, [stats]);

  useEffect(() => {
    setDialogTitle("Coinflip");
  }, [setDialogTitle]);

  const flipCoin = useCallback(() => {
    if (isFlipping) return;

    setIsFlipping(true);
    setResult(null);
    playBeep();

    setTimeout(() => {
      const newFlipCount = flipCount + 1;
      let newResult: CoinResult;

      newResult = Math.random() < 0.5 ? "heads" : "tails";

      setResult(newResult);
      setFlipCount(newFlipCount);
      setStats((prev) => ({
        ...prev,
        [newResult as string]: prev[newResult as keyof typeof prev] + 1,
      }));
      setIsFlipping(false);
    }, 1500);
  }, [isFlipping, flipCount, playBeep]);

  const resetStats = useCallback(() => {
    const newStats = { heads: 0, tails: 0 };
    setStats(newStats);
    setFlipCount(0);
    setResult(null);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
    } catch (error) {
      console.error("Error resetting stats:", error);
    }
  }, []);

  return (
    <div className="relative w-full h-full">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div
          onClick={flipCoin}
          className={cn(
            "relative w-28 aspect-square flex items-center justify-center font-bold text-light",
            "border-none rounded-full overflow-hidden shadow-lg shadow-dark/60",
            isFlipping ? "cursor-default" : "cursor-pointer"
          )}
          style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
        >
          <motion.div
            className="w-full h-full flex items-center justify-center"
            style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
            animate={{
              rotateY: isFlipping ? 360 * 10 : result === "tails" ? 180 : 0,
            }}
            transition={{
              duration: isFlipping ? 1.5 : 0.3,
              ease: isFlipping ? "easeInOut" : "easeOut",
            }}
          >
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ rotateY: 0 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-20 aspect-square rounded-full flex items-center justify-center border-2 border-light bg-dark text-2xl">
                H
              </div>
            </motion.div>

            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div className="w-20 aspect-square rounded-full flex items-center justify-center border-2 border-light bg-dark text-2xl">
                T
              </div>
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: result && !isFlipping ? 1 : 0 }}
          className="my-4"
        >
          <span className="capitalize text-xl font-bold text-dark">
            {result}!
          </span>
        </motion.div>
        {flipCount > 0 && (
          <div className="w-32 p-2 text-center">
            <div className="grid grid-cols-2 gap-0 border-y border-dark">
              <div>
                <span>H: {stats.heads}</span>
              </div>
              <div className="border-l border-dark">
                <span>T: {stats.tails}</span>
              </div>
            </div>
            {flipCount > 12 && (
              <button
                onClick={resetStats}
                className="mt-2 px-3 py-1 text-xs bg-dark text-light hover:bg-dark/90 transition-colors"
              >
                Reset Stats
              </button>
            )}
          </div>
        )}
        <div className="w-full h-10 bg-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 text-center bg-transparent py-4">
          <span className="text-sm text-dark">
            {isFlipping ? "Flipping..." : "Click the coin to flip it!"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CoinFlip;
