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
    if (img.tagName === "IMG" && !img.closest(".image-overlay")) {
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
