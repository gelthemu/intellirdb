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
  const [needsFreshUrl, setNeedsFreshUrl] = useState<boolean>(true);
  const { isPlaying, currentTrack, togglePreview } = usePreview();

  async function fetchPreview() {
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
            "Content-Type": "application/json",
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
    }
  }

  useEffect(() => {
    if (currentTrack === previewUrl && !isPlaying) {
      setNeedsFreshUrl(true);
    }
  }, [isPlaying, currentTrack, previewUrl]);

  const isThisTrackPlaying = currentTrack === previewUrl && isPlaying;
  const isDisabled = disabled || isLoading;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDisabled) return;

    setIsLoading(true);

    if (isThisTrackPlaying) {
      togglePreview(previewUrl);
      setIsLoading(false);
      return;
    }

    if (needsFreshUrl || !previewUrl) {
      const freshUrl = await fetchPreview();
      if (freshUrl) {
        togglePreview(freshUrl);
        setIsLoading(false);
      }
    } else {
      togglePreview(previewUrl);
      setIsLoading(false);
    }
  };

  const getText = () => {
    switch (true) {
      case isLoading:
        return "Loading...";
      case isThisTrackPlaying:
        return "Pause Track";
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
  );
}
