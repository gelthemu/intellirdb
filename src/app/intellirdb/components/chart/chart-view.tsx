"use client";

import React from "react";
import TrackCard from "./track-card";
import FalloutsList from "./fallouts-list";
import BonusList from "./bonus-list";
import { ChartWeek } from "@/types";

interface ChartViewProps {
  chart: ChartWeek;
  openDeepView: (id: string) => void;
}

const ChartView: React.FC<ChartViewProps> = ({ chart, openDeepView }) => {
  return (
    <div className="w-full h-full p-0 overflow-hidden relative overflow-y-auto pr-1">
      <div className="min-h-screen space-y-6 overflow-hidden">
        <div className="grid grid-cols-1 gap-1">
          {chart.tracks.map((track, index) => (
            <TrackCard
              key={track.track_position || index}
              track={track}
              openDeepView={openDeepView}
              chart={chart}
            />
          ))}
        </div>
        <div>
          {chart.id === "at40" &&
            chart.fallouts &&
            chart.fallouts.length > 0 && (
              <FalloutsList fallouts={chart.fallouts} />
            )}
        </div>
        <div>
          {(chart.id === "kt10" || chart.id === "kt10_2025") &&
            chart.bonus &&
            chart.bonus.length > 0 && <BonusList bonus={chart.bonus} />}
        </div>
      </div>
      <div className="w-full h-24 bg-transparent"></div>
    </div>
  );
};

export default ChartView;
