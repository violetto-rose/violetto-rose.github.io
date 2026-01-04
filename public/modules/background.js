export function createBackgroundPattern() {
  // Create background layer
  const bgLayer = document.createElement('div');
  bgLayer.id = 'nuko-background';
  bgLayer.classList.add('nuko-background-layer');

  // Create pattern container
  const patternContainer = document.createElement('div');
  patternContainer.classList.add('nuko-pattern-container');

  // Configuration
  const rows = 8;
  const cols = 8;
  const rotations = [0, 45, 90, 135, 180, 225, 270, 315]; // 45-degree steps

  // Generate pattern
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const nuko = document.createElement('img');
      nuko.src = './public/assets/nuko-head.gif';
      nuko.alt = '';
      nuko.classList.add('nuko-pattern-item');

      // Rotate in 45-degree steps based on position
      const rotationIndex = (row + col) % rotations.length;
      const rotation = rotations[rotationIndex];
      nuko.style.transform = `rotate(${rotation}deg)`;

      patternContainer.appendChild(nuko);
    }
  }

  bgLayer.appendChild(patternContainer);
  document.body.appendChild(bgLayer);
}
