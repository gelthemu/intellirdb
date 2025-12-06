"use client";

import React from "react";
import { Assets, AssetView, assets } from "@/app/content/assets";
import { Radio, StationInfo } from "@/app/content/radio";
import Coinflip from "@/app/content/coinflip";
import About from "@/app/content/about";
import { IntelliURL, TransAudio } from "@/app/content/explore";
import radioData from "@/data/radio.json";
import { Station, Asset } from "@/types";
import { Content } from "./use-dialog-stack";

export function createFromId(id: string): Content | null {
  if (id.startsWith("station-")) {
    const stationId = id.replace("station-", "");
    const station = (radioData as Station[]).find((s) => s.id === stationId);

    if (station) {
      return {
        id,
        title: station.name,
        component: React.createElement(StationInfo, {
          station,
          isOpen: true,
          onPlay: () => {},
        }),
      };
    }
    return null;
  }

  if (id.startsWith("asset-")) {
    const assetId = id.replace("asset-", "");
    const asset = (assets as Asset[]).find(
      (a) => a.title.toLowerCase().replace(/\s+/g, "-") === assetId
    );

    if (asset) {
      return {
        id,
        title: asset.title,
        component: React.createElement(AssetView, {
          asset,
        }),
      };
    }
    return null;
  }

  switch (id) {
    case "assets":
      return {
        id: "assets",
        title: "Assets",
        component: React.createElement(Assets, { isOpen: true }),
      };

    case "radio":
      return {
        id: "radio",
        title: "Radio",
        component: React.createElement(Radio, { isOpen: true }),
      };

    case "coinflip":
      return {
        id: "coinflip",
        title: "Coinflip",
        component: React.createElement(Coinflip, { isOpen: true }),
      };

    case "about":
      return {
        id: "about",
        title: "About",
        component: React.createElement(About, { isOpen: true }),
      };

    case "intelliurl":
      return {
        id: "intelliurl",
        title: "intelliURL",
        component: React.createElement(IntelliURL, { isOpen: true }),
      };

    case "transaudio":
      return {
        id: "transaudio",
        title: "TransAudio",
        component: React.createElement(TransAudio, { isOpen: true }),
      };

    default:
      return null;
  }
}
