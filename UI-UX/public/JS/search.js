import { tutorials } from "./sidebar.js";
import { loadTutorial, updateActiveLink } from "./utils.js";

function closeSearch() {
  const searchInput = document.getElementById("search-input");
  const searchHint = document.querySelector(".search-shortcut-hint");
  const searchResults = document.getElementById("search-results");

  searchResults.style.display = "none";
  searchInput.value = "";
  if (searchHint && window.innerWidth >= 1080) {
    searchHint.style.opacity = "0.7";
  }
  searchInput.blur();
}

export function setupSearch() {
  const searchInput = document.getElementById("search-input");
  const searchHint = document.querySelector(".search-shortcut-hint");
  const searchResults = document.getElementById("search-results");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filteredTutorials = tutorials.filter((tutorial) =>
        tutorial.name.toLowerCase().includes(searchTerm)
      );

      searchResults.innerHTML = "";

      // Show/hide search results based on input
      if (searchTerm.length > 0 && filteredTutorials.length > 0) {
        if (searchHint) searchHint.style.opacity = "0";
        searchResults.style.display = "block";
        filteredTutorials.forEach((tutorial) => {
          const div = document.createElement("div");
          div.innerHTML = `${tutorial.name}`;
          div.onclick = () => {
            loadTutorial(tutorial.file);
            updateActiveLink(
              document.querySelector(
                `#tutorial-list a[href="#${tutorial.file}"]`
              )
            );
            closeSearch();
          };
          searchResults.appendChild(div);
        });
      } else {
        searchResults.style.display = "none";
        if (searchHint && !searchInput.value && window.innerWidth >= 1080) {
          searchHint.style.opacity = "0.7";
        }
      }
    });
  }

  // Close search results when clicking outside
  document.addEventListener("click", (e) => {
    if (
      searchInput &&
      searchResults &&
      !searchInput.contains(e.target) &&
      !searchResults.contains(e.target)
    ) {
      closeSearch();
    }
  });

  // Handle focus/blur events
  if (searchInput && searchHint) {
    searchInput.addEventListener("focus", () => {
      searchHint.style.opacity = "0";
    });

    searchInput.addEventListener("blur", () => {
      if (
        !searchInput.value &&
        searchResults.style.display !== "block" &&
        window.innerWidth >= 1080
      ) {
        searchHint.style.opacity = "0.7";
      }
    });
  }

  // Close sidebar when search result is clicked (mobile only)
  if (searchResults) {
    searchResults.addEventListener("click", () => {
      const sidebar = document.getElementById("sidebar");
      if (window.innerWidth <= 768 && sidebar.classList.contains("open")) {
        toggleSidebar();
      }
    });
  }
}

// Function for CTRL + K
export function setupSearchShortcut() {
  const searchInput = document.getElementById("search-input");
  const searchHint = document.querySelector(".search-shortcut-hint");

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "k") {
      event.preventDefault();
      searchInput.focus();
      searchInput.select();
      if (searchHint) searchHint.style.opacity = "0";
    }

    if (event.key === "Escape" && document.activeElement === searchInput) {
      closeSearch();
    }
  });
}
