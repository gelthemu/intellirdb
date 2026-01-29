"use client";

import { useRadio } from "@/app/contexts/radio";
import { cn } from "@/lib/cn";

export default function AudioControls() {
  const radio = useRadio();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (radio.currentStation && radio.playState === "playing") {
      radio.pause();
      return;
    }

    if (radio.currentStation && radio.playState === "paused") {
      radio.play(radio.currentStation);
      return;
    }
  };

  const getButtonText = () => {
    switch (radio.playState) {
      case "loading":
        return "Loading...";
      case "playing":
        return "Pause";
      case "paused":
        return "Resume";
      case "error":
        return "Error";
      default:
        return "Play";
    }
  };

  return (
    <div className={cn("w-fit flex flex-row items-center gap-2 px-1")}>
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <div className="flex flex-row items-center gap-1">
          <div
            role={
              radio.playState == "loading" || radio.playState === "error"
                ? undefined
                : "button"
            }
            tabIndex={0}
            onClick={handleClick}
            className={cn(
              "px-2 py-px focus:outline-none select-none",
              radio.playState == "loading" || radio.playState === "error"
                ? "cursor-default"
                : "cursor-pointer",
              radio.playState !== "loading" ? "border border-dark" : "",
              radio.playState === "error"
                ? "bg-red-500 text-light"
                : radio.playState === "loading"
                  ? "bg-transparent text-dark"
                  : "bg-dark text-light",
            )}
          >
            {getButtonText()}
          </div>
          {(radio.playState === "playing" ||
            radio.playState === "paused" ||
            radio.playState === "error") && (
            <div
              role="button"
              tabIndex={0}
              onClick={radio.stop}
              className="px-2 py-px text-dark bg-transparent border border-dark cursor-pointer focus:outline-none select-none"
            >
              {radio.playState === "error" ? "Exit" : "Stop"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
