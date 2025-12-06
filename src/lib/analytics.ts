"use client";

import { ref, get, set, onValue, Unsubscribe } from "firebase/database";
import { getDatabaseInstance } from "@/lib/firebase";

export type PlayCountData = {
  id: string;
  playCount: number;
};

export type PingData = {
  timestamp: number;
  timestamp_iso: string;
};

export type PlayCountCallback = (data: PlayCountData) => void;
export type PingsCallback = (pings: PingData[]) => void;

export async function loadPlayCount(stationId: string): Promise<number> {
  try {
    const database = getDatabaseInstance();
    if (!database) {
      return 0;
    }

    const playCountRef = ref(database, `stations/${stationId}/playCount`);
    const snapshot = await get(playCountRef);

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
    const database = getDatabaseInstance();
    if (!database) {
      return 0;
    }

    const playCountRef = ref(database, `stations/${stationId}/playCount`);
    const currentSnapshot = await get(playCountRef);
    const currentCount = currentSnapshot.exists()
      ? (currentSnapshot.val() as number)
      : 0;
    const newCount = currentCount + 1;

    await set(playCountRef, newCount);
    return newCount;
  } catch {
    return 0;
  }
}

export async function recordPing(stationId: string): Promise<boolean> {
  try {
    const database = getDatabaseInstance();
    if (!database) {
      return false;
    }

    const timestamp = Date.now();
    const pingRef = ref(database, `stations/${stationId}/pings/${timestamp}`);

    await set(pingRef, {
      timestamp,
      timestamp_iso: new Date().toISOString(),
    });

    return true;
  } catch {
    return false;
  }
}

export async function loadPings(stationId: string): Promise<PingData[]> {
  try {
    const database = getDatabaseInstance();
    if (!database) {
      return [];
    }

    const pingsRef = ref(database, `stations/${stationId}/pings`);
    const snapshot = await get(pingsRef);

    if (snapshot.exists()) {
      const pingsObj = snapshot.val() as Record<string, PingData>;
      return Object.values(pingsObj);
    }
    return [];
  } catch {
    return [];
  }
}

export function subscribeToPlayCount(
  stationId: string,
  callback: PlayCountCallback
): Unsubscribe | null {
  try {
    const database = getDatabaseInstance();
    if (!database) {
      return null;
    }

    const playCountRef = ref(database, `stations/${stationId}/playCount`);

    return onValue(playCountRef, (snapshot) => {
      const playCount = snapshot.exists() ? (snapshot.val() as number) : 0;
      callback({ id: stationId, playCount });
    });
  } catch {
    return null;
  }
}

export function subscribeToPings(
  stationId: string,
  callback: PingsCallback
): Unsubscribe | null {
  try {
    const database = getDatabaseInstance();
    if (!database) {
      return null;
    }

    const pingsRef = ref(database, `stations/${stationId}/pings`);

    return onValue(pingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const pingsObj = snapshot.val() as Record<string, PingData>;
        const pings = Object.values(pingsObj);
        callback(pings);
      } else {
        callback([]);
      }
    });
  } catch {
    return null;
  }
}

export function subscribeToStationAnalytics(
  stationId: string,
  onPlayCountChange: PlayCountCallback,
  onPingsChange: PingsCallback
): {
  unsubscribePlayCount: Unsubscribe | null;
  unsubscribePings: Unsubscribe | null;
} {
  const unsubscribePlayCount = subscribeToPlayCount(
    stationId,
    onPlayCountChange
  );
  const unsubscribePings = subscribeToPings(stationId, onPingsChange);

  return { unsubscribePlayCount, unsubscribePings };
}

export async function trackStationPlay(stationId: string): Promise<boolean> {
  try {
    const countSuccess = await incrementPlayCount(stationId);
    const pingSuccess = await recordPing(stationId);
    return countSuccess > 0 && pingSuccess;
  } catch {
    return false;
  }
}
