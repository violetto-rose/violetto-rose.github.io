import { generateStructureView } from "./structureView.js";
import { tutorials } from "./sidebar.js";

// Function to load tutorial content with lazy loading
export async function loadTutorial(filename) {
  const tutorialContent = document.getElementById("tutorial-content");
  try {
    const response = await fetch(`tutorials/${filename}`);
    if (!response.ok) {
      throw new Error("Failed to load tutorial");
    }
    let markdown = await response.text();

    // Preprocess markdown to handle aspect ratio attribute
    markdown = markdown.replace(
      /!\[([^\]]*)\]\(([^)]+)\){data-aspect-ratio="([^"]+)"}/g,
      '![$1]($2 "{data-aspect-ratio=$3}")'
    );

    markdown = markdown.replace(
      /!\[([^\]]*)\]\(images\//g,
      "![$1](/UI-UX/tutorials/images/"
    );

    const contentWrapper = document.createElement("div");
    contentWrapper.className = "tutorial-content-wrapper";

    const parsedContent = marked.parse(markdown);
    contentWrapper.innerHTML = wrapTables(parsedContent);

    // After parsing, process images to add aspect ratio
    const images = contentWrapper.querySelectorAll("img");
    images.forEach((img) => {
      const aspectRatioMatch = img.title.match(/\{data-aspect-ratio=([^}]+)\}/);
      if (aspectRatioMatch) {
        img.setAttribute("data-aspect-ratio", aspectRatioMatch[1]);
        img.removeAttribute("title");
      }
    });

    tutorialContent.innerHTML = "";
    tutorialContent.appendChild(contentWrapper);

    if (filename === "about-course.md") {
      adjustTableHeader(filename);
    }

    const navigationContainer = document.createElement("div");
    navigationContainer.className = "navigation-buttons";
    tutorialContent.appendChild(navigationContainer);

    // Scroll the content container to the top
    const contentContainer = document.getElementById("content");
    scrollToTop(contentContainer);

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

    window.addEventListener("resize", () => adjustTableHeader(filename));
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

// Function to adjust table for mobile devices
export function adjustTableHeader(filename) {
  const isMobile = window.innerWidth <= 640;
  const applicableFiles = ["intro.md", "about-course.md"];

  if (isMobile && applicableFiles.includes(filename)) {
    const firstTh = document.querySelector("#tutorial-content th:first-child");
    if (firstTh) {
      firstTh.style.display = "none";
    }

    const secondTh = document.querySelector("#tutorial-content th:last-child");
    if (secondTh) {
      secondTh.setAttribute("colspan", "2");
    }
  } else {
    const firstTh = document.querySelector("#tutorial-content th:first-child");
    if (firstTh) {
      firstTh.style.display = "";
    }

    const secondTh = document.querySelector("#tutorial-content th:last-child");
    if (secondTh) {
      secondTh.removeAttribute("colspan");
    }
  }
}

// Function to scroll to top
function scrollToTop(container) {
  if (container) {
    const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

    if (isFirefox) {
      const startTime = performance.now();
      const duration = 300;
      const startPosition = container.scrollTop;

      function smoothScroll(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease out quad)
        const easedProgress = progress * (2 - progress);

        container.scrollTop = startPosition * (1 - easedProgress);

        if (elapsed < duration) {
          requestAnimationFrame(smoothScroll);
        }
      }

      requestAnimationFrame(smoothScroll);
    } else {
      // For other browsers, use native smooth scroll
      container.scroll({
        top: 0,
        behavior: "smooth",
      });
    }
  }
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

// Function to lazy load images
function lazyLoadImages(container) {
  const images = container.querySelectorAll("img");
  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target;
          const placeholderWrapper = image.closest(
            ".image-placeholder-wrapper"
          );

          image.src = image.dataset.src;

          image.onload = function () {
            // Remove placeholder class once image is loaded
            if (placeholderWrapper) {
              placeholderWrapper.classList.remove("loading");
            }

            // Dynamically calculate aspect ratio based on actual image dimensions
            const naturalAspectRatio = image.naturalHeight / image.naturalWidth;
            
            // Adjust padding percentage based on aspect ratio and image size
            let paddingPercentage;
            const isSmallImage = image.naturalWidth < 1000;

            if (naturalAspectRatio === 1) {
              // Square images
              paddingPercentage = isSmallImage ? 60 : 100;
            } else if (naturalAspectRatio > 1) {
              // Portrait images (height > width)
              paddingPercentage = isSmallImage 
                ? Math.min(90, naturalAspectRatio * 100 * 0.6)
                : Math.min(100, naturalAspectRatio * 100);
            } else {
              // Landscape images (width > height)
              paddingPercentage = isSmallImage 
                ? Math.min(90, naturalAspectRatio * 100 * 0.6)
                : Math.min(100, naturalAspectRatio * 100);
            }

            placeholderWrapper.style.paddingTop = `${paddingPercentage}%`;

            // Adjust image and wrapper sizing logic
            if (isSmallImage) {
              // For smaller images, center and reduce wrapper width
              placeholderWrapper.style.width = "60%";
              placeholderWrapper.style.margin = "0 auto";
            } else {
              // For larger images, full width
              placeholderWrapper.style.width = "100%";
              placeholderWrapper.style.margin = "";
            }

            // Reset image styles to ensure it fills the wrapper
            image.style.width = "100%";
            image.style.height = "100%";
            image.style.objectFit = "contain";
          };

          observer.unobserve(image);
        }
      });
    },
    {
      rootMargin: "50px", // Start loading images slightly before they enter viewport
    }
  );

  images.forEach((img) => {
    // Create a wrapper with aspect ratio placeholder
    const wrapper = document.createElement("div");
    wrapper.className = "image-placeholder-wrapper loading";

    // Determine initial aspect ratio 
    const dataAspectRatio = img.getAttribute("data-aspect-ratio");
    const defaultAspectRatio = "16:9";
    const aspectRatio = dataAspectRatio || defaultAspectRatio;
    const [width, height] = aspectRatio.split(":").map(Number);

    // Initial padding based on provided aspect ratio
    let initialPaddingPercentage;
    if (width === height) {
      // Square images
      initialPaddingPercentage = 60; // Default for small images
    } else {
      initialPaddingPercentage = (height / width) * 100;
    }

    wrapper.style.position = "relative";
    wrapper.style.width = "100%";
    wrapper.style.paddingTop = `${initialPaddingPercentage}%`;
    wrapper.style.backgroundColor = "transparent";
    wrapper.style.overflow = "hidden";

    // Style for loading state
    wrapper.innerHTML = `
      <div class="image-placeholder-loader" style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        opacity: 0.5;
      ">
        Loading...
      </div>
    `;

    // Replace image with wrapped version
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);

    // Prepare for lazy loading
    img.dataset.src = img.src;
    img.src = ""; // Clear src to prevent immediate loading

    // Style the image to fill the wrapper
    img.style.position = "absolute";
    img.style.top = "0";
    img.style.left = "0";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";

    imageObserver.observe(img);
  });
}
