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

export async function incrementPlayCount(stationId: string): Promise<number> {
  try {
    if (!database) {
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

export async function trackStationPlay(stationId: string): Promise<boolean> {
  try {
    const countSuccess = await incrementPlayCount(stationId);
    return countSuccess > 0;
  } catch {
    return false;
  }
}
