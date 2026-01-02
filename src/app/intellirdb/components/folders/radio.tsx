"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import data from "@/data/radio.json";
import { useRadio } from "@/app/contexts/radio";
import { useWindow } from "@/app/contexts/window";
import { Station } from "@/types";
import { MediaInfo } from "@/app/intellirdb/components/media-info";
import { cn } from "@/lib/cn";

const radioData = data as Station[];

const Radio: React.FC = () => {
  const { currentStation } = useRadio();
  const { currentFolder, subView, openSubView, setDialogTitle } = useWindow();
  const stations = radioData;

  useEffect(() => {
    if (subView && stations.length > 0) {
      const station = stations.find((s) => s.id === subView) || currentStation;
      if (station) {
        setDialogTitle(station.name);
        return;
      }
    }

    if (currentFolder === "radio") {
      setDialogTitle("Just Radio");
      return;
    }
  }, [subView, stations, currentStation, setDialogTitle]);

  const handleStationClick = (station: Station) => {
    openSubView(station.id);
  };

  if (subView) {
    const stationId = subView;
    const station = stations.find((s) => s.id === stationId) || currentStation;

    if (!station) return null;

    return <MediaInfo station={station} isOpen={true} onPlay={() => {}} />;
  }

  return (
    <div className="w-full h-full p-0 relative overflow-y-auto pr-1">
      <div className="min-h-screen grid grid-cols-1 gap-1">
        {stations.map((station, index) => (
          <motion.div
            key={station.id || index}
            onClick={() => handleStationClick(station)}
            className={cn(
              "px-3 py-2 flex flex-row items-center justify-between gap-2",
              "border border-dark/50 cursor-pointer select-none",
              currentStation?.id === station.id
                ? "font-bold bg-light/80"
                : "bg-light/40 hover:bg-light/60"
            )}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex-1">
              <span className="line-clamp-1 text-ellipsis">
                {index + 1}. {station.name}
              </span>
            </div>
            <div className="w-5 aspect-square shrink-0 flex items-center justify-center">
              {currentStation?.id === station.id ? (
                <Image
                  src="/folders/img-radio.png"
                  alt="Radio"
                  width={1500}
                  height={1500}
                  unoptimized
                  className="w-full h-full object-contain intelli-none"
                />
              ) : (
                " "
              )}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="w-full h-10 bg-transparent"></div>
    </div>
  );
};

export default Radio;
