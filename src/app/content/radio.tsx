"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { LocateFixed, ShieldAlert, Fullscreen } from "lucide-react";
import { subscribeToPlayCount, loadPlayCount } from "@/lib/analytics";
import radioData from "@/data/radio.json";
import { useStack } from "@/app/hooks/use-dialog-stack";
import { useRadio } from "@/app/contexts/radio-context";
import { playerFullScreen } from "@/lib/full-screen";
import { Station } from "@/types";
import { cn } from "@/lib/cn";

interface RadioProps {
  isOpen?: boolean;
}

interface StationInfoProps {
  station: Station;
  isOpen?: boolean;
  onPlay?: () => void;
}

function StationInfo({ station, isOpen = true, onPlay }: StationInfoProps) {
  const { playStation, playState, currentStation } = useRadio();
  const [plays, setPlayCount] = useState<number>(0);
  const isCurrentStation = currentStation?.id === station.id;

  useEffect(() => {
    if (!isOpen) return;

    loadPlayCount(station.id).then(setPlayCount);

    const unsubscribe = subscribeToPlayCount(station.id, (data) => {
      setPlayCount(data.plays);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [station.id, isOpen]);

  const handlePlay = async () => {
    if (!isCurrentStation) {
      await playStation(station);
      if (onPlay) {
        onPlay();
      }
    }
  };

  const getButtonText = () => {
    if (!isCurrentStation) return "PLAY";

    switch (playState) {
      case "loading":
        return "LOADING...";
      case "playing":
        return "PLAYING";
      case "paused":
        return "PAUSED";
      case "error":
        return "ERROR";
      default:
        return "PLAY";
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="radio-player"
      className="w-full h-full p-px overflow-hidden relative"
      onDoubleClick={playerFullScreen}
    >
      <div className="w-full h-full">
        <Image
          src="/img-radio-pixelart.webp"
          alt="Radio"
          width={3200}
          height={3200}
          unoptimized
          loading="eager"
          className="w-full h-full object-cover object-bottom intelli-none"
        />
      </div>
      <div
        className={cn(
          "absolute top-0 left-0 w-full h-full flex flex-col items-start justify-between space-y-4 p-4 md:p-6",
          "text-light bg-dark/70 bg-blend-multiply bg-repeat overflow-hidden"
        )}
      >
        <div className="w-full flex flex-row justify-between gap-2">
          <div>
            <div
              role={isCurrentStation ? undefined : "button"}
              tabIndex={isCurrentStation ? undefined : 0}
              onClick={isCurrentStation ? undefined : handlePlay}
              className={cn(
                "px-2 py-px border-none font-bold",
                isCurrentStation ? "cursor-default" : "cursor-pointer",
                playState === "error" && isCurrentStation
                  ? "bg-red-500 text-light"
                  : "text-dark bg-light"
              )}
            >
              {getButtonText()}
            </div>
          </div>
          <div className="h-fit px-2 py-px bg-dark/60">
            <div className="text-sm opacity-90">
              Pings: {plays > 0 ? plays : "_"}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-row items-end justify-between gap-2">
          <div>
            <div className="text-sm opacity-80">INFO:</div>
            <div className="font-bold">{station.name}</div>
            {station.tagline && (
              <div className="opacity-90">{station.tagline}...</div>
            )}
            {station.location && (
              <div className="flex flex-row items-center gap-1.5 text-sm opacity-80">
                <LocateFixed size={18} />
                <span>{station.location}</span>
              </div>
            )}
            {station.notes && (
              <div className="flex flex-row items-center gap-1.5 text-sm text-red-400 opacity-80">
                <ShieldAlert size={18} />
                <span>{station.notes}</span>
              </div>
            )}
          </div>
          <div
            className="bg-dark/80 p-2 cursor-pointer opacity-80 z-50"
            onClick={playerFullScreen}
          >
            <Fullscreen size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Radio({ isOpen = true }: RadioProps) {
  const { openDialog } = useStack();

  const handleStationClick = async (station: Station) => {
    openDialog({
      id: `station-${station.id}`,
      title: station.name,
      component: (
        <StationInfo station={station} isOpen={true} onPlay={() => {}} />
      ),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="w-full h-full p-0 overflow-hidden relative overflow-y-auto pr-1">
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-1">
        {(radioData as Station[]).map((station, idx) => (
          <Suspense key={idx} fallback={null}>
            <div
              key={station.id || idx}
              onClick={() => handleStationClick(station)}
              className="border border-dark cursor-pointer user-select-none"
            >
              <div className="px-3 py-2 flex flex-row items-center gap-2 bg-light/50 hover:bg-light/80">
                <div className="w-4 aspect-square flex items-center justify-center">
                  <Image
                    src="/img-radio.png"
                    alt="Radio"
                    width={1500}
                    height={1500}
                    unoptimized
                    className="w-full h-full object-contain intelli-none"
                  />
                </div>
                <div className="flex-1">
                  <p className="line-clamp-1 text-ellipsis">{station.name}</p>
                </div>
              </div>
            </div>
          </Suspense>
        ))}
      </div>
      <div className="w-full h-32 bg-transparent"></div>
    </div>
  );
}

export { StationInfo, Radio };
