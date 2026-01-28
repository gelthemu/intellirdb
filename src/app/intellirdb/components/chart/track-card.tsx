"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { motion } from "framer-motion";
import { StepForward, AudioLines } from "lucide-react";
import { usePreview } from "@/app/contexts/preview";
import TrackImage from "./track-image";
import { Track } from "@/types";

interface TrackCardProps {
  track: Track;
  index: number;
  openDeepView: (id: string) => void;
}

const TrackCard: React.FC<TrackCardProps> = ({
  track,
  index,
  openDeepView,
}) => {
  const preview = usePreview();

  const isCurrentPreviewedTrack = () => {
    const currentPreviewedTrack = preview.currentPreviewedTrack;

    if (!currentPreviewedTrack) return false;

    return (
      currentPreviewedTrack.track_artist === track.track_artist &&
      currentPreviewedTrack.track_title === track.track_title
    );
  };

  return (
    <motion.div
      onClick={() => openDeepView(`no.${track.track_position}`)}
      className={cn(
        "px-3 py-2 flex flex-row items-center justify-between gap-2",
        "border border-dark/50 cursor-pointer select-none",
        isCurrentPreviewedTrack()
          ? "bg-light/80"
          : "bg-light/40 hover:bg-light/60",
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex-1 flex flex-row items-center space-x-2">
        <div className="shrink-0 w-5 inline-flex items-center justify-center">
          <span>{track.track_position}.</span>
        </div>
        <TrackImage trackImage={track.track_image} index={index + 1} />
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
          "w-12 md:w-24 h-full mr-1 md:mr-2 shrink-0 flex items-center justify-center",
          isCurrentPreviewedTrack() ? "" : "opacity-60",
        )}
        aria-label="Preview"
        title="Preview"
      >
        <div>
          {isCurrentPreviewedTrack() ? (
            <AudioLines
              size={12}
              strokeWidth={2.5}
              color="#000"
              className="animate-ping"
            />
          ) : (
            <StepForward size={15} strokeWidth={2.5} />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TrackCard;
