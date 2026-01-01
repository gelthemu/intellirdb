"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";

interface PreviewContextType {
  isPlaying: boolean;
  currentTrack: string | null;
  progress: number;
  playPreview: (url: string) => void;
  pausePreview: () => void;
  togglePreview: (url: string) => void;
  registerAudio: (element: HTMLAudioElement | null) => void;
}

const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

export function PreviewProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const registerAudio = useCallback((element: HTMLAudioElement | null) => {
    audioRef.current = element;
  }, []);

  const dispatchPreviewEvent = (type: "start" | "stop") => {
    const event = new CustomEvent("previewStateChange", {
      detail: { type, isPlaying: type === "start" },
    });
    window.dispatchEvent(event);
  };

  // Listen for radio starting to pause preview
  useEffect(() => {
    const handleRadioStart = () => {
      if (isPlaying && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setProgress(0);
      }
    };

    window.addEventListener("radioStateChange", handleRadioStart);
    return () => {
      window.removeEventListener("radioStateChange", handleRadioStart);
    };
  }, [isPlaying]);

  const playPreview = useCallback(
    (url: string) => {
      if (!audioRef.current) {
        console.warn("Audio element not registered");
        return;
      }

      if (currentTrack !== url) {
        audioRef.current.src = url;
        setCurrentTrack(url);
        setProgress(0);
      }

      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          dispatchPreviewEvent("start");
        })
        .catch((error) => {
          console.error("Error playing preview:", error);
          setIsPlaying(false);
          setCurrentTrack(null);
          setProgress(0);
          dispatchPreviewEvent("stop");
        });
    },
    [currentTrack]
  );

  const pausePreview = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setProgress(0);
      dispatchPreviewEvent("stop");
    }
  }, []);

  const togglePreview = useCallback(
    (url: string) => {
      if (isPlaying && currentTrack === url) {
        pausePreview();
      } else {
        playPreview(url);
      }
    },
    [isPlaying, currentTrack, playPreview, pausePreview]
  );

  useEffect(() => {
    if (!isPlaying || !audioRef.current) {
      setProgress(0);
      return;
    }

    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setProgress(((audio.currentTime || 0) / audio.duration) * 100);
      }
    };

    const updateInterval = setInterval(updateProgress, 100);
    audio.addEventListener("timeupdate", updateProgress);

    updateProgress();

    return () => {
      clearInterval(updateInterval);
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, [isPlaying]);

  return (
    <PreviewContext.Provider
      value={{
        isPlaying,
        currentTrack,
        progress,
        playPreview,
        pausePreview,
        togglePreview,
        registerAudio,
      }}
    >
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreview() {
  const context = useContext(PreviewContext);
  if (context === undefined) {
    throw new Error("usePreview must be used within a PreviewProvider");
  }
  return context;
}
