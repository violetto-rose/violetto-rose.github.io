export function setupTooltips() {
    // Check if device has both hover and pointer capabilities
    const hasHover = window.matchMedia('(hover: hover)').matches;
    const hasPointer = window.matchMedia('(pointer: fine)').matches;
    
    // Only proceed if device supports both hover and pointer
    if (!hasHover || !hasPointer) return;

    const toggleButtons = document.querySelectorAll('button[aria-label]');

    toggleButtons.forEach(button => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = button.getAttribute('aria-label');

        button.addEventListener('mouseenter', () => {
            // Don't show tooltip if button is active
            if (button.classList.contains('active')) return;
            
            document.body.appendChild(tooltip);
            const buttonRect = button.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();

            // Calculate vertical position (centered)
            const top = buttonRect.top + (buttonRect.height - tooltipRect.height) / 2;

            // Calculate horizontal position
            let left;
            const spaceOnRight = window.innerWidth - (buttonRect.right + 10 + tooltipRect.width);

            if (spaceOnRight >= 0) {
                // Place on right
                left = buttonRect.right + 10;
                tooltip.classList.remove('tooltip-left');
                tooltip.classList.add('tooltip-right');
            } else {
                // Place on left
                left = buttonRect.left - tooltipRect.width - 10;
                tooltip.classList.remove('tooltip-right');
                tooltip.classList.add('tooltip-left');
            }

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
        });

        button.addEventListener('mouseleave', () => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        });
    });
}