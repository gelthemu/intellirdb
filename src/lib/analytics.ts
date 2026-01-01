"use client";

import { ref, get, set, onValue, Unsubscribe } from "firebase/database";
import { intellirdbDatabase as database } from "@/lib/firebase/firebase";

export type PlayCountData = {
  id: string;
  plays: number;
};

export type PlayCountCallback = (data: PlayCountData) => void;

export async function loadPlayCount(stationId: string): Promise<number> {
  try {
    if (!database) {
      return 0;
    }

    const playsRef = ref(database, `stations/${stationId}`);
    const snapshot = await get(playsRef);

    if (snapshot.exists()) {
      return snapshot.val() as number;
    }
    return 0;
  } catch {
    return 0;
  }
}

export async function incrementPlayCount(stationId: string): Promise<number> {
  try {
    if (!database) {
      return 0;
    }

    const playsRef = ref(database, `stations/${stationId}`);
    const currentSnapshot = await get(playsRef);
    const currentCount = currentSnapshot.exists()
      ? (currentSnapshot.val() as number)
      : 0;
    const newCount = currentCount + 1;

    await set(playsRef, newCount);
    return newCount;
  } catch {
    return 0;
  }
}

export function subscribeToPlayCount(
  stationId: string,
  callback: PlayCountCallback
): Unsubscribe | null {
  try {
    if (!database) {
      return null;
    }

    const playsRef = ref(database, `stations/${stationId}`);

    return onValue(playsRef, (snapshot) => {
      const plays = snapshot.exists() ? (snapshot.val() as number) : 0;
      callback({ id: stationId, plays });
    });
  } catch {
    return null;
  }
}

export function subscribeToStationAnalytics(
  stationId: string,
  onPlayCountChange: PlayCountCallback
): {
  unsubscribePlayCount: Unsubscribe | null;
} {
  const unsubscribePlayCount = subscribeToPlayCount(
    stationId,
    onPlayCountChange
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
