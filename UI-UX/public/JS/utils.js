import { generateStructureView } from "./structureView.js";
import { tutorials } from "./sidebar.js";

// Function to load tutorial content with lazy loading
export async function loadTutorial(filename) {
  const tutorialContent = document.getElementById("tutorial-content");
  try {
    // Show loading indicator
    tutorialContent.innerHTML = '<div class="loading">Loading...</div>';

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

    // Lazy load images
    lazyLoadImages(contentWrapper);
  } catch (error) {
    console.error("Error:", error);
    tutorialContent.innerHTML =
      "<p>Error loading tutorial content. Please try again later.</p>";
  }
}

// Function to lazy load images
function lazyLoadImages(container) {
  const images = container.querySelectorAll("img");
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const image = entry.target;
        image.src = image.dataset.src;
        observer.unobserve(image);
      }
    });
  });

  images.forEach((img) => {
    img.dataset.src = img.src;
    img.src = "";
    imageObserver.observe(img);
  });
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
export async function updateActiveLink(clickedLink) {
  document.querySelectorAll("#tutorial-list a").forEach((link) => {
    link.classList.remove("active");
  });
  clickedLink.classList.add("active");
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
