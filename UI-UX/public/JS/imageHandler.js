export function setupImageViewer() {
  // Create overlay elements
  const overlay = document.createElement("div");
  overlay.className = "image-overlay";
  overlay.style.display = "none";

  const enlargedImg = document.createElement("img");
  enlargedImg.className = "enlarged-image";

  overlay.appendChild(enlargedImg);
  document.body.appendChild(overlay);

  // Function to handle image click
  function handleImageClick(event) {
    const img = event.target;
    if (img.tagName === "IMG" && !img.closest(".image-overlay") && img.src && !img.src.toLowerCase().endsWith('.svg')) {
      enlargedImg.src = img.src;
      overlay.style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  }

  // Function to handle overlay click (close)
  function handleOverlayClick(event) {
    if (event.target === overlay) {
      overlay.style.display = "none";
      document.body.style.overflow = "";
    }
  }

  // Event listeners for image clicks
  document.addEventListener("click", handleImageClick);
  overlay.addEventListener("click", handleOverlayClick);

  // Add escape key handler
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.style.display === "flex") {
      overlay.style.display = "none";
      document.body.style.overflow = "";
    }
  });
}

// Function to lazy load images
export function lazyLoadImages(container) {
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

              // Remove the placeholder loader element
              const loader = placeholderWrapper.querySelector('.image-placeholder-loader');
              if (loader) {
                loader.remove();
              }

              // Set background to transparent after image loads
              placeholderWrapper.style.backgroundColor = "transparent";
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
    // Skip SVGs - load them immediately
    if (img.src.toLowerCase().endsWith(".svg")) {
      return;
    }

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
    wrapper.style.backgroundColor = "var(--block-quote)";
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
