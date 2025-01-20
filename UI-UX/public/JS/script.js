document.addEventListener("DOMContentLoaded", () => {
  // Custom marked renderer to add target="_blank" to all links
  const renderer = new marked.Renderer();
  const originalLinkRenderer = renderer.link;
  renderer.link = function (href, title, text) {
    const link = originalLinkRenderer.call(this, href, title, text);
    return link.replace("<a", '<a target="_blank" rel="noopener noreferrer"');
  };

  // Configure marked to use the custom renderer
  marked.setOptions({
    renderer: renderer,
  });

  // Variables and Constants
  const tutorialList = document.getElementById("tutorial-list");
  const tutorialContent = document.getElementById("tutorial-content");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  // List of tutorial markdown files
  const tutorials = [
    { name: "Introduction to UI/UX", file: "intro.md" },
    { name: "About the course", file: "about-course.md" },
    { name: "Setting up Figma", file: "setting-up-figma.md" },
    { name: "Setting up Penpot", file: "setting-up-penpot.md" },
  ];

  // Populate the sidebar
  function populateSidebar() {
    tutorialList.innerHTML = "";
    tutorialList.classList.add("tutorial-list");
    tutorials.forEach((tutorial) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#${tutorial.file}`;
      a.innerHTML = `<i class="fas fa-book-open"></i> &nbsp ${tutorial.name}`;
      a.onclick = (e) => {
        e.preventDefault();
        loadTutorial(tutorial.file);
        updateActiveLink(a);
      };
      li.appendChild(a);
      tutorialList.appendChild(li);
      sidebarLinkListeners();
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

      const contentWrapper = document.createElement("div");
      contentWrapper.className = "tutorial-content-wrapper";

      const parsedContent = marked.parse(markdown);
      contentWrapper.innerHTML = wrapTables(parsedContent);

      tutorialContent.innerHTML = "";
      tutorialContent.appendChild(contentWrapper);

      const navigationContainer = document.createElement("div");
      navigationContainer.className = "navigation-buttons";
      tutorialContent.appendChild(navigationContainer);

      // Scroll the content container to the top
      const contentContainer = document.getElementById("content");
      contentContainer.scrollTop = 0;

      // Generate structure view after content is loaded
      generateStructureView(contentWrapper);

      // Update URL
      updateURL(filename);

      // Update the active link in the sidebar
      const sidebarLink = document.querySelector(
        `#tutorial-list a[href="#${filename}"]`
      );
      if (sidebarLink) {
        updateActiveLink(sidebarLink);
      }

      // Add navigation buttons
      addNavigationButtons(filename, navigationContainer);
    } catch (error) {
      console.error("Error:", error);
      tutorialContent.innerHTML =
        "<p>Error loading tutorial content. Please try again later.</p>";
    }
  }

  // Function to wrap table
  function wrapTables(content) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;

    const tables = tempDiv.querySelectorAll("table");
    tables.forEach((table) => {
      const wrapper = document.createElement("div");
      wrapper.className = "table-wrapper";
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    return tempDiv.innerHTML;
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
              document.querySelector(
                `#tutorial-list a[href="#${tutorial.file}"]`
              )
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

  // Dark mode toggle
  const darkModeToggle = document.getElementById("dark-mode-toggle");

  // Check for saved dark mode preference
  const savedDarkMode = localStorage.getItem("darkMode");
  if (savedDarkMode === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeToggle.classList.add("dark-mode");
  }

  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    darkModeToggle.classList.toggle("dark-mode");

    // Save preference
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
    } else {
      localStorage.removeItem("darkMode");
    }
  });

  // Sidebar Toggle
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebar-toggle");

  function toggleSidebar() {
    sidebar.classList.toggle("open");
    sidebarToggle.classList.toggle("open");

    const barsIcon = sidebarToggle.querySelector(".fa-bars");
    const barsStaggeredIcon = sidebarToggle.querySelector(".fa-bars-staggered");

    if (sidebar.classList.contains("open")) {
      barsIcon.style.display = "none";
      barsStaggeredIcon.style.display = "flex";
      barsStaggeredIcon.style.opacity = "1";
    } else {
      barsIcon.style.display = "flex";
      barsStaggeredIcon.style.display = "none";
    }
  }

  // Toggle sidebar when button is clicked
  sidebarToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleSidebar();
    if (structureView.classList == "open") {
      closeStructureView();
    }
  });

  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) {
      const isOutsideSidebar = !sidebar.contains(e.target);
      const isNotToggleButton = !sidebarToggle.contains(e.target);
      const isNotDarkModeToggle =
        !darkModeToggle.contains(e.target) &&
        !darkModeToggle.querySelector("*").contains(e.target);

      if (isOutsideSidebar && isNotToggleButton && isNotDarkModeToggle) {
        if (sidebar.classList.contains("open")) {
          toggleSidebar();
        }
      }
    }
  });

  // Close sidebar when window is resized above tablet breakpoint
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      sidebar.classList.remove("open");
      sidebarToggle.classList.remove("open");
      document.body.style.overflow = "";

      const barsIcon = sidebarToggle.querySelector(".fa-bars");
      const barsStaggeredIcon =
        sidebarToggle.querySelector(".fa-bars-staggered");
      barsIcon.style.display = "flex";
      barsStaggeredIcon.style.display = "none";
    }
  });

  function sidebarLinkListeners() {
    // Close sidebar when clicking on a tutorial link (mobile only)
    const tutorialLinks = document.querySelectorAll("#tutorial-list a");

    if (tutorialLinks) {
      tutorialLinks.forEach((link) => {
        link.addEventListener("click", () => {
          if (window.innerWidth <= 768 && sidebar.classList.contains("open")) {
            toggleSidebar();
          }
        });
      });
    }
  }

  // Close sidebar when search result is clicked (mobile only)
  if (searchResults) {
    searchResults.addEventListener("click", () => {
      if (window.innerWidth <= 768 && sidebar.classList.contains("open")) {
        toggleSidebar();
      }
    });
  }

  // Structure View Toggle
  const structureToggle = document.getElementById("structure-toggle");
  const structureView = document.getElementById("structure-view");
  const structureContent = document.getElementById("structure-content");

  structureToggle.addEventListener("click", () => {
    toggleStructureView();
  });

  function toggleStructureView() {
    structureToggle.classList.toggle("open");
    structureView.classList.toggle("open");

    // Move the content area only for screens wider than 768px
    const content = document.getElementById("content");
    if (window.innerWidth > 768) {
      content.classList.toggle("shifted");
    }
  }

  function closeStructureView() {
    structureToggle.classList.remove("open");
    structureView.classList.remove("open");
    const content = document.getElementById("content");
    content.classList.remove("shifted");
  }

  // Function to generate structure view
  function generateStructureView(content) {
    // Clear previous structure
    structureContent.innerHTML = "";

    // Create headings structure
    const headings = content.querySelectorAll("h2, h3");

    if (headings.length === 0) {
      structureContent.innerHTML = "<p>No structure found</p>";
      return;
    }

    const structureSections = {};

    headings.forEach((heading) => {
      const level = heading.tagName.toLowerCase();
      const text = heading.textContent;

      if (!structureSections[level]) {
        const section = document.createElement("div");
        section.classList.add("structure-section");
        const sectionTitle = document.createElement("h3");
        sectionTitle.textContent = level === "h2" ? "Sections" : "Subsections";
        section.appendChild(sectionTitle);
        structureSections[level] = section;
        structureContent.appendChild(section);
      }

      const item = document.createElement("div");
      item.classList.add("structure-item");
      item.textContent = text.replace(/:/g, "");
      item.onclick = () => {
        heading.scrollIntoView({ behavior: "smooth", block: "start" });
        if (window.innerWidth <= 768) {
          closeStructureView();
        }
      };

      structureSections[level].appendChild(item);
    });
  }

  // Function to add navigation buttons
  function addNavigationButtons(currentFile, navigationContainer) {
    const currentIndex = tutorials.findIndex(
      (tutorial) => tutorial.file === currentFile
    );

    const prevButton =
      currentIndex > 0
        ? `<button id="prev-button">Previous: ${
            tutorials[currentIndex - 1].name
          }</button>`
        : `<button id="prev-button" disabled class="invisible">Previous</button>`;

    const nextButton =
      currentIndex < tutorials.length - 1
        ? `<button id="next-button">Next: ${
            tutorials[currentIndex + 1].name
          }</button>`
        : `<button id="next-button" disabled class="invisible">Next</button>`;

    navigationContainer.innerHTML = `${prevButton}${nextButton}`;

    // Add event listeners for buttons with sidebar link updates
    const prevButtonElement = document.getElementById("prev-button");
    const nextButtonElement = document.getElementById("next-button");

    if (currentIndex > 0 && prevButtonElement) {
      prevButtonElement.addEventListener("click", () => {
        const prevFile = tutorials[currentIndex - 1].file;
        loadTutorial(prevFile);
        const prevLink = document.querySelector(
          `#tutorial-list a[href="#${prevFile}"]`
        );
        if (prevLink) {
          updateActiveLink(prevLink);
        }
      });
    }

    if (currentIndex < tutorials.length - 1 && nextButtonElement) {
      nextButtonElement.addEventListener("click", () => {
        const nextFile = tutorials[currentIndex + 1].file;
        loadTutorial(nextFile);
        const nextLink = document.querySelector(
          `#tutorial-list a[href="#${nextFile}"]`
        );
        if (nextLink) {
          updateActiveLink(nextLink);
        }
      });
    }
  }

  // Initial setup
  populateSidebar();
  loadTutorialFromHash();

  // Listen for hash changes
  window.addEventListener("hashchange", loadTutorialFromHash);
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 768) {
      const content = document.getElementById("content");
      content.classList.remove("shifted");
    }
  });
});
