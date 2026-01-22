"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { LocateFixed, ShieldAlert, Fullscreen } from "lucide-react";
import { subscribeToPlayCount, loadPlayCount } from "@/lib/analytics";
import { useRadio } from "@/app/contexts/radio";
import { playerFullScreen } from "@/lib/full-screen";
import { Station } from "@/types";
import { cn } from "@/lib/cn";

interface MediaInfoProps {
  station: Station;
  isOpen?: boolean;
  onPlay?: () => void;
}

function MediaInfo({ station, isOpen = true, onPlay }: MediaInfoProps) {
  const radio = useRadio();
  const [plays, setPlayCount] = useState<number>(0);
  const isCurrentStation = radio.currentStation === station.url;

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

  const handlePlay = () => {
    if (!isCurrentStation) {
      radio.play(station.url);
      if (onPlay) {
        onPlay();
      }
    }
  };

  const getButtonText = () => {
    if (!isCurrentStation) return "PLAY";

    switch (radio.playState) {
      case "loading":
        return "LOADING...";
      case "playing":
        return "PLAYING";
      case "paused":
        return "RESUME";
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
          "text-light bg-dark/40 bg-blend-multiply bg-repeat overflow-hidden",
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
                radio.playState === "error" && isCurrentStation
                  ? "bg-red-500 text-light"
                  : "text-dark bg-light",
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
        <div className="w-full flex flex-row items-end justify-between gap-2 select-text">
          <div>
            <div className="text-sm opacity-80">INFO:</div>
            <div className="font-bold">{station.name}</div>
            {station.tagline && (
              <div className="opacity-90">{station.tagline} . . .</div>
            )}
            {station.location && (
              <div className="flex flex-row items-center gap-1.5 opacity-60">
                <span className="shrink-0">
                  <LocateFixed size={18} />
                </span>
                <span className="text-sm">{station.location}</span>
              </div>
            )}
            {station.notes && (
              <div className="flex flex-row items-start gap-1.5 text-red-400 opacity-60 mt-1">
                <span className="shrink-0">
                  <ShieldAlert size={18} />
                </span>
                <span className="text-sm">{station.notes}</span>
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

export { MediaInfo };
