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
  currentTime: number;
  duration: number;
  play: (stationUrl: string) => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export function RadioProvider({ children }: { children: ReactNode }) {
  const [playState, setPlayState] = useState<PlayState>("paused");
  const [currentStation, setCurrentStation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const savedPositionRef = useRef<number>(0);

  const getAudioElement = (): HTMLAudioElement | null => {
    if (audioRef.current) return audioRef.current;

    if (typeof window === "undefined") return null;

    const audio = document.getElementById("radio-medium") as HTMLAudioElement;
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

      savedPositionRef.current = audio.currentTime;
      setPlayState("paused");
    };

    const handleError = () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      setPlayState("error");
      setError(audio.error?.message || "An error occurred");
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      savedPositionRef.current = audio.currentTime;
    };

    const handleDurationChange = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      savedPositionRef.current = 0;
      setCurrentTime(0);
      setPlayState("paused");
    };

    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
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
      setPlayState("error");
      setError("audio player not initialized");
      return;
    }

    audioManager.setPlaying("radio");
    setError(null);

    const isSameStation = currentStation === stationUrl;

    if (!isSameStation) {
      setPlayState("loading");
      audio.src = stationUrl;
      savedPositionRef.current = 0;
      setCurrentTime(0);
      setCurrentStation(stationUrl);
    } else {
      if (audio.paused) {
        audio.currentTime = savedPositionRef.current;
      }
    }

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
        setPlayState("error");
        setError(err.message || "failed to play...");
      });
    }
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
      setCurrentTime(0);
      setDuration(0);
      savedPositionRef.current = 0;
      audioManager.stop();
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    }
  };

  const seek = (time: number) => {
    const audio = getAudioElement();
    if (audio && !isNaN(audio.duration)) {
      audio.currentTime = Math.max(0, Math.min(time, audio.duration));
      savedPositionRef.current = audio.currentTime;
    }
  };

  return (
    <RadioContext.Provider
      value={{
        playState,
        currentStation,
        error,
        currentTime,
        duration,
        play,
        pause,
        stop,
        seek,
      }}
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
