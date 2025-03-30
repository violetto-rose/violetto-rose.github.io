export function setupLoadingBar() {
    const loadingBar = document.getElementById('loading-bar');
    let progress = 0;

    // Start with initial progress
    updateProgress(30);

    // Simulate loading progress
    const interval = setInterval(() => {
        if (progress < 90) {
            updateProgress(progress + Math.random() * 30);
        }
    }, 500);

    // Complete the loading when the page is fully loaded
    window.addEventListener('load', () => {
        clearInterval(interval);
        updateProgress(100);
        setTimeout(() => {
            loadingBar.style.opacity = '0';
        }, 200);
    });

    function updateProgress(value) {
        progress = Math.min(value, 100);
        loadingBar.style.width = `${progress}%`;
    }
}