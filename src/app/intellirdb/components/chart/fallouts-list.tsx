"use client";

import React from "react";
import { cn } from "@/lib/cn";
import TrackImage from "./track-image";
import { Track } from "@/types";

interface FalloutsListProps {
  fallouts: Track[];
}

const FalloutsList: React.FC<FalloutsListProps> = ({ fallouts }) => {
  return (
    <div>
      <div className="font-normal mb-2">
        <span>Fall Outs</span>
      </div>
      <div className="grid grid-cols-1 gap-1">
        {fallouts.map((track, index) => (
          <div
            key={track.track_position || index}
            className={cn(
              "px-3 py-2 flex flex-row items-center justify-between gap-2",
              "border border-dark/50 select-none",
              "bg-light/40 hover:bg-light/60",
            )}
          >
            <div className="flex flex-row items-center space-x-2">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default FalloutsList;
