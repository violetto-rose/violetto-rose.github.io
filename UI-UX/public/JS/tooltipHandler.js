export function setupTooltips() {
  // Check if device has both hover and pointer capabilities
  const hasHover = window.matchMedia("(hover: hover)").matches;
  const hasPointer = window.matchMedia("(pointer: fine)").matches;

  // Only proceed if device supports both hover and pointer
  if (!hasHover || !hasPointer) return;

  const toggleButtons = document.querySelectorAll("button[aria-label]");
  const tooltipMap = new Map(); // Store tooltip references for each button

  // Helper function to calculate and update tooltip position
  function updateTooltipPosition(button, tooltip) {
    const buttonRect = button.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    // Calculate vertical position (centered)
    const top = buttonRect.top + (buttonRect.height - tooltipRect.height) / 2;

    // Calculate horizontal position
    let left;
    const spaceOnRight =
      window.innerWidth - (buttonRect.right + 10 + tooltipRect.width);

    if (spaceOnRight >= 0) {
      // Place on right
      left = buttonRect.right + 10;
      tooltip.classList.remove("tooltip-left");
      tooltip.classList.add("tooltip-right");
    } else {
      // Place on left
      left = buttonRect.left - tooltipRect.width - 10;
      tooltip.classList.remove("tooltip-right");
      tooltip.classList.add("tooltip-left");
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  toggleButtons.forEach((button) => {
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.textContent = button.getAttribute("aria-label");
    tooltipMap.set(button, tooltip);

    // Prevent touch events from triggering the tooltip
    button.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        return;
      },
      { passive: false }
    );

    button.addEventListener("mouseenter", () => {
      // Don't show tooltip if button is active
      if (button.classList.contains("active")) return;

      // Update tooltip text in case aria-label changed
      tooltip.textContent = button.getAttribute("aria-label");

      document.body.appendChild(tooltip);
      updateTooltipPosition(button, tooltip);
    });

    button.addEventListener("mouseleave", () => {
      if (tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
      }
    });

    // Add click event listener to refresh tooltip position
    button.addEventListener("click", () => {
      // If tooltip is currently visible, update its position
      if (tooltip.parentNode) {
        // Small delay to allow for any layout changes after click
        setTimeout(() => {
          // Update tooltip text in case aria-label changed
          tooltip.textContent = button.getAttribute("aria-label");
          updateTooltipPosition(button, tooltip);
        }, 10);
      }
    });
  });

  // Store tooltip map globally for updates
  window.tooltipMap = tooltipMap;
}

// Function to update tooltip for a specific button
export function updateButtonTooltip(buttonId) {
  if (!window.tooltipMap) return;

  const button = document.getElementById(buttonId);
  if (!button) return;

  const tooltip = window.tooltipMap.get(button);
  if (tooltip) {
    tooltip.textContent = button.getAttribute("aria-label");

    // If tooltip is currently visible, update its position too
    if (tooltip.parentNode) {
      updateTooltipPosition(button, tooltip);
    }
  }
}

// Helper function to update tooltip position (available globally)
function updateTooltipPosition(button, tooltip) {
  const buttonRect = button.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();

  // Calculate vertical position (centered)
  const top = buttonRect.top + (buttonRect.height - tooltipRect.height) / 2;

  // Calculate horizontal position
  let left;
  const spaceOnRight =
    window.innerWidth - (buttonRect.right + 10 + tooltipRect.width);

  if (spaceOnRight >= 0) {
    // Place on right
    left = buttonRect.right + 10;
    tooltip.classList.remove("tooltip-left");
    tooltip.classList.add("tooltip-right");
  } else {
    // Place on left
    left = buttonRect.left - tooltipRect.width - 10;
    tooltip.classList.remove("tooltip-right");
    tooltip.classList.add("tooltip-left");
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

// Function to setup mutation observer for aria-label changes
export function setupTooltipObserver() {
  // Check if device has both hover and pointer capabilities
  const hasHover = window.matchMedia("(hover: hover)").matches;
  const hasPointer = window.matchMedia("(pointer: fine)").matches;

  // Only proceed if device supports both hover and pointer
  if (!hasHover || !hasPointer) return;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "aria-label"
      ) {
        const button = mutation.target;
        if (button.tagName === "BUTTON" && window.tooltipMap) {
          const tooltip = window.tooltipMap.get(button);
          if (tooltip) {
            tooltip.textContent = button.getAttribute("aria-label");

            // If tooltip is currently visible, update its position too
            if (tooltip.parentNode) {
              updateTooltipPosition(button, tooltip);
            }
          }
        }
      }
    });
  });

  // Observe all buttons with aria-label for attribute changes
  const buttonsWithAriaLabel = document.querySelectorAll("button[aria-label]");
  buttonsWithAriaLabel.forEach((button) => {
    observer.observe(button, {
      attributes: true,
      attributeFilter: ["aria-label"],
    });
  });
}
