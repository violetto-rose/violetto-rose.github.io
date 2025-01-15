document.addEventListener("DOMContentLoaded", () => {
  const tutorialList = document.getElementById("tutorial-list");
  const tutorialContent = document.getElementById("tutorial-content");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  // List of tutorial markdown files
  const tutorials = [
    { name: "Introduction to UI/UX", file: "intro.md" },
    { name: "About the course", file: "about-course.md" },
    { name: "Setting up Figma", file: "setting-up-figma.md" },
  ];

  // Populate the sidebar
  function populateSidebar() {
    tutorialList.innerHTML = "";
    tutorials.forEach((tutorial) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#${tutorial.file}`;
      a.innerHTML = `<i class="fas fa-book-open"></i> ${tutorial.name}`;
      a.onclick = (e) => {
        e.preventDefault();
        loadTutorial(tutorial.file);
        updateActiveLink(a);
      };
      li.appendChild(a);
      tutorialList.appendChild(li);
    });
  }

  // Function to load tutorial content
  async function loadTutorial(filename) {
    try {
      const response = await fetch(`tutorials/${filename}`);
      if (!response.ok) {
        throw new Error("Failed to load tutorial");
      }
      const markdown = await response.text();
      tutorialContent.innerHTML = marked.parse(markdown);
      updateURL(filename);
    } catch (error) {
      console.error("Error:", error);
      tutorialContent.innerHTML =
        "<p>Error loading tutorial content. Please try again later.</p>";
    }
  }

  // Function to update URL
  function updateURL(filename) {
    history.pushState(null, "", `#${filename}`);
  }

  // Function to update active link in sidebar
  function updateActiveLink(clickedLink) {
    document.querySelectorAll("#tutorial-list a").forEach((link) => {
      link.classList.remove("active");
    });
    clickedLink.classList.add("active");
  }

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filteredTutorials = tutorials.filter((tutorial) =>
        tutorial.name.toLowerCase().includes(searchTerm)
      );

      searchResults.innerHTML = "";
      
      // Show/hide search results based on input
      if (searchTerm.length > 0 && filteredTutorials.length > 0) {
        searchResults.style.display = "block";
        filteredTutorials.forEach((tutorial) => {
          const div = document.createElement("div");
          div.innerHTML = `<i class="fas fa-search"></i> ${tutorial.name}`;
          div.onclick = () => {
            loadTutorial(tutorial.file);
            updateActiveLink(
              document.querySelector(`#tutorial-list a[href="#${tutorial.file}"]`)
            );
            searchInput.value = "";
            searchResults.style.display = "none"; // Hide results after selection
          };
          searchResults.appendChild(div);
        });
      } else {
        searchResults.style.display = "none";
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
      searchResults.style.display = "none";
    }
  });

  // Load tutorial based on URL hash
  function loadTutorialFromHash() {
    const hash = window.location.hash.slice(1);
    const tutorial = tutorials.find((t) => t.file === hash);
    if (tutorial) {
      loadTutorial(tutorial.file);
      updateActiveLink(
        document.querySelector(`#tutorial-list a[href="#${tutorial.file}"]`)
      );
    } else {
      loadTutorial(tutorials[0].file);
      updateActiveLink(document.querySelector("#tutorial-list a"));
    }
  }

  // Initial setup
  populateSidebar();
  loadTutorialFromHash();

  // Listen for hash changes
  window.addEventListener("hashchange", loadTutorialFromHash);

  // Dark mode toggle
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  
  // Check for saved dark mode preference
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeToggle.classList.add('dark-mode');
  }

  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkModeToggle.classList.toggle('dark-mode');

    // Save preference
    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('darkMode', 'enabled');
    } else {
      localStorage.removeItem('darkMode');
    }
  });
});
