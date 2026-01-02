"use client";

import React, { useState, useEffect, useRef } from "react";
import { Track } from "@/types";
import { usePreview } from "@/app/contexts/preview";
import { cn } from "@/lib/cn";

interface PreviewBtnProps {
  track: Track;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  sr?: boolean;
}

export function PreviewBtn({
  track,
  disabled = false,
  children,
}: PreviewBtnProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [needsFreshUrl, setNeedsFreshUrl] = useState<boolean>(true);
  const { isPlaying, currentTrack, togglePreview, registerAudio } =
    usePreview();
  const audioRef = useRef<HTMLAudioElement>(null);

  async function fetchPreview() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/api/cfmpulse/track-preview?artist=${encodeURIComponent(
          track.track_artist
        )}&title=${encodeURIComponent(track.track_title)}`,
        {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TRACK_PREVIEW_API_KEY}`,
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
      const data = await response.json();
      const newUrl = data.preview || "";
      setPreviewUrl(newUrl);
      setNeedsFreshUrl(false);
      return newUrl;
    } catch (error) {
      console.error(error);
      setPreviewUrl("");
      setNeedsFreshUrl(true);
      return "";
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (currentTrack === previewUrl && !isPlaying) {
      setNeedsFreshUrl(true);
    }
  }, [isPlaying, currentTrack, previewUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    registerAudio(audio);

    audio.volume = 0.75;
    audio.setAttribute("data-preview", "true");

    const handleEnded = () => {};

    const handleError = () => {};

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      registerAudio(null);
    };
  }, [registerAudio]);

  const isThisTrackPlaying = currentTrack === previewUrl && isPlaying;
  const isDisabled = disabled || isLoading;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDisabled) return;

    if (isThisTrackPlaying) {
      togglePreview(previewUrl);
      return;
    }

    if (needsFreshUrl || !previewUrl) {
      const freshUrl = await fetchPreview();
      if (freshUrl) {
        togglePreview(freshUrl);
      }
    } else {
      togglePreview(previewUrl);
    }
  };

  const getText = () => {
    switch (true) {
      case isLoading:
        return "Loading......";
      case !previewUrl && !isLoading:
        return "Preview Track";
      case isThisTrackPlaying:
        return "Pause Track";
      default:
        return "Play Track";
    }
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label={getText()}
        onClick={handleClick}
        className={cn(
          "w-fit flex items-center justify-center border border-light/80",
          isDisabled ? "cursor-default" : "cursor-pointer",
          "focus:outline-none select-none"
        )}
        title={getText()}
      >
        {children || (
          <div className="px-2 py-1 text-sm flex items-center justify-center">
            <span>{getText()}</span>
          </div>
        )}
      </div>
      <audio ref={audioRef} />
    </>
  );
}
