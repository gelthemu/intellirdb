"use client";

import React, { useEffect } from "react";
import { useWindow } from "@/app/contexts/window";
import data from "@/data/charts.json";
import { ChartData } from "@/types";
import ChartsList from "@/app/intellirdb/components/chart/charts-list";
import ChartView from "@/app/intellirdb/components/chart/chart-view";
import TrackDetails from "@/app/intellirdb/components/chart/track-details";

const chartsData = data as ChartData;

const Charts: React.FC = () => {
  const {
    currentFolder,
    subView,
    deepView,
    openSubView,
    openDeepView,
    setDialogTitle,
  } = useWindow();
  const charts = chartsData;

  const selectedChart = subView
    ? Object.values(charts).find((c) => c.id === subView)
    : undefined;

  useEffect(() => {
    if (deepView?.startsWith("no.") && selectedChart) {
      const index = deepView.split(".");
      const track = selectedChart.tracks.find(
        (t) => t.track_position === parseInt(index[1])
      );
      if (track) {
        setDialogTitle(`#${track.track_position} - ${track.track_title}`);
      }
      return;
    }

    if (subView && selectedChart) {
      setDialogTitle(selectedChart.label || "Chart");
      return;
    }

    if (currentFolder === "charts") {
      setDialogTitle("Charts");
      return;
    }
  }, [subView, deepView, selectedChart, setDialogTitle, currentFolder]);

  const trackDetails = deepView?.startsWith("no.") ? deepView : null;

  if (trackDetails) {
    const index = trackDetails.split(".");
    const track = selectedChart?.tracks.find(
      (t) => t.track_position === parseInt(index[1])
    );

    if (!track || !selectedChart) {
      return (
        <div className="px-3 py-2">
          <div>Not found . . .</div>
        </div>
      );
    }

    return <TrackDetails track={track} />;
  }

  if (subView && selectedChart) {
    const chart = selectedChart;

    if (!chart) {
      return (
        <div className="px-3 py-2">
          <div>Not found . . .</div>
        </div>
      );
    }
    return <ChartView chart={chart} openDeepView={openDeepView} />;
  }

  return <ChartsList charts={charts} openSubView={openSubView} />;
};

export default Charts;
