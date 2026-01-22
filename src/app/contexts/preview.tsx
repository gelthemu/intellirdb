// contexts/PreviewContext.tsx
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

interface PreviewContextType {
  playState: PlayState;
  currentPreview: string | null;
  error: string | null;
  play: (previewUrl: string) => void;
  pause: () => void;
  stop: () => void;
}

const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

export function PreviewProvider({ children }: { children: ReactNode }) {
  const [playState, setPlayState] = useState<PlayState>("paused");
  const [currentPreview, setCurrentPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Helper function to get audio element
  const getAudioElement = (): HTMLAudioElement | null => {
    if (audioRef.current) return audioRef.current;

    if (typeof window === "undefined") return null;

    const audio = document.getElementById("preview-player") as HTMLAudioElement;
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
        setPlayState("playing");
      }
    };

    const handlePlaying = () => {
      setPlayState("playing");
    };

    const handlePause = () => {
      setPlayState("paused");
    };

    const handleError = () => {
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
      if (playingType !== "preview" && playingType !== null) {
        const audio = getAudioElement();
        if (audio && !audio.paused) {
          audio.pause();
        }
      }
    });

    return unsubscribe;
  }, []);

  const play = (previewUrl: string) => {
    const audio = getAudioElement();

    if (!audio) {
      console.error("Preview audio element not found or invalid");
      setPlayState("error");
      setError("Audio player not initialized");
      return;
    }

    audioManager.setPlaying("preview");
    setPlayState("loading");
    setError(null);
    audio.src = previewUrl;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        setPlayState("error");
        setError(err.message || "Failed to play audio");
      });
    }

    setCurrentPreview(previewUrl);
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
      setCurrentPreview(null);
      setError(null);
      audioManager.stop();
    }
  };

  return (
    <PreviewContext.Provider
      value={{ playState, currentPreview, error, play, pause, stop }}
    >
      {children}
    </PreviewContext.Provider>
  );
}

export const usePreview = () => {
  const context = useContext(PreviewContext);
  if (!context)
    throw new Error("usePreview must be used within PreviewProvider");
  return context;
};
