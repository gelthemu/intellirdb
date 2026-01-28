"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/cn";

interface TrackImageProps {
  trackImage: string;
  index: number;
}

const TrackImage: React.FC<TrackImageProps> = ({ trackImage, index }) => {
  return (
    <div
      className={cn(
        "w-12 md:w-16 aspect-square grayscale border border-dark/60 bg-light",
        "flex items-center justify-center shrink-0 overflow-hidden",
      )}
    >
      <motion.div
        className="relative w-full h-full intelli-canvas bg-blend-multiply"
        style={{
          aspectRatio: "1/1",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 }}
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
      </motion.div>
    </div>
  );
};

export default TrackImage;
