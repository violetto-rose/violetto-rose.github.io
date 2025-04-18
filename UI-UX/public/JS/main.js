import { setupLoadingBar } from "./loadingBar.js";
import { populateSidebar, loadTutorialFromHash } from "./sidebar.js";
import { setupDarkMode } from "./darkMode.js";
import { setupSidebar } from "./sidebarToggle.js";
import { setupStructureView } from "./structureView.js";
import { setupSearch, setupSearchShortcut } from "./search.js";
import { configureCodeHighlighting } from "./prismHighlighter.js";
import { initThemeManager } from "./themeManager.js";
import { setupImageViewer } from "./imageHandler.js";
import { setupMenuAnimation } from "./menuManager.js";
import { enterFullscreen } from "./fullScreen.js";
import { feedbackHandler } from "./feedbackHandler.js";
import { setupTooltips } from "./tooltipHandler.js";

setupLoadingBar();
setupDarkMode();
setupSidebar();
setupStructureView();
enterFullscreen();
setupMenuAnimation();

document.addEventListener("DOMContentLoaded", () => {
  initThemeManager();
  // Configure marked renderer with code highlighting
  const renderer = new marked.Renderer();
  configureCodeHighlighting(renderer);
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
  populateSidebar();
  loadTutorialFromHash();
  setupImageViewer();
  setupSearch();
  setupSearchShortcut();
  feedbackHandler();
  setupTooltips();

  // Listen for hash changes
  window.addEventListener("hashchange", loadTutorialFromHash);
});
