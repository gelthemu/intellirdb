"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PreviewBtn } from "@/app/intellirdb/components/preview-btn";
import { cn } from "@/lib/cn";
import { Track } from "@/types";

interface TrackDetailsProps {
  track: Track;
}

const TrackDetails: React.FC<TrackDetailsProps> = ({ track }) => {
  return (
    <div
      id="track-details"
      className="w-full h-full p-px overflow-hidden relative"
    >
      <div className="w-full h-full relative">
        <Image
          src="https://cfmpulse.com/img-radio-pixelart.gif"
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
          "text-light bg-dark/40 bg-blend-multiply bg-repeat overflow-hidden"
        )}
      >
        <div className="flex flex-col gap-4 items-start">
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
                  src="/tl..webp"
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
          <div className="flex-1">
            <div className="text-2xl font-bold">{track.track_title}</div>
            <div className="text-lg opacity-75">{track.track_artist}</div>
          </div>
        </div>
        <div>
          <PreviewBtn track={track} sr={true} className="text-light" />
        </div>
      </div>
    </div>
  );
};

export default TrackDetails;
