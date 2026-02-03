"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useWindow } from "@/app/contexts/window";
import { motion } from "framer-motion";
import { fireConfetti } from "@/lib/confetti";

type CoinResult = "heads" | "tails" | null;

interface CoinStats {
  heads: number;
  tails: number;
}

const STORAGE_KEY = "__coinflip";
const MAX_SCORE = 15;
const GRAND_SLAM_SCORE = 7;

const getSecureRandom = (): boolean => {
  if (typeof window !== "undefined" && window.crypto) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % 2 === 0;
  }
  const time = Date.now();
  const random = Math.random();
  const combined = (time * random * Math.random()) % 1;
  return combined < 0.5;
};

const CoinFlip: React.FC = () => {
  const { setDialogTitle } = useWindow();
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<CoinResult>(null);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [flipCount, setFlipCount] = useState(0);
  const [stats, setStats] = useState<CoinStats>({ heads: 0, tails: 0 });
  const [isGrandSlam, setIsGrandSlam] = useState(false);

  useEffect(() => {
    setDialogTitle("Coin Flip");
  }, [setDialogTitle]);

  useEffect(() => {
    try {
      const savedStats = localStorage.getItem(STORAGE_KEY);
      if (savedStats) {
        const parsed = JSON.parse(savedStats);
        setStats(parsed);
        setFlipCount(parsed.heads + parsed.tails);

        if (
          parsed.heads === GRAND_SLAM_SCORE &&
          parsed.tails === GRAND_SLAM_SCORE
        ) {
          setIsGrandSlam(true);
        }

        if (parsed.heads + parsed.tails === MAX_SCORE) {
          const winner = parsed.heads > parsed.tails ? "Heads" : "Tails";
          setGameResult(`${winner} Win`);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {}
  }, [stats]);

  const flipCoin = useCallback(() => {
    if (isFlipping || flipCount >= MAX_SCORE) return;

    setIsFlipping(true);
    setResult(null);

    setTimeout(() => {
      const newResult: CoinResult = getSecureRandom() ? "heads" : "tails";
      const newFlipCount = flipCount + 1;

      setResult(newResult);
      setFlipCount(newFlipCount);

      const newStats = {
        ...stats,
        [newResult]: stats[newResult as keyof CoinStats] + 1,
      };
      setStats(newStats);

      // Check if score is now 7-7 (Grand Slam situation)
      if (
        newStats.heads === GRAND_SLAM_SCORE &&
        newStats.tails === GRAND_SLAM_SCORE
      ) {
        setIsGrandSlam(true);
      }

      if (newFlipCount === MAX_SCORE) {
        const winner = newStats.heads > newStats.tails ? "Heads" : "Tails";
        setGameResult(`${winner} Win`);

        setTimeout(() => {
          fireConfetti();
        }, 100);
      }

      setIsFlipping(false);
    }, 1500);
  }, [isFlipping, flipCount, stats]);

  const resetStats = useCallback(() => {
    const newStats = { heads: 0, tails: 0 };
    setStats(newStats);
    setFlipCount(0);
    setResult(null);
    setGameResult(null);
    setIsGrandSlam(false);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
    } catch {}
  }, []);

  const getStatusMessage = () => {
    if (gameResult) {
      return "Reset Scores to resume...";
    }
    if (isGrandSlam && !isFlipping) {
      return "This last flip is a GRAND SLAM win...";
    }
    if (isFlipping) {
      return "Flipping...";
    }
    return "Click the coin to flip it!";
  };

  const gameComplete = flipCount >= MAX_SCORE;

  return (
    <div className="relative w-full h-full p-2">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div
          onClick={flipCoin}
          className={`relative w-28 aspect-square flex items-center justify-center font-bold font-var text-light border-none rounded-full overflow-hidden shadow-lg shadow-dark/60 transition-opacity duration-300 ${
            gameComplete ? "opacity-60 cursor-default" : "cursor-pointer"
          }`}
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
              whileHover={!gameComplete ? { scale: 1.05 } : {}}
            >
              <div className="w-20 aspect-square rounded-full flex items-center justify-center border-2 border-light bg-dark text-2xl">
                {gameResult ? "🎉" : "H"}
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
                {gameResult ? "🎉" : "T"}
              </div>
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: gameResult || (result && !isFlipping) ? 1 : 0 }}
          className="my-4"
        >
          <span className="result capitalize text-xl font-bold font-var text-dark">
            {gameResult || (result ? `${result}` : "")}!
          </span>
        </motion.div>
        <div className="w-48 p-2 text-center">
          <div className="flex flex-row items-center justify-center text-sm mb-1">
            <div>
              <span className="text-sm opacity-60">
                ({MAX_SCORE}-point tiebreak)
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-0 border-y border-dark text-sm text-center">
            <div className="border-r border-dark py-1 flex items-center justify-center flex-col">
              <div className="text-sm opacity-90">Heads</div>
              <span className="text-lg font-bold font-var">{stats.heads}</span>
            </div>
            <div className="py-1 flex items-center justify-center flex-col">
              <div className="text-sm opacity-90">Tails</div>
              <span className="text-lg font-bold font-var">{stats.tails}</span>
            </div>
          </div>
          <button
            onClick={resetStats}
            className="mt-2 px-3 py-1 text-xs bg-dark text-light hover:bg-dark/90 disabled:opacity-60 transition-all duration-200 ease-in-out"
            disabled={isFlipping || !gameComplete}
          >
            Reset Scores
          </button>
        </div>
        <div className="w-full h-10 bg-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 text-center bg-transparent py-4">
          <span className="notes text-sm text-dark">{getStatusMessage()}</span>
        </div>
      </div>
    </div>
  );
};

export default CoinFlip;
