import { tutorials } from "./sidebar.js"
import { loadTutorial, updateActiveLink } from "./utils.js"

export function setupSearch() {
  const searchInput = document.getElementById("search-input")
  const searchResults = document.getElementById("search-results")

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase()
      const filteredTutorials = tutorials.filter((tutorial) => tutorial.name.toLowerCase().includes(searchTerm))

      searchResults.innerHTML = ""

      // Show/hide search results based on input
      if (searchTerm.length > 0 && filteredTutorials.length > 0) {
        searchResults.style.display = "block"
        filteredTutorials.forEach((tutorial) => {
          const div = document.createElement("div")
          div.innerHTML = `<i class="fas fa-search"></i> ${tutorial.name}`
          div.onclick = () => {
            loadTutorial(tutorial.file)
            updateActiveLink(document.querySelector(`#tutorial-list a[href="#${tutorial.file}"]`))
            searchInput.value = ""
            searchResults.style.display = "none" // Hide results after selection
          }
          searchResults.appendChild(div)
        })
      } else {
        searchResults.style.display = "none"
      }
    })
  }

  // Close search results when clicking outside
  document.addEventListener("click", (e) => {
    if (searchInput && searchResults && !searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.style.display = "none"
    }
  })

  // Close sidebar when search result is clicked (mobile only)
  if (searchResults) {
    searchResults.addEventListener("click", () => {
      const sidebar = document.getElementById("sidebar")
      if (window.innerWidth <= 768 && sidebar.classList.contains("open")) {
        toggleSidebar()
      }
    })
  }
}

