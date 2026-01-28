"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { usePreview } from "@/app/contexts/preview";
import TrackImage from "./track-image";
import { Track, ChartWeek } from "@/types";

interface TrackCardProps {
  track: Track;
  openDeepView: (id: string) => void;
  chart: ChartWeek;
  currentPreviewedTrack: Track | null;
}

const TrackCard: React.FC<TrackCardProps> = ({
  track,
  openDeepView,
  chart,
  currentPreviewedTrack,
}) => {
  const { currentPreview } = usePreview();

  const isCurrentPreviewedTrack = () => {
    if (!currentPreviewedTrack) return false;
    return (
      currentPreviewedTrack.track_artist === track.track_artist &&
      currentPreviewedTrack.track_title === track.track_title
    );
  };

  return (
    <div
      onClick={() => openDeepView(`no.${track.track_position}`)}
      className={cn(
        "px-3 py-2 flex flex-row items-center justify-between gap-2",
        "border border-dark/50 cursor-pointer select-none",
        isCurrentPreviewedTrack()
          ? "bg-light/80"
          : "bg-light/40 hover:bg-light/60",
      )}
    >
      <div className="flex-1 flex flex-row items-center space-x-2">
        <div className="shrink-0 w-5 inline-flex items-center justify-center">
          <span>{track.track_position}.</span>
        </div>
        <TrackImage trackImage={track.track_image} size="w-12 md:w-16" />
        <div className="flex-1 flex flex-col min-w-0">
          <div className="font-bold leading-none line-clamp-1 text-ellipsis">
            {track.track_title}
          </div>
          <div className="text-sm opacity-75 leading-none line-clamp-1 text-ellipsis">
            {track.track_artist}
          </div>
        </div>
      </div>
      <div
        className={cn(
          "w-4 h-full mr-1 md:mr-2 aspect-square shrink-0 flex items-center justify-center",
          isCurrentPreviewedTrack() ? "text-lg" : "opacity-70",
        )}
        aria-label="Preview"
        title="Preview"
      >
        <div>{isCurrentPreviewedTrack() ? "♪" : "▶"}</div>
      </div>
    </div>
  );
};

export default TrackCard;
