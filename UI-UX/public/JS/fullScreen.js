export function enterFullscreen() {
    const fullscreenToggle = document.getElementById('fullscreen-toggle');
    const closeModal = document.querySelector('#close-modal');

    // Early return if fullscreen is not supported or element not found
    if (!fullscreenToggle ||
        !(document.fullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.msFullscreenEnabled)) {
        return;
    }

    // Handle touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
        if (closeModal) {
            closeModal.style.top = '200px';
        }
        return;
    }

    // Make button visible
    fullscreenToggle.style.display = 'flex';

    // Use standardized API with vendor prefixes as fallback
    const doc = document;
    const docEl = document.documentElement;

    // Create normalized fullscreen methods
    const requestFullscreen = docEl.requestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.webkitRequestFullscreen ||
        docEl.msRequestFullscreen;

    const exitFullscreen = doc.exitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.webkitExitFullscreen ||
        doc.msExitFullscreen;

    // Single event handler for toggle button
    fullscreenToggle.addEventListener('click', () => {
        const isFullscreen = doc.fullscreenElement ||
            doc.webkitFullscreenElement ||
            doc.mozFullScreenElement ||
            doc.msFullscreenElement;

        if (isFullscreen) {
            exitFullscreen.call(doc);
        } else {
            requestFullscreen.call(docEl);
        }
    });

    // Use function reference for consistent event handling
    function handleFullscreenChange() {
        const upIcon = fullscreenToggle.querySelector('.fa-up-right-and-down-left-from-center');
        const downIcon = fullscreenToggle.querySelector('.fa-down-left-and-up-right-to-center');

        const isFullscreen = doc.fullscreenElement ||
            doc.webkitFullscreenElement ||
            doc.mozFullScreenElement ||
            doc.msFullscreenElement;

        upIcon.style.display = isFullscreen ? 'none' : 'block';
        downIcon.style.display = isFullscreen ? 'block' : 'none';
    }

    // Add event listeners using a single function reference
    ['fullscreenchange', 'webkitfullscreenchange',
        'mozfullscreenchange', 'MSFullscreenChange'].forEach(event => {
            doc.addEventListener(event, handleFullscreenChange);
        });
}