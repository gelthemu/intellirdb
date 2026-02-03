"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { StepForward } from "lucide-react";
import { motion } from "framer-motion";
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
      const station =
        stations.find((s) => s.id === subView) ||
        stations.find((s) => s.url === currentStation);
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
    const station =
      stations.find((s) => s.id === stationId) ||
      stations.find((s) => s.url === currentStation);

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
              currentStation === station.url
                ? "font-bold bg-light/80"
                : "bg-light/40 hover:bg-light/60",
            )}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex-1">
              <span className="line-clamp-1 text-ellipsis">
                {index + 1}. {station.name}
              </span>
            </div>
            <div
              className={cn(
                "w-12 md:w-24 h-full mr-1 md:mr-2 shrink-0 flex items-center justify-center",
                currentStation === station.url ? "" : "opacity-60",
              )}
              aria-label="Play"
              title="Play"
            >
              {currentStation === station.url ? (
                <Image
                  src="/folders/img-radio.png"
                  alt=""
                  width={1500}
                  height={1500}
                  unoptimized
                  className="w-5 aspect-square object-contain intelli-none"
                />
              ) : (
                <StepForward size={15} strokeWidth={2.5} />
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
