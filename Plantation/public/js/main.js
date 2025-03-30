// Main JavaScript functionality

document.addEventListener("DOMContentLoaded", function () {
  // Navigation toggle for mobile
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("active");

      // Change icon based on menu state
      const icon = this.querySelector("i");
      if (navLinks.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
      } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    });
  }

  // Close mobile menu when clicking a link
  const navItems = document.querySelectorAll(".nav-links a");
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        const icon = navToggle.querySelector("i");
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    });
  });

  // Tabs functionality
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons and panes
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabPanes.forEach((pane) => pane.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Show corresponding tab pane
      const tabId = this.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
    });
  });

  // Back to top button
  const backToTopButton = document.getElementById("back-to-top");

  if (backToTopButton) {
    // Add accessibility attributes to the back-to-top button
    backToTopButton.setAttribute("aria-label", "Back to top");
    backToTopButton.setAttribute("title", "Back to top");

    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add("visible");
      } else {
        backToTopButton.classList.remove("visible");
      }
    });

    backToTopButton.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Navbar scroll effect
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Dark mode toggle
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const body = document.body;
  
  // Check for saved dark mode preference
  if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
    updateDarkModeIcon(true);
  }
  
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", function() {
      if (body.classList.contains("dark-mode")) {
        body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "disabled");
        updateDarkModeIcon(false);
      } else {
        body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "enabled");
        updateDarkModeIcon(true);
      }
    });
  }
  
  function updateDarkModeIcon(isDarkMode) {
    const icon = darkModeToggle.querySelector("i");
    if (isDarkMode) {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    } else {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
    }
  }
});
