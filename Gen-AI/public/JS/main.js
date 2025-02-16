import { populateSidebar, loadProgramsFromHash } from "./sidebar.js";
import { setupSidebar } from "./sidebarToggle.js";
import { setupSearch, setupSearchShortcut } from "./search.js";
import { setupImageViewer } from "./imageViewer.js";

document.addEventListener("DOMContentLoaded", () => {
  // Configure marked renderer
  const renderer = new marked.Renderer();
  marked.setOptions({ renderer: renderer });

  // Initialize modules
  populateSidebar();
  loadProgramsFromHash();
  setupSidebar();
  setupSearch();
  setupSearchShortcut();
  setupImageViewer();

  // Listen for hash changes
  window.addEventListener("hashchange", loadProgramsFromHash);
});
