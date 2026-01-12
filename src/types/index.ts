export interface PlayPing {
  ping: number;
  timestamp: string;
}

export interface Station {
  id: string;
  name: string;
  url: string;
  tagline?: string;
  location?: string;
  notes?: string;
}

export interface Visual {
  title: string;
  url: string;
}

export interface Doc {
  slug: string;
  title: string;
  publication_date?: string | null;
  content: string;
}

export interface Track {
  track_artist: string;
  track_title: string;
  track_image: string;
  track_preview?: string;
  track_position: number;
  track_previous_position?: number | null | "returning";
}

export interface ChartWeek {
  id: string;
  tracks: Track[];
  fallouts: Track[];
  bonus: Track[];
  date: string;
  label: string;
  host: string;
}

export interface ChartData {
  [key: string]: ChartWeek;
}
