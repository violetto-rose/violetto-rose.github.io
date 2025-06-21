export function setupSounds() {
  // Check if device is mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Don't play sounds on mobile devices by default
  if (isMobile) {
    return;
  }

  // Create audio element for click sound
  const clickSound = new Audio();
  clickSound.src = "./public/assets/click.mp3";
  if (!clickSound.src) {
    console.error("Click sound not found");
    return;
  }
  clickSound.preload = "auto";

  // Set volume to a reasonable level
  clickSound.volume = 0.3;

  // Add click event listeners to all .toggle elements, elements with IDs starting with "close-", and more-info
  document.addEventListener("click", (e) => {
    if (
      e.target.closest(".toggle") ||
      (e.target.id && e.target.id.startsWith("close-")) ||
      e.target.closest("#more-info")
    ) {
      // Clone and play the sound to allow multiple rapid clicks
      const soundClone = clickSound.cloneNode();
      soundClone.volume = 0.3;
      soundClone.play().catch(() => {
        // Silently fail if audio can't be played (e.g., no user interaction yet)
      });
    }
  });
}
