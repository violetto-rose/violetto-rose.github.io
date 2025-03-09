export function setupSidebar() {
  const sidebar = document.getElementById("sidebar")
  const sidebarToggle = document.getElementById("sidebar-toggle")

  function toggleSidebar() {
    sidebar.classList.toggle("open")
    sidebarToggle.classList.toggle("open")

    const barsIcon = sidebarToggle.querySelector(".fa-bars")
    const barsStaggeredIcon = sidebarToggle.querySelector(".fa-bars-staggered")

    if (sidebar.classList.contains("open")) {
      barsIcon.style.display = "none"
      barsStaggeredIcon.style.display = "flex"
    } else {
      barsIcon.style.display = "flex"
      barsStaggeredIcon.style.display = "none"
    }
  }

  // Toggle sidebar when button is clicked
  sidebarToggle.addEventListener("click", (e) => {
    e.stopPropagation()
    toggleSidebar()
    if (document.getElementById("structure-view").classList.contains("open")) {
      closeStructureView()
    }
  })

  // Close sidebar when clicking outside (for mobile)
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) {
      const isOutsideSidebar = !sidebar.contains(e.target)
      const isNotToggleButton = !sidebarToggle.contains(e.target)
      const isNotDarkModeToggle = !document.getElementById("dark-mode-toggle").contains(e.target)

      if (isOutsideSidebar && isNotToggleButton && isNotDarkModeToggle) {
        if (sidebar.classList.contains("open")) {
          toggleSidebar()
        }
      }
    }
  })

  // Close sidebar when window is resized above tablet breakpoint
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      sidebar.classList.remove("open")
      sidebarToggle.classList.remove("open")
      document.body.style.overflow = ""

      const barsIcon = sidebarToggle.querySelector(".fa-bars")
      const barsStaggeredIcon = sidebarToggle.querySelector(".fa-bars-staggered")
      barsIcon.style.display = "flex"
      barsStaggeredIcon.style.display = "none"
    }
  })
}

