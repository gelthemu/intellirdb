"use client";

import { ref, get, set, onValue, Unsubscribe } from "firebase/database";
import { intellirdbDatabase as database } from "@/lib/firebase/firebase";
import { formatInTimeZone } from "date-fns-tz";

export type StationData = {
  plays: number;
  last_updated: string;
};

export type PlayCountData = {
  id: string;
  plays: number;
  last_updated: string;
};

export type PlayCountCallback = (data: PlayCountData) => void;

export type RecentlyPlayedStation = {
  stationName: string;
  lastPlayed: number;
};

export type RecentlyPlayedData = {
  [stationId: string]: RecentlyPlayedStation;
};

const RECENTLY_PLAYED_KEY = "recently-played";
const RATE_LIMIT_MINUTES = 10;

function getRecentlyPlayed(): RecentlyPlayedData {
  try {
    const data = localStorage.getItem(RECENTLY_PLAYED_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function setRecentlyPlayed(data: RecentlyPlayedData): void {
  try {
    localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(data));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

function canIncrementPlayCount(stationId: string): boolean {
  const recentlyPlayed = getRecentlyPlayed();
  const stationData = recentlyPlayed[stationId];

  if (!stationData) {
    return true;
  }

  const now = Date.now();
  const timeSinceLastPlay = now - stationData.lastPlayed;
  const fiveMinutesInMs = RATE_LIMIT_MINUTES * 60 * 1000;

  return timeSinceLastPlay >= fiveMinutesInMs;
}

function updateRecentlyPlayed(stationId: string, stationName: string): void {
  const recentlyPlayed = getRecentlyPlayed();
  recentlyPlayed[stationId] = {
    stationName,
    lastPlayed: Date.now(),
  };
  setRecentlyPlayed(recentlyPlayed);
}

export async function loadPlayCount(stationId: string): Promise<number> {
  try {
    if (!database) {
      return 0;
    }

    const stationRef = ref(database, `stations/${stationId}`);
    const snapshot = await get(stationRef);

    if (snapshot.exists()) {
      const data = snapshot.val() as StationData;
      return data.plays;
    }
    return 0;
  } catch {
    return 0;
  }
}

export async function getStationData(
  stationId: string,
): Promise<StationData | null> {
  try {
    if (!database) {
      return null;
    }

    const stationRef = ref(database, `stations/${stationId}`);
    const snapshot = await get(stationRef);

    if (snapshot.exists()) {
      return snapshot.val() as StationData;
    }
    return null;
  } catch {
    return null;
  }
}

export async function incrementPlayCount(
  stationId: string,
  stationName: string = "",
): Promise<number> {
  try {
    if (!database) {
      return 0;
    }

    if (!canIncrementPlayCount(stationId)) {
      const currentSnapshot = await get(ref(database, `stations/${stationId}`));
      if (currentSnapshot.exists()) {
        const data = currentSnapshot.val() as StationData;
        return data.plays;
      }
      return 0;
    }

    const stationRef = ref(database, `stations/${stationId}`);
    const currentSnapshot = await get(stationRef);

    let currentCount = 0;
    if (currentSnapshot.exists()) {
      const data = currentSnapshot.val() as StationData;
      currentCount = data.plays;
    }

    const newCount = currentCount + 1;
    const stationData: StationData = {
      plays: newCount,
      last_updated: formatInTimeZone(
        new Date(),
        "Africa/Kampala",
        "yyyy-MM-dd HH:mm:ss zzz",
      ),
    };

    await set(stationRef, stationData);

    // Update recently played tracking
    updateRecentlyPlayed(stationId, stationName);

    return newCount;
  } catch {
    return 0;
  }
}

export function subscribeToPlayCount(
  stationId: string,
  callback: PlayCountCallback,
): Unsubscribe | null {
  try {
    if (!database) {
      return null;
    }

    const stationRef = ref(database, `stations/${stationId}`);

    return onValue(stationRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as StationData;
        callback({
          id: stationId,
          plays: data.plays,
          last_updated: data.last_updated,
        });
      } else {
        callback({
          id: stationId,
          plays: 0,
          last_updated: "",
        });
      }
    });
  } catch {
    return null;
  }
}

export function subscribeToStationAnalytics(
  stationId: string,
  onPlayCountChange: PlayCountCallback,
): {
  unsubscribePlayCount: Unsubscribe | null;
} {
  const unsubscribePlayCount = subscribeToPlayCount(
    stationId,
    onPlayCountChange,
  );

  return { unsubscribePlayCount };
}

export async function trackStationPlay(
  stationId: string,
  stationName: string = "",
): Promise<boolean> {
  try {
    const countSuccess = await incrementPlayCount(stationId, stationName);
    return countSuccess > 0;
  } catch {
    return false;
  }
}
