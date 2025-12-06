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

export interface Asset {
  title: string;
  url: string;
}
