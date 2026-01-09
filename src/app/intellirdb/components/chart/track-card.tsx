"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
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
  return (
    <motion.div
      onClick={() => openDeepView(`no.${track.track_position}`)}
      className={cn(
        "px-3 py-2 flex flex-row items-center justify-between gap-2",
        "border border-dark/50 cursor-pointer select-none",
        "bg-light/40 hover:bg-light/60"
      )}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
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
      <motion.div
        className="w-4 h-full mr-1 md:mr-2 aspect-square shrink-0 flex items-center justify-center opacity-70"
        aria-label="Preview"
        title="Preview"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        ▶
      </motion.div>
    </motion.div>
  );
};

export default TrackCard;
