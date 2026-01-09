"use client";

import { useRadio } from "@/app/contexts/radio";
import { cn } from "@/lib/cn";

export default function AudioControls() {
  const { currentStation, playState, togglePlayPause, stop } = useRadio();

  if (!currentStation) return null;

  const getButtonText = () => {
    switch (playState) {
      case "loading":
        return "Loading...";
      case "playing":
        return "Pause";
      case "paused":
        return "Play";
      case "error":
        return "Error";
      default:
        return "Play";
    }
  };

  return (
    <div className={cn("w-fit flex flex-row items-center gap-2 px-1 text-sm")}>
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <div className="flex flex-row items-center gap-1">
          <div
            role="button"
            tabIndex={0}
            onClick={togglePlayPause}
            className={cn(
              "px-2 py-px cursor-pointer focus:outline-none select-none",
              playState !== "loading" ? "border border-dark" : "",
              playState === "error"
                ? "bg-red-500 text-light"
                : playState === "loading"
                ? "bg-transparent text-dark"
                : "bg-dark text-light"
            )}
          >
            {getButtonText()}
          </div>
          {(playState === "playing" ||
            playState === "paused" ||
            playState === "error") && (
            <div
              role="button"
              tabIndex={0}
              onClick={stop}
              className="px-2 py-px text-dark bg-transparent border border-dark cursor-pointer focus:outline-none select-none"
            >
              {playState === "error" ? "Exit" : "Stop"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
