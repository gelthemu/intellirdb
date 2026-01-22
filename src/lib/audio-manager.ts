type AudioType = "radio" | "preview";

class AudioManager {
  private currentlyPlaying: AudioType | null = null;
  private listeners: Set<(type: AudioType | null) => void> = new Set();

  setPlaying(type: AudioType) {
    if (this.currentlyPlaying !== type) {
      this.currentlyPlaying = type;
      this.notifyListeners();
    }
  }

  stop() {
    this.currentlyPlaying = null;
    this.notifyListeners();
  }

  getCurrentlyPlaying() {
    return this.currentlyPlaying;
  }

  subscribe(callback: (type: AudioType | null) => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.currentlyPlaying));
  }
}

export const audioManager = new AudioManager();
