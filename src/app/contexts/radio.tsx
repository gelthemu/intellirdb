"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { Station } from "@/types";
import { trackStationPlay } from "@/lib/analytics";

type PlayState = "idle" | "loading" | "playing" | "paused" | "error";

interface RadioContextType {
  currentStation: Station | null;
  playState: PlayState;
  playStation: (station: Station) => Promise<void>;
  togglePlayPause: () => void;
  stop: () => void;
  playBeep: () => void;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export function RadioProvider({ children }: { children: React.ReactNode }) {
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [playState, setPlayState] = useState<PlayState>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous";
    }

    if (!audioRef.current) return;

    const handlePlay = () => {
      setPlayState("playing");

      const event = new CustomEvent("radioStateChange", {
        detail: { type: "start", isPlaying: true },
      });
      window.dispatchEvent(event);
    };

    const handlePause = () => {
      setPlayState((prev) => (prev === "playing" ? "paused" : prev));
    };

    const handleError = () => {
      setPlayState("error");
    };

    const handleEnded = () => {
      setPlayState("idle");
    };

    const handleLoadStart = () => {
      setPlayState("loading");
    };

    audioRef.current.addEventListener("play", handlePlay);
    audioRef.current.addEventListener("pause", handlePause);
    audioRef.current.addEventListener("error", handleError);
    audioRef.current.addEventListener("ended", handleEnded);
    audioRef.current.addEventListener("loadstart", handleLoadStart);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("play", handlePlay);
        audioRef.current.removeEventListener("pause", handlePause);
        audioRef.current.removeEventListener("error", handleError);
        audioRef.current.removeEventListener("ended", handleEnded);
        audioRef.current.removeEventListener("loadstart", handleLoadStart);
      }
    };
  }, []);

  useEffect(() => {
    const handlePreviewStart = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (
        customEvent.detail.type === "start" &&
        audioRef.current &&
        playState === "playing"
      ) {
        audioRef.current.pause();
        setPlayState("paused");
      }
    };

    window.addEventListener("previewStateChange", handlePreviewStart);
    return () => {
      window.removeEventListener("previewStateChange", handlePreviewStart);
    };
  }, [playState]);

  const playStation = useCallback(
    async (station: Station) => {
      if (!audioRef.current) return;

      try {
        if (currentStation && currentStation.id !== station.id) {
          audioRef.current.pause();
          audioRef.current.src = "";
        }

        setCurrentStation(station);
        setPlayState("loading");

        audioRef.current.src = station.url;
        audioRef.current.load();

        await audioRef.current.play();

        try {
          await trackStationPlay(station.id);
        } catch {
          throw new Error("Analytics tracking failed");
        }
        setPlayState("playing");
      } catch {
        setPlayState("error");
        throw new Error("Playback failed");
      }
    },
    [currentStation]
  );

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !currentStation) return;

    if (playState === "playing") {
      audioRef.current.pause();
    } else if (playState === "paused") {
      audioRef.current.play().catch(() => {
        setPlayState("error");
        throw new Error("Playback resume failed");
      });
    }
  }, [playState, currentStation]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setCurrentStation(null);
    setPlayState("idle");
  }, []);

  const playBeep = useCallback(() => {
    try {
      const ctx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = "square";
      oscillator.frequency.value = 500;
      gainNode.gain.value = 0.1;

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.1);

      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (e) {}
  }, []);

  return (
    <RadioContext.Provider
      value={{
        currentStation,
        playState,
        playStation,
        togglePlayPause,
        stop,
        playBeep,
      }}
    >
      {children}
    </RadioContext.Provider>
  );
}

export function useRadio() {
  const context = useContext(RadioContext);
  if (context === undefined) {
    throw new Error("useRadio must be used within a RadioProvider");
  }
  return context;
}
