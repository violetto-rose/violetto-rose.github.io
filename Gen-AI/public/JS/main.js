import { populateSidebar, loadProgramsFromHash } from "./sidebar.js";
import { setupSidebar } from "./sidebarToggle.js";
import { setupSearch, setupSearchShortcut } from "./search.js";
import { setupImageViewer } from "./imageViewer.js";
import { configureCodeHighlighting } from "./prismHighlighter.js";
import { initThemeManager } from "./themeManager.js";
import { setupMenuAnimation } from "./menuManager.js";

document.addEventListener("DOMContentLoaded", () => {
  initThemeManager();
  // Configure marked renderer with code highlighting
  const renderer = new marked.Renderer();
  configureCodeHighlighting(renderer);
  marked.setOptions({ renderer: renderer });

  // Initialize modules
  populateSidebar();
  loadProgramsFromHash();
  setupSidebar();
  setupSearch();
  setupSearchShortcut();
  setupImageViewer();
  setupMenuAnimation();

  // Listen for hash changes
  window.addEventListener("hashchange", loadProgramsFromHash);
});