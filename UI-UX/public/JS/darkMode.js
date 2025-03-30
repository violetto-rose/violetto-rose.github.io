export function setupDarkMode() {
  const darkModeToggle = document.getElementById("theme-toggle");
  const systemPrefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  );

  // Function to apply dark mode
  function applyDarkMode(isDark) {
    document.body.classList.toggle("dark-mode", isDark);
    darkModeToggle.classList.toggle("dark-mode", isDark);
  }

  // Check for saved preference or system preference
  const savedDarkMode = localStorage.getItem("darkMode");
  const initialDarkMode =
    savedDarkMode === "enabled"
      ? true
      : savedDarkMode === "disabled"
        ? false
        : systemPrefersDarkMode.matches;

  applyDarkMode(initialDarkMode);

  // Dark mode toggle event
  darkModeToggle.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark-mode");
    applyDarkMode(isDark);

    // Save preference
    if (isDark) {
      localStorage.setItem("darkMode", "enabled");
    } else {
      localStorage.setItem("darkMode", "disabled");
    }
  });

  // Listen for system dark mode changes
  systemPrefersDarkMode.addEventListener("change", (e) => {
    // Only change if no explicit user preference is set
    if (savedDarkMode === null) {
      applyDarkMode(e.matches);
    }
  });
}
