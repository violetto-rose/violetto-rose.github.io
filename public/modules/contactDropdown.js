import { toggleAudio, getAudioState } from './backgroundAudio.js';

export function initializeContactDropdown() {
  const button = document.getElementById('contact-button');
  const dropdown = document.getElementById('contact-dropdown');
  const audioControlButton = document.getElementById('audio-control-button');
  const audioControlIcon = document.getElementById('audio-control-icon');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');

  if (!button || !dropdown) return;

  // Function to update audio icon based on state
  const updateAudioIcon = () => {
    if (!playIcon || !pauseIcon) return;

    const state = getAudioState();
    if (state === 'playing') {
      // Show pause icon, hide play icon
      playIcon.classList.add('icon-hidden');
      pauseIcon.classList.remove('pause-icon-hidden');
    } else {
      // Show play icon, hide pause icon
      playIcon.classList.remove('icon-hidden');
      pauseIcon.classList.add('pause-icon-hidden');
    }
  };

  // Toggle dropdown on button click
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('active');

    // Update audio control icon when dropdown opens
    if (dropdown.classList.contains('active')) {
      updateAudioIcon();
    }
  });

  // Audio control button
  if (audioControlButton) {
    audioControlButton.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAudio();
      updateAudioIcon();
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!button.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });

  // Close dropdown when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropdown.classList.contains('active')) {
      dropdown.classList.remove('active');
    }
  });
}
