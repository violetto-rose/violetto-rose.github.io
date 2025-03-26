import { populateSidebar, loadTutorialFromHash } from "./sidebar.js";
import { setupDarkMode } from "./darkMode.js";
import { setupSidebar } from "./sidebarToggle.js";
import { setupStructureView } from "./structureView.js";
import { setupSearch, setupSearchShortcut } from "./search.js";
import { setupImageViewer } from "./imageHandler.js";
import { setupMenuAnimation } from "./menuManager.js";
import { enterFullscreen } from "./fullScreen.js";
import { feedbackHandler } from "./feedbackHandler.js";

document.addEventListener("DOMContentLoaded", () => {
  // Configure marked renderer
  const renderer = new marked.Renderer();
  const originalLinkRenderer = renderer.link;
  renderer.link = function (href, title, text) {
    const link = originalLinkRenderer.call(this, href, title, text);
    if (!href.href.startsWith("https")) {
      return link
        .replace("<a", '<a target="_self" rel="noopener noreferrer"')
        .replace('href="', 'href="#');
    }
    return link.replace("<a", '<a target="_blank" rel="noopener noreferrer"');
  };

  marked.setOptions({ renderer: renderer });

  // Initialize modules
  enterFullscreen();
  populateSidebar();
  loadTutorialFromHash();
  setupDarkMode();
  setupSidebar();
  setupStructureView();
  setupSearch();
  setupSearchShortcut();
  setupImageViewer();
  setupMenuAnimation();
  feedbackHandler();

  // Listen for hash changes
  window.addEventListener("hashchange", loadTutorialFromHash);
});
