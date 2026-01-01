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
  id: string;
  name: string;
  filename: string;
  content: string;
}

export interface Track {
  track_artist: string;
  track_title: string;
  track_image: string;
  track_position: number;
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
