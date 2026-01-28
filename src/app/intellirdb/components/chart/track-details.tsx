"use client";

import React from "react";
import Image from "next/image";
import { Star, TrendingUp, TrendingDown, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { PreviewBtn } from "@/app/intellirdb/components/preview-btn";
import { cn } from "@/lib/cn";
import { Track, ChartWeek } from "@/types";

interface TrackDetailsProps {
  track: Track;
  chart: ChartWeek;
  setCurrentPreviewedTrack: (track: Track | null) => void;
}

const TrackDetails: React.FC<TrackDetailsProps> = ({
  track,
  chart,
  setCurrentPreviewedTrack,
}) => {
  const renderMovementIndicator = (track: Track) => {
    let pos = 0;
    let movement: "up" | "down" | "same" | "new" | "returning" = "new";

    if (track.track_previous_position === "returning") {
      movement = "returning";
    } else if (
      track.track_previous_position &&
      typeof track.track_previous_position === "number"
    ) {
      pos = track.track_previous_position - track.track_position;
      if (pos > 0) {
        movement = "up";
      } else if (pos < 0) {
        movement = "down";
      } else {
        movement = "same";
      }
    } else {
      movement = "new";
    }

    switch (movement) {
      case "new":
        return (
          <div
            className="flex items-center justify-center"
            title="New entry this week!"
          >
            <Star size={16} />
          </div>
        );
      case "returning":
        return (
          <div
            className="flex items-center justify-center"
            title="Re-entry this week!"
          >
            <RotateCcw size={16} />
          </div>
        );
      case "up":
        return (
          <div
            className="flex items-center justify-center space-x-1.5"
            title={`Up ${Math.abs(pos)} place${
              Math.abs(pos) !== 1 ? "s" : ""
            } this week!`}
          >
            <TrendingUp size={16} />
            <span className="text-sm">{Math.abs(pos)}</span>
          </div>
        );
      case "down":
        return (
          <div
            className="flex items-center justify-center space-x-1.5"
            title={`Down ${Math.abs(pos)} place${
              Math.abs(pos) !== 1 ? "s" : ""
            } this week!`}
          >
            <TrendingDown size={16} />
            <span className="text-sm">{Math.abs(pos)}</span>
          </div>
        );
      case "same":
        return (
          <div
            className="flex items-center justify-center"
            title="No movement this week!"
          >
            <span className="text-sm">#</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      id="track-details"
      className="w-full h-full p-px overflow-hidden relative"
    >
      <div className="w-full h-full relative">
        <Image
          src="https://assets.cfmpulse.com/intellirdb/assets/img-radio-pixelart.gif"
          alt="Radio"
          fill
          unoptimized
          loading="eager"
          className="w-full h-full object-cover object-bottom intelli-none"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-transparent to-dark/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark/60 via-transparent to-dark/60" />
      <div
        className={cn(
          "absolute top-0 left-0 w-full h-full flex flex-col items-start justify-between space-y-4 p-4 md:p-6",
          "text-light bg-dark/40 bg-blend-multiply bg-repeat overflow-hidden",
        )}
      >
        <div className="w-full flex flex-col gap-4 items-start">
          <div className="w-full flex flex-row justify-between gap-2">
            <motion.div
              className="w-20 md:w-24 aspect-square grayscale border-2 border-light/60 flex items-center justify-center shrink-0 overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
              <div
                className="relative w-full h-full intelli-canvas bg-blend-multiply"
                style={{
                  aspectRatio: "1/1",
                }}
              >
                {!track.track_image ? (
                  <div className="relative w-full h-full bg-gray/40 animate-pulse" />
                ) : (
                  <Image
                    src={track.track_image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized
                    loading="eager"
                    className="w-full h-full object-cover aspect-square intelli-none sepia"
                  />
                )}
                <div
                  className="absolute inset-0"
                  style={{
                    aspectRatio: "1/1",
                  }}
                >
                  <Image
                    src="https://assets.cfmpulse.com/intellirdb/assets/tl..webp"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized
                    loading="eager"
                    className="w-full h-full object-cover aspect-square intelli-none"
                  />
                </div>
              </div>
            </motion.div>
            <div className="h-fit px-3 py-2 bg-dark/60 opacity-90">
              {(chart.id === "at40" || chart.id === "kt10") && (
                <div>{renderMovementIndicator(track)}</div>
              )}
            </div>
          </div>
          <div className="flex-1 select-text">
            <div className="text-xl font-bold font-var">
              {track.track_title}
            </div>
            <div className="opacity-75">{track.track_artist}</div>
          </div>
        </div>
        <div>
          <PreviewBtn
            track={track}
            setCurrentPreviewedTrack={setCurrentPreviewedTrack}
          />
        </div>
      </div>
    </div>
  );
};

export default TrackDetails;
