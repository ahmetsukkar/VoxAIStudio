let currentAudio: HTMLAudioElement | null = null;
let currentStopCallback: (() => void) | null = null;

export const audioManager = {
  // Call this when a NEW audio wants to play
  register(audio: HTMLAudioElement, onStop: () => void) {
    // Stop whatever is currently playing first
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentStopCallback?.();
    }
    currentAudio = audio;
    currentStopCallback = onStop;
  },

  // Call this to stop everything
  stopAll() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentStopCallback?.();
      currentAudio = null;
      currentStopCallback = null;
    }
  },

  getCurrent() {
    return currentAudio;
  },
};
