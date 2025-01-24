import { populateSidebar, loadTutorialFromHash } from "./sidebar.js"
import { setupDarkMode } from "./darkMode.js"
import { setupSidebar } from "./sidebarToggle.js"
import { setupStructureView } from "./structureView.js"
import { setupSearch } from "./search.js"

document.addEventListener("DOMContentLoaded", () => {
  // Configure marked renderer
  const renderer = new marked.Renderer()
  const originalLinkRenderer = renderer.link
  renderer.link = function (href, title, text) {
    const link = originalLinkRenderer.call(this, href, title, text)
    return link.replace("<a", '<a target="_blank" rel="noopener noreferrer"')
  }

  marked.setOptions({ renderer: renderer })

  // Initialize modules
  populateSidebar()
  loadTutorialFromHash()
  setupDarkMode()
  setupSidebar()
  setupStructureView()
  setupSearch()

  // Listen for hash changes
  window.addEventListener("hashchange", loadTutorialFromHash)
})

