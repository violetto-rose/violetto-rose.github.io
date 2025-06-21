// Handle GitHub Pages 404 redirect
(function() {
  var redirect = sessionStorage.redirect;
  delete sessionStorage.redirect;
  if (redirect && redirect != location.href) {
    history.replaceState(null, null, redirect);
  }
})();

import { setupLoadingOverlay } from "./loading.js";
import { populateSidebar, loadTutorialFromPath } from "./sidebar.js";
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
import { setupTooltips, setupTooltipObserver } from "./tooltipHandler.js";
import { setupSounds } from "./soundHandler.js";
import { showUpdateNotification } from "./notificationHandler.js";
import { initializeAuth } from './auth.js';

// setupLoadingOverlay();
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
    if (!href.href.startsWith("http://") && !href.href.startsWith("https://")) {
      return link
        .replace("<a", '<a target="_self" rel="noopener noreferrer"')
        .replace('href="', 'href="/UI-UX/');
    }
    return link.replace("<a", '<a target="_blank" rel="noopener noreferrer"');
  };

  marked.setOptions({ renderer: renderer });

  // Initialize modules
  populateSidebar();
  loadTutorialFromPath();
  setupImageViewer();
  setupSearch();
  setupSearchShortcut();
  feedbackHandler();
  setupTooltips();
  setupTooltipObserver();
  setupSounds();
  initializeAuth();
  setTimeout(() => {
    showUpdateNotification();
  }, 8000);

  // Listen for popstate events (back/forward button)
  window.addEventListener("popstate", loadTutorialFromPath);
});
