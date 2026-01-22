"use client";

import React from "react";
import Image from "next/image";

interface TrackImageProps {
  trackImage: string;
  size: string;
}

const TrackImage: React.FC<TrackImageProps> = ({ trackImage, size }) => {
  return (
    <div
      className={`${size} aspect-square grayscale border border-dark/60 bg-light flex items-center justify-center shrink-0 overflow-hidden`}
    >
      <div
        className="relative w-full h-full intelli-canvas bg-blend-multiply"
        style={{
          aspectRatio: "1/1",
        }}
      >
        {!trackImage ? (
          <div className="relative w-full h-full bg-gray/40 animate-pulse" />
        ) : (
          <Image
            src={trackImage}
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
            src="https://assets.cfmpulse.com/intellirdb/assets/tl.webp"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
            loading="eager"
            className="w-full h-full object-cover aspect-square intelli-none"
          />
        </div>
      </div>
    </div>
  );
};

export default TrackImage;
