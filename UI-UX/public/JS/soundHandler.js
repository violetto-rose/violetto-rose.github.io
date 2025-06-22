// Sound state management
let soundEnabled = true;
let clickSound = null;

// Initialize sound settings from localStorage
function initSoundSettings() {
  const savedSoundState = localStorage.getItem('soundEnabled');
  if (savedSoundState !== null) {
    soundEnabled = JSON.parse(savedSoundState);
  }
  updateSoundToggleUI();
}

// Update the sound toggle button appearance
function updateSoundToggleUI() {
  const soundToggle = document.getElementById('sound-toggle');
  if (soundToggle) {
    const volumeHighIcon = soundToggle.querySelector('.fa-volume-high');
    const volumeXmarkIcon = soundToggle.querySelector('.fa-volume-xmark');
    
    if (soundEnabled) {
      if (volumeHighIcon) volumeHighIcon.style.display = 'block';
      if (volumeXmarkIcon) volumeXmarkIcon.style.display = 'none';
      soundToggle.setAttribute('aria-label', 'Mute Sound');
    } else {
      if (volumeHighIcon) volumeHighIcon.style.display = 'none';
      if (volumeXmarkIcon) volumeXmarkIcon.style.display = 'block';
      soundToggle.setAttribute('aria-label', 'Unmute Sound');
    }
  }
}

// Toggle sound on/off
function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  updateSoundToggleUI();
  
  // Play a test sound when enabling (if not on mobile)
  if (soundEnabled && clickSound && !isMobile()) {
    const testSound = clickSound.cloneNode();
    testSound.volume = 0.3;
    testSound.play().catch(() => {
      // Silently fail if audio can't be played
    });
  }
}

// Check if device is mobile
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Play click sound if enabled
function playClickSound() {
  if (soundEnabled && clickSound && !isMobile()) {
    const soundClone = clickSound.cloneNode();
    soundClone.volume = 0.3;
    soundClone.play().catch(() => {
      // Silently fail if audio can't be played
    });
  }
}

export function setupSounds() {
  // Initialize sound settings
  initSoundSettings();
  
  // Expose playClickSound globally for modules that use stopPropagation
  window.playClickSound = playClickSound;
  
  // Don't initialize audio on mobile devices by default
  if (isMobile()) {
    return;
  }

  // Create audio element for click sound
  clickSound = new Audio();
  clickSound.src = "./public/assets/click.mp3";
  if (!clickSound.src) {
    console.error("Click sound not found");
    return;
  }
  clickSound.preload = "auto";
  clickSound.volume = 0.3;

  // Setup sound toggle button
  const soundToggle = document.getElementById('sound-toggle');
  if (soundToggle) {
    soundToggle.addEventListener('click', toggleSound);
  }

  // Add click event listeners to all interactive elements
  document.addEventListener("click", (e) => {
    // Skip if the clicked element is the sound toggle itself
    if (e.target.closest('#sound-toggle')) {
      return;
    }
    
    if (
      e.target.closest("button") ||
      e.target.closest(".title") ||
      e.target.closest(".structure-item") ||
      e.target.closest(".structure-section") ||
      e.target.closest(".structure-subsection") ||
      (e.target.closest("a") && e.target.closest("li") && e.target.closest("ul") && e.target.closest("#tutorial-list"))
    ) {
      playClickSound();
    }
  });
}
