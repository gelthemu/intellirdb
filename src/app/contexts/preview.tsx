"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
  Suspense,
  useCallback,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { audioManager } from "@/lib/audio-manager";
import { Track } from "@/types";

type PlayState = "loading" | "playing" | "paused" | "error";

interface PreviewContextType {
  playState: PlayState;
  currentPreview: string | "";
  currentPreviewedTrack: { track: Track; url: string } | null;
  error: string | null;
  currentTime: number;
  duration: number;
  play: (previewUrl: string) => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setCurrentPreviewedTrack: (
    data: { track: Track; url: string } | null,
  ) => void;
}

const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

function PreviewProviderContent({ children }: { children: ReactNode }) {
  const [playState, setPlayState] = useState<PlayState>("paused");
  const [currentPreview, setCurrentPreview] = useState<string>("");
  const [currentPreviewedTrack, setCurrentPreviewedTrack] = useState<{
    track: Track;
    url: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const savedPositionRef = useRef<number>(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getAudioElement = (): HTMLAudioElement | null => {
    if (audioRef.current) return audioRef.current;

    if (typeof window === "undefined") return null;

    const audio = document.getElementById("preview-medium") as HTMLAudioElement;
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
      if (playingType !== "preview" && playingType !== null) {
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

  const play = useCallback(
    (previewUrl: string) => {
      const audio = getAudioElement();

      if (!audio) {
        setPlayState("error");
        setError("audio player not initialized");
        return;
      }

      audioManager.setPlaying("preview");
      setError(null);

      const isSameTrack = currentPreview === previewUrl;

      if (!isSameTrack) {
        setPlayState("loading");
        audio.src = previewUrl;
        savedPositionRef.current = 0;
        setCurrentTime(0);
        setCurrentPreview(previewUrl);
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
    },
    [currentPreview],
  );

  const pause = useCallback(() => {
    const audio = getAudioElement();
    if (audio) {
      audio.pause();
    }
  }, []);

  const stop = useCallback(() => {
    const audio = getAudioElement();
    if (audio) {
      audio.pause();
      audio.src = "";
      setPlayState("paused");
      setCurrentPreview("");
      setError(null);
      setCurrentTime(0);
      setDuration(0);
      savedPositionRef.current = 0;
      audioManager.stop();
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    }
  }, []);

  const seek = useCallback((time: number) => {
    const audio = getAudioElement();
    if (audio && !isNaN(audio.duration)) {
      audio.currentTime = Math.max(0, Math.min(time, audio.duration));
      savedPositionRef.current = audio.currentTime;
    }
  }, []);

  useEffect(() => {
    const currentView = searchParams.get("v");

    if (pathname === "/intellirdb" && currentView !== "charts") {
      const audio = getAudioElement();
      if (audio) {
        audio.pause();
        audio.src = "";
        setPlayState("paused");
        setCurrentPreview("");
        setError(null);
        setCurrentTime(0);
        setDuration(0);
        savedPositionRef.current = 0;
        audioManager.stop();
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
      }
      setCurrentPreviewedTrack(null);
    }
  }, [pathname, searchParams]);

  return (
    <PreviewContext.Provider
      value={{
        playState,
        currentPreview,
        currentPreviewedTrack,
        error,
        currentTime,
        duration,
        play,
        pause,
        stop,
        seek,
        setCurrentPreviewedTrack,
      }}
    >
      {children}
    </PreviewContext.Provider>
  );
}

export const PreviewProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Suspense fallback={null}>
      <PreviewProviderContent>{children}</PreviewProviderContent>
    </Suspense>
  );
};

export const usePreview = () => {
  const context = useContext(PreviewContext);
  if (!context)
    throw new Error("usePreview must be used within PreviewProvider");
  return context;
};
