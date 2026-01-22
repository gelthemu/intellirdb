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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cfmpulse/track-preview?artist=${encodeURIComponent(
          track.track_artist,
        )}&title=${encodeURIComponent(track.track_title)}`,
        {
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok) throw new Error("Fetch failed");

      const data = await response.json();
      const newUrl = data.preview || "";

      if (!newUrl) throw new Error("No URL returned");

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPreviewUrl(newUrl);
      return newUrl;
    } catch (err) {
      console.error("Preview fetch error:", err);
      setIsError(true);
      setPreviewUrl("");
      return "";
    } finally {
      setIsLoading(false);
    }
  }

  const isThisTrackPlaying =
    preview.currentPreview === (track.track_preview || previewUrl) &&
    (track.track_preview || previewUrl) !== "";
  const isDisabled = disabled || isLoading || isError;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDisabled) return;

    if (isThisTrackPlaying) {
      if (preview.playState === "playing") {
        preview.pause();
      } else {
        preview.play(track.track_preview || previewUrl);
      }
      return;
    }

    if (track.track_preview) {
      preview.play(track.track_preview);
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
    if (isLoading || preview.playState === "loading") return "Loading...";
    if (isError || (previewUrl && preview.error)) return "Preview Error";
    if (isThisTrackPlaying && preview.playState === "playing")
      return "Stop Preview";
    if (isThisTrackPlaying && preview.playState === "paused")
      return "Resume Track";
    return "Preview Track";
  };

  return (
    <div
      role={isDisabled ? undefined : "button"}
      tabIndex={0}
      aria-label={getText()}
      onClick={handleClick}
      className={cn(
        "w-fit flex items-center justify-center border border-light/80 transition-colors",
        isDisabled ? "cursor-default opacity-70" : "cursor-pointer",
        isError || (previewUrl && preview.error) ? "bg-red-500" : "",
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
