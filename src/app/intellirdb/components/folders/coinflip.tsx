"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

type CoinResult = "heads" | "tails" | null;

interface CoinStats {
  heads: number;
  tails: number;
}

interface GameHistory {
  headsWins: number;
  tailsWins: number;
}

const STORAGE_KEY = "coinflip";
const HISTORY_KEY = "coinflip_history";
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
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<CoinResult>(null);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [flipCount, setFlipCount] = useState(0);
  const [stats, setStats] = useState<CoinStats>({ heads: 0, tails: 0 });
  const [history, setHistory] = useState<GameHistory>({
    headsWins: 0,
    tailsWins: 0,
  });
  const [isGrandSlam, setIsGrandSlam] = useState(false);

  useEffect(() => {
    try {
      const savedStats = localStorage.getItem(STORAGE_KEY);
      if (savedStats) {
        const parsed = JSON.parse(savedStats);
        setStats(parsed);
        setFlipCount(parsed.heads + parsed.tails);

        if (parsed.heads + parsed.tails === MAX_SCORE) {
          const winner = parsed.heads > parsed.tails ? "Heads" : "Tails";
          setGameResult(`${winner} Win`);
        }
      }

      const savedHistory = localStorage.getItem(HISTORY_KEY);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {}
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {}
  }, [history]);

  const updateHistory = useCallback((winner: "heads" | "tails") => {
    setHistory((prev) => {
      const newHistory = { ...prev };

      if (winner === "heads") {
        newHistory.headsWins += 1;
      } else {
        newHistory.tailsWins += 1;
      }

      return newHistory;
    });
  }, []);

  const flipCoin = useCallback(() => {
    if (isFlipping || flipCount >= MAX_SCORE) return;

    if (stats.heads === GRAND_SLAM_SCORE && stats.tails === GRAND_SLAM_SCORE) {
      setIsGrandSlam(true);
    }

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

      if (newFlipCount === MAX_SCORE) {
        const winner = newStats.heads > newStats.tails ? "Heads" : "Tails";
        setGameResult(`${winner} Win`);
        updateHistory(winner.toLowerCase() as "heads" | "tails");
      }

      setIsFlipping(false);
      setIsGrandSlam(false);
    }, 1500);
  }, [isFlipping, flipCount, stats, updateHistory]);

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
      return "This last flip is a Grand Slam win...";
    }
    if (isFlipping) {
      return "Flipping...";
    }
    return "Click the coin to flip it!";
  };

  const gameComplete = flipCount >= MAX_SCORE;

  return (
    <div className="relative w-full h-full">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div
          onClick={flipCoin}
          className={`relative w-28 aspect-square flex items-center justify-center font-bold text-light border-none rounded-full overflow-hidden shadow-lg shadow-dark/60 transition-opacity duration-300 ${
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
          <span className="result capitalize text-xl font-bold text-dark">
            {gameResult || (result ? `${result}` : "")}!
          </span>
        </motion.div>
        <div className="w-64 p-2 text-center">
          <div className="flex flex-row items-center justify-center space-x-2 text-sm mb-1">
            <div>
              H: <strong className="font-semibold">{stats.heads}</strong> - T:{" "}
              <strong className="bold">{stats.tails}</strong>
            </div>
            <div>
              <span className="text-sm opacity-60">
                ({MAX_SCORE}-point tiebreak)
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-0 border-y border-dark text-sm text-center">
            <div className="flex items-center justify-center flex-col">
              <div className="text-sm opacity-90">Total</div>
            </div>
            <div className="border-x border-dark py-px flex items-center justify-center flex-col">
              <div className="text-xs opacity-90">Heads</div>
              <span className="font-bold">{history.headsWins}</span>
            </div>
            <div className="py-px flex items-center justify-center flex-col">
              <div className="text-xs opacity-90">Tails</div>
              <span className="font-bold">{history.tailsWins}</span>
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
