export function setupImageViewer() {
  // Create overlay elements
  const overlay = document.createElement("div");
  overlay.className = "image-overlay";
  overlay.style.display = "none";

  const enlargedImg = document.createElement("img");
  enlargedImg.className = "enlarged-image";
  enlargedImg.draggable = false;

  overlay.appendChild(enlargedImg);
  document.body.appendChild(overlay);

  // Zoom variables
  let scale = 1;
  let initialDistance = 0;
  let lastTouchTime = 0;
  let translateX = 0;
  let translateY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  // Reset zoom state
  function resetZoom() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateImageTransform();
  }

  // Update image transform
  function updateImageTransform() {
    enlargedImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  // Get distance between two touch points
  function getDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Get center point between two touches
  function getCenter(touches) {
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    };
  }

  // Constrain pan to keep image within bounds
  function constrainPan() {
    const rect = enlargedImg.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();
    
    const maxTranslateX = Math.max(0, (rect.width * scale - overlayRect.width) / 2);
    const maxTranslateY = Math.max(0, (rect.height * scale - overlayRect.height) / 2);
    
    translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, translateX));
    translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, translateY));
  }

  // Function to handle image click
  function handleImageClick(event) {
    const img = event.target;
    if (img.tagName === "IMG" && !img.closest(".image-overlay") && img.src && !img.src.toLowerCase().endsWith('.svg')) {
      enlargedImg.src = img.src;
      overlay.style.display = "flex";
      document.body.style.overflow = "hidden";
      resetZoom();
    }
  }

  // Function to handle overlay click (close)
  function handleOverlayClick(event) {
    if (event.target === overlay && !isDragging) {
      overlay.style.display = "none";
      document.body.style.overflow = "";
      resetZoom();
    }
  }

  // Touch event handlers
  function handleTouchStart(event) {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      startX = touch.clientX - translateX;
      startY = touch.clientY - translateY;
      isDragging = false;
      
      // Double tap detection
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastTouchTime;
      if (timeDiff < 300 && timeDiff > 0) {
        // Double tap - toggle zoom
        if (scale > 1) {
          scale = 1;
          translateX = 0;
          translateY = 0;
        } else {
          scale = 2;
          // Center zoom on tap point
          const rect = enlargedImg.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          translateX = (centerX - touch.clientX) * (scale - 1);
          translateY = (centerY - touch.clientY) * (scale - 1);
          constrainPan();
        }
        updateImageTransform();
      }
      lastTouchTime = currentTime;
    } else if (event.touches.length === 2) {
      initialDistance = getDistance(event.touches);
    }
  }

  function handleTouchMove(event) {
    event.preventDefault();
    
    if (event.touches.length === 1 && scale > 1) {
      // Single finger pan
      const touch = event.touches[0];
      translateX = touch.clientX - startX;
      translateY = touch.clientY - startY;
      constrainPan();
      updateImageTransform();
      isDragging = true;
    } else if (event.touches.length === 2) {
      // Two finger pinch zoom
      const currentDistance = getDistance(event.touches);
      const scaleChange = currentDistance / initialDistance;
      const newScale = Math.max(0.5, Math.min(5, scale * scaleChange));
      
      if (newScale !== scale) {
        const center = getCenter(event.touches);
        const rect = enlargedImg.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Adjust translation to zoom towards center of pinch
        const scaleDiff = newScale - scale;
        translateX -= (center.x - centerX) * scaleDiff / scale;
        translateY -= (center.y - centerY) * scaleDiff / scale;
        
        scale = newScale;
        constrainPan();
        updateImageTransform();
      }
      
      initialDistance = currentDistance;
    }
  }

  function handleTouchEnd(event) {
    if (event.touches.length === 0) {
      setTimeout(() => {
        isDragging = false;
      }, 100);
    }
  }

  // Mouse wheel zoom
  function handleWheel(event) {
    if (overlay.style.display === "flex") {
      event.preventDefault();
      
      const delta = event.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(0.5, Math.min(5, scale * delta));
      
      if (newScale !== scale) {
        const rect = enlargedImg.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Zoom towards mouse position
        const scaleDiff = newScale - scale;
        translateX -= (event.clientX - centerX) * scaleDiff / scale;
        translateY -= (event.clientY - centerY) * scaleDiff / scale;
        
        scale = newScale;
        constrainPan();
        updateImageTransform();
      }
    }
  }

  // Mouse drag for desktop
  let isMouseDragging = false;
  let mouseStartX = 0;
  let mouseStartY = 0;

  function handleMouseDown(event) {
    if (event.target === enlargedImg && scale > 1) {
      isMouseDragging = true;
      mouseStartX = event.clientX - translateX;
      mouseStartY = event.clientY - translateY;
      enlargedImg.style.cursor = 'grabbing';
    }
  }

  function handleMouseMove(event) {
    if (isMouseDragging && scale > 1) {
      translateX = event.clientX - mouseStartX;
      translateY = event.clientY - mouseStartY;
      constrainPan();
      updateImageTransform();
    }
  }

  function handleMouseUp() {
    isMouseDragging = false;
    enlargedImg.style.cursor = scale > 1 ? 'grab' : 'default';
  }

  // Double click zoom for desktop
  function handleDoubleClick(event) {
    if (event.target === enlargedImg) {
      if (scale > 1) {
        scale = 1;
        translateX = 0;
        translateY = 0;
      } else {
        scale = 2;
        const rect = enlargedImg.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        translateX = (centerX - event.clientX) * (scale - 1);
        translateY = (centerY - event.clientY) * (scale - 1);
        constrainPan();
      }
      updateImageTransform();
    }
  }

  // Event listeners
  document.addEventListener("click", handleImageClick);
  overlay.addEventListener("click", handleOverlayClick);

  // Touch events
  overlay.addEventListener("touchstart", handleTouchStart, { passive: false });
  overlay.addEventListener("touchmove", handleTouchMove, { passive: false });
  overlay.addEventListener("touchend", handleTouchEnd);

  // Mouse events
  overlay.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
  overlay.addEventListener("dblclick", handleDoubleClick);

  // Wheel zoom
  overlay.addEventListener("wheel", handleWheel, { passive: false });

  // Add escape key handler
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.style.display === "flex") {
      overlay.style.display = "none";
      document.body.style.overflow = "";
      resetZoom();
    }
  });

  // Update cursor based on zoom level
  function updateCursor() {
    enlargedImg.style.cursor = scale > 1 ? 'grab' : 'default';
  }

  // Update cursor when zoom changes
  const originalUpdateTransform = updateImageTransform;
  updateImageTransform = function() {
    originalUpdateTransform();
    updateCursor();
  };
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
