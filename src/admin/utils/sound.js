let enabled = false;
let audio = null;

export function enableSound() {
  enabled = true;
  if (!audio) {
    audio = new Audio('/notification.mp3');
    audio.volume = 0.8;
  }
  // Warm up by playing silently (required by some browsers after user gesture)
  audio.volume = 0;
  audio.play().then(() => {
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 0.8;
  }).catch(() => {});
}

export function isSoundEnabled() {
  return enabled;
}

export function playOrderChime() {
  if (!enabled || !audio) return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}
