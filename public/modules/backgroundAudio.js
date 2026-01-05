let backgroundAudio = null;
let hasStarted = false;
let fadeInterval = null;
let isPaused = false;

// Initialize background audio
export function initializeBackgroundAudio() {
  // Create audio element
  backgroundAudio = new Audio('./public/assets/Rainy Morning — Zackross.mp3');
  backgroundAudio.loop = true;
  backgroundAudio.volume = 0;
  backgroundAudio.preload = 'auto';

  // Handle audio errors
  backgroundAudio.addEventListener('error', (e) => {
    console.warn('Background audio failed to load:', e);
  });

  // Set up click listener to start playback
  const startAudio = () => {
    if (hasStarted) return;

    hasStarted = true;

    // Start playing
    backgroundAudio.play().catch((error) => {
      console.warn('Audio playback failed:', error);
      hasStarted = false; // Reset if play fails
    });

    // Start slow volume fade-in
    fadeInVolume();

    // Remove click listener after first click
    document.removeEventListener('click', startAudio);
    document.removeEventListener('touchstart', startAudio);
  };

  // Listen for both click and touch events
  document.addEventListener('click', startAudio, { once: true });
  document.addEventListener('touchstart', startAudio, { once: true });
}

// Toggle pause/play
export function toggleAudio() {
  if (!backgroundAudio) {
    return 'Not Started';
  }

  if (!hasStarted) {
    // If audio hasn't started yet, start it
    hasStarted = true;
    backgroundAudio.play().catch((error) => {
      console.warn('Audio playback failed:', error);
      hasStarted = false;
      return 'Not Started';
    });
    fadeInVolume();
    return 'Pause';
  }

  if (isPaused) {
    backgroundAudio.play();
    isPaused = false;
    return 'Pause';
  } else {
    backgroundAudio.pause();
    isPaused = true;
    return 'Play';
  }
}

// Get current audio state
export function getAudioState() {
  if (!backgroundAudio || !hasStarted) return 'not-started';
  return isPaused ? 'paused' : 'playing';
}

// Slowly fade in the volume
function fadeInVolume() {
  const targetVolume = 0.3; // Target volume (30%)
  const fadeDuration = 5000; // 5 seconds fade-in
  const steps = 50; // Number of steps for smooth fade
  const stepDuration = fadeDuration / steps;
  const volumeIncrement = targetVolume / steps;

  let currentStep = 0;

  fadeInterval = setInterval(() => {
    currentStep++;
    const newVolume = Math.min(volumeIncrement * currentStep, targetVolume);
    backgroundAudio.volume = newVolume;

    if (currentStep >= steps || backgroundAudio.volume >= targetVolume) {
      clearInterval(fadeInterval);
      backgroundAudio.volume = targetVolume;
    }
  }, stepDuration);
}
