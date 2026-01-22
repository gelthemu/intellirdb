"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";
import { audioManager } from "@/lib/audio-manager";

type PlayState = "loading" | "playing" | "paused" | "error";

interface RadioContextType {
  playState: PlayState;
  currentStation: string | null;
  error: string | null;
  play: (stationUrl: string) => void;
  pause: () => void;
  stop: () => void;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export function RadioProvider({ children }: { children: ReactNode }) {
  const [playState, setPlayState] = useState<PlayState>("paused");
  const [currentStation, setCurrentStation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getAudioElement = (): HTMLAudioElement | null => {
    if (audioRef.current) return audioRef.current;

    if (typeof window === "undefined") return null;

    const audio = document.getElementById("radio-player") as HTMLAudioElement;
    if (audio instanceof HTMLAudioElement) {
      audioRef.current = audio;
      return audio;
    }

    return null;
  };

  useEffect(() => {
    const audio = getAudioElement();
    if (!audio) return;

    const handleLoadStart = () => {
      setPlayState("loading");
      setError(null);
    };

    const handleCanPlay = () => {
      if (playState === "loading") {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
        loadingTimeoutRef.current = setTimeout(() => {
          setPlayState("playing");
        }, 1500);
      }
    };

    const handlePlaying = () => {
      if (playState !== "loading") {
        setPlayState("playing");
      }
    };

    const handlePause = () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      setPlayState("paused");
    };

    const handleError = () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      setPlayState("error");
      setError(
        audio.error?.message || "An error occurred while loading the audio",
      );
    };

    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
    };
  }, [playState]);

  useEffect(() => {
    const unsubscribe = audioManager.subscribe((playingType) => {
      if (playingType !== "radio" && playingType !== null) {
        const audio = getAudioElement();
        if (audio && !audio.paused) {
          audio.pause();
        }
      }
    });

    return () => {
      unsubscribe();
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  const play = (stationUrl: string) => {
    const audio = getAudioElement();

    if (!audio) {
      console.error("Radio audio element not found or invalid");
      setPlayState("error");
      setError("Audio player not initialized");
      return;
    }

    audioManager.setPlaying("radio");
    setPlayState("loading");
    setError(null);
    audio.src = stationUrl;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
        setPlayState("error");
        setError(err.message || "Failed to play audio");
      });
    }

    setCurrentStation(stationUrl);
  };

  const pause = () => {
    const audio = getAudioElement();
    if (audio) {
      audio.pause();
    }
  };

  const stop = () => {
    const audio = getAudioElement();
    if (audio) {
      audio.pause();
      audio.src = "";
      setPlayState("paused");
      setCurrentStation(null);
      setError(null);
      audioManager.stop();
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    }
  };

  return (
    <RadioContext.Provider
      value={{ playState, currentStation, error, play, pause, stop }}
    >
      {children}
    </RadioContext.Provider>
  );
}

export const useRadio = () => {
  const context = useContext(RadioContext);
  if (!context) throw new Error("useRadio must be used within RadioProvider");
  return context;
};
