"use client";

import React, { useState, useEffect } from "react";
import { Track } from "@/types";
import { usePreview } from "@/app/contexts/preview";
import { cn } from "@/lib/cn";

interface PreviewBtnProps {
  track: Track;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function PreviewBtn({
  track,
  disabled = false,
  children,
}: PreviewBtnProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const preview = usePreview();

  async function fetchPreview() {
    setIsLoading(true);
    setIsError(false);
    try {
      let newUrl;
      if (track.track_preview) {
        // newUrl = "/250413-233541.mp3";
        newUrl = track.track_preview;
      } else {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/api/cfmpulse/track-preview?artist=${encodeURIComponent(
            track.track_artist,
          )}&title=${encodeURIComponent(track.track_title)}`,
          {
            cache: "no-store",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        const data = await response.json();
        newUrl = data.preview || "";
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPreviewUrl(newUrl);
      return newUrl;
    } catch {
      setIsError(true);
      setPreviewUrl("");
      return "";
    } finally {
      setIsLoading(false);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      setIsError(false);
    }
  }

  const isThisTrackPlaying =
    preview.currentPreview === previewUrl && previewUrl !== "";
  const isDisabled = disabled || isLoading || isError;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDisabled) return;

    if (isThisTrackPlaying && preview.playState === "playing") {
      preview.pause();
      return;
    }

    if (isThisTrackPlaying && preview.playState === "paused") {
      preview.play(previewUrl);
      return;
    }

    if (!previewUrl) {
      const url = await fetchPreview();
      if (url) {
        preview.play(url);
      }
    } else {
      preview.play(previewUrl);
    }
  };

  const getText = () => {
    switch (true) {
      case isLoading || preview.playState === "loading":
        return "Loading...";
      case isThisTrackPlaying && preview.playState === "playing":
        return "Stop Preview";
      case isThisTrackPlaying && preview.playState === "paused":
        return "Resume Track";
      case isError || preview.playState === "error":
        return "Preview Error";
      default:
        return "Preview Track";
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={getText()}
      onClick={handleClick}
      className={cn(
        "w-fit flex items-center justify-center border border-light/80",
        isDisabled ? "cursor-default" : "cursor-pointer",
        isError || preview.playState === "error" ? "bg-red-500" : "",
        "focus:outline-none select-none",
      )}
      title={getText()}
    >
      {children || (
        <div className="px-2 py-1 text-sm flex items-center justify-center">
          <span>{getText()}</span>
        </div>
      )}
    </div>
  );
}
