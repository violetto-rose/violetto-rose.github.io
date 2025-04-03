export function setupSidebar() {
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebar-toggle");

  function toggleSidebar() {
    sidebar.classList.toggle("open");

  }

  // Toggle sidebar when button is clicked
  sidebarToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleSidebar();
  });

  // Close sidebar when clicking outside (for mobile)
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 1080) {
      const isOutsideSidebar = !sidebar.contains(e.target);
      const isNotToggleButton = !sidebarToggle.contains(e.target);
      if (isOutsideSidebar && isNotToggleButton) {
        if (sidebar.classList.contains("open")) {
          toggleSidebar();
        }
      }
    }
  });

  // Close sidebar when window is resized above tablet breakpoint
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) {
      sidebar.classList.remove("open");
      sidebarToggle.classList.remove("open");
      document.body.style.overflow = "";

      const barsIcon = sidebarToggle.querySelector(".fa-bars");
      barsIcon.style.display = "flex";
    }
  });
}
