"use client";

import React from "react";
import { cn } from "@/lib/cn";
import TrackImage from "./track-image";
import { Track } from "@/types";

interface BonusListProps {
  bonus: Track[];
}

const BonusList: React.FC<BonusListProps> = ({ bonus }) => {
  return (
    <div>
      <div className="font-normal mb-2">
        <span>Bonus Tracks</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        {bonus.map((track, index) => (
          <div
            key={track.track_position || index}
            className={cn(
              "p-2 flex flex-row items-center justify-between gap-2",
              "border border-dark/50 select-none",
              "bg-light/40 hover:bg-light/60",
            )}
          >
            <div className="flex flex-row items-center space-x-2">
              <TrackImage trackImage={track.track_image} index={index} />
              <div className="flex-1 flex flex-col min-w-0">
                <div className="font-semibold leading-none line-clamp-2 text-ellipsis">
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

export default BonusList;
