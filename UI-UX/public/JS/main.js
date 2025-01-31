import { populateSidebar, loadTutorialFromHash } from "./sidebar.js";
import { setupDarkMode } from "./darkMode.js";
import { setupSidebar } from "./sidebarToggle.js";
import { setupStructureView } from "./structureView.js";
import { setupSearch } from "./search.js";
import { setupImageViewer } from "./imageViewer.js";

document.addEventListener("DOMContentLoaded", () => {
  // Configure marked renderer
  const renderer = new marked.Renderer();
  const originalLinkRenderer = renderer.link;
  renderer.link = function (href, title, text) {
    const link = originalLinkRenderer.call(this, href, title, text);
    if (!href.href.startsWith("https")) {
      return link.replace("<a", '<a target="_blank" rel="noopener noreferrer"').replace('href="', 'href="#');
    }
    return link.replace("<a", '<a target="_self" rel="noopener noreferrer"');
  };

  marked.setOptions({ renderer: renderer });

  // Initialize modules
  populateSidebar();
  loadTutorialFromHash();
  setupDarkMode();
  setupSidebar();
  setupStructureView();
  setupSearch();
  setupImageViewer();

  // Listen for hash changes
  window.addEventListener("hashchange", loadTutorialFromHash);

  // // Register service worker
  // if ("serviceWorker" in navigator) {
  //   window.addEventListener("load", () => {
  //     navigator.serviceWorker
  //       .register("sw.js")
  //       .then((registration) => {
  //         console.log(
  //           "Service Worker registered with scope:",
  //           registration.scope
  //         );
  //       })
  //       .catch((error) => {
  //         console.error("Service Worker registration failed:", error);
  //       });
  //   });
  // }
});
