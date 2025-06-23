async function fetchCards() {
  try {
    const response = await fetch('public/files.json');
    const data = await response.json();

    const publicCards = data.filter((item) => !item.password_required);
    renderCards(publicCards);

    showHeader('APPS');
  } catch (error) {
    console.error('Error loading JSON:', error);
  }
}

/**
 * Dynamic spanning system for optimal card layout
 *
 * Expected distributions:
 *
 * DESKTOP (3-column grid):
 * 1 card:  [------] (span-3)
 * 2 cards: [----][--] (span-2, span-1)
 * 3 cards: [--][--][--] (normal)
 * 4 cards: [----][--] / [--][----] (alternating span-2 pattern)
 * 5 cards: [----][--] / [--][--] / [--] (alternating start)
 * 6 cards: [--][--][--] / [--][--][--] (perfect 2×3)
 * 7 cards: [------] / [--][--][--] / [--][--][--] (featured + 2×3)
 * 8 cards: [----][--] / [--][----] / [----][--] (alternating span-2 pattern)
 *
 * TABLET (2-column grid):
 * 1 card:  [------] (span-2)
 * 2 cards: [---][---] (normal)
 * 3 cards: [------][---][---] (span-2, then normal)
 * 4 cards: [---][---][---][---] (perfect 2×2)
 * 5 cards: [------][---][---][---][---] (span-2, then normal)
 * 6 cards: [---][---][---][---][---][---] (perfect 3×2)
 * 7 cards: [----] / [--][--] / [----] / [--][--] / [----] (alternating)
 *
 * MOBILE: Always single column
 */
function calculateSpanClasses(items) {
  const totalCards = items.length;

  // Initialize array with empty strings
  const spanClasses = new Array(totalCards).fill('');

  // Get current viewport width to determine which layout to use
  const viewportWidth = window.innerWidth;

  // Mobile: Always single column (handled by CSS)
  if (viewportWidth <= 768) {
    return spanClasses;
  }

  // Tablet (768px - 1024px): 2-column optimized layout
  if (viewportWidth <= 1024) {
    return calculateTabletLayout(totalCards, spanClasses);
  }

  // Desktop (1024px+): 3-column optimized layout
  return calculateDesktopLayout(totalCards, spanClasses);
}

function calculateDesktopLayout(totalCards, spanClasses) {
  // Desktop: 3-column grid optimization

  // Special handling for cases that benefit from alternating patterns
  if (totalCards >= 4) {
    return calculateAlternatingLayout(totalCards, spanClasses);
  }

  const remainder = totalCards % 3;

  if (remainder === 0) {
    // Perfect 3-column distribution: no spanning needed
    return spanClasses;
  }

  if (remainder === 1) {
    if (totalCards === 1) {
      // Single card: span full width
      spanClasses[0] = 'span-3';
    } else if (totalCards === 7) {
      // 7 cards: 3+3+1 layout with first card spanning full width
      spanClasses[0] = 'span-3'; // Row 1: [------] (full width)
      // Remaining 6 cards: [1][1][1] / [1][1][1] (perfect 2×3)
      return spanClasses;
    } else if (totalCards >= 10) {
      // 10+ cards: first card normal, creates good flow
      return spanClasses; // All normal spans work well for large sets
    } else {
      // Other cases with remainder 1: make first card span 3
      spanClasses[0] = 'span-3';
    }
  } else if (remainder === 2) {
    if (totalCards === 2) {
      // 2 cards: distribute as 2+1 (one spans half, other spans remaining)
      spanClasses[0] = 'span-2';
    } else if (totalCards === 5) {
      // 5 cards: alternating 2+1 / 1+1 / 1 pattern
      spanClasses[0] = 'span-2'; // First row: [--][1]
      // Remaining cards flow naturally: [1][1] / [1]
    } else {
      // Other cases with remainder 2: make first card span 2
      spanClasses[0] = 'span-2';
    }
  }

  return spanClasses;
}

function calculateAlternatingLayout(totalCards, spanClasses) {
  // For multiples of 4: clean alternating 2+1 / 1+2 pattern

  const remainder = totalCards % 4;

  if (remainder === 1) {
    // Like 5, 9, 13: first card span-3, then alternating for rest
    spanClasses[0] = 'span-3';
    // Apply alternating pattern to remaining cards starting from index 1
    applyAlternatingPattern(spanClasses, 1, totalCards - 1);
  } else if (remainder === 2) {
    // Like 6, 10, 14: apply alternating pattern to all cards
    applyAlternatingPattern(spanClasses, 0, totalCards);
  } else if (remainder === 3) {
    // Like 7, 11, 15: first card span-3, then alternating for rest
    spanClasses[0] = 'span-3';
    applyAlternatingPattern(spanClasses, 1, totalCards - 1);
  } else {
    // Perfect multiples of 4 (4, 8, 12, 16...): pure alternating pattern
    if (totalCards === 4) {
      // Special case: 4 cards get prominence treatment
      spanClasses[0] = 'span-3';
    } else {
      // 8, 12, 16...: clean alternating pattern
      applyAlternatingPattern(spanClasses, 0, totalCards);
    }
  }

  return spanClasses;
}

function applyAlternatingPattern(spanClasses, startIndex, count) {
  // Apply alternating 2+1 / 1+2 pattern starting from startIndex
  // For 8 cards: want positions 0,4 to span-2 (even pairs), positions 1,5 to span-2 (odd pairs)

  for (let i = 0; i < count; i++) {
    const cardIndex = startIndex + i;
    const pairIndex = Math.floor(i / 2); // Which pair this card belongs to (0,1,2,3...)
    const positionInPair = i % 2; // 0 = first in pair, 1 = second in pair

    if (pairIndex % 2 === 0) {
      // Even pairs (0, 2, 4...): 2+1 pattern
      if (positionInPair === 0) {
        spanClasses[cardIndex] = 'span-2'; // First card in even pairs spans 2
      }
    } else {
      // Odd pairs (1, 3, 5...): 1+2 pattern
      if (positionInPair === 1) {
        spanClasses[cardIndex] = 'span-2'; // Second card in odd pairs spans 2
      }
    }
  }
}

function calculateTabletLayout(totalCards, spanClasses) {
  // Tablet: 2-column grid optimization
  const remainder = totalCards % 2;

  if (remainder === 0) {
    // Even number: perfect 2-column distribution
    return spanClasses;
  }

  // Odd number: various strategies based on count
  if (totalCards === 1) {
    spanClasses[0] = 'span-2'; // Single card spans full width
  } else if (totalCards === 3) {
    spanClasses[0] = 'span-2'; // 2+1+1 distribution: [--] [1] [1]
  } else if (totalCards === 5) {
    spanClasses[0] = 'span-2'; // 2+1+1+1+1 distribution: [--] [1] [1] [1] [1]
  } else if (totalCards === 7) {
    // 7 cards: alternating 2 / 1+1 / 2 / 1+1 / 2 pattern
    spanClasses[0] = 'span-2'; // Row 1: [----]
    spanClasses[3] = 'span-2'; // Row 3: [----] (after 1+1 in row 2)
    spanClasses[6] = 'span-2'; // Row 5: [----] (last card spans full width)
    // Creates: [----] / [1][1] / [----] / [1][1] / [----]
  } else if (totalCards === 9) {
    // 9 cards: 2+2+2+2+1 distribution for good balance
    spanClasses[0] = 'span-2';
  } else if (totalCards >= 11) {
    // For larger odd numbers, span first card to create even remainder
    spanClasses[0] = 'span-2';
  }

  return spanClasses;
}

function renderCards(items) {
  const container = document.getElementById('card-container');
  container.innerHTML = '';
  container.className = 'container'; // Use existing container class

  if (Array.isArray(items)) {
    // Store current data for resize handling
    currentCardsData = items;

    const spanClasses = calculateSpanClasses(items);

    items.forEach((item, index) => {
      const card = createCard(item, spanClasses[index]);
      container.appendChild(card);
    });
  }
}

function createCard(item, spanClass) {
  const card = document.createElement('a');
  card.href = item.link;
  card.className = `card glass ${spanClass}`.trim();
  card.innerHTML = `
    <i class="${item.icon}"></i>
    <h2>${item.name}</h2>
    <p>${item.description}</p>
  `;
  return card;
}

let clickCount = 0;
let lastClickTime = 0;
let protectedCardsLoaded = false;
let protectedCardsData = null;
let publicCardsData = null;

async function handleTouchStart() {
  const currentTime = new Date().getTime();
  const timeDiff = currentTime - lastClickTime;

  if (timeDiff < 500) {
    clickCount++;
  } else {
    clickCount = 1;
  }

  lastClickTime = currentTime;

  if (clickCount === 5) {
    await toggleProtectedCards();
    clickCount = 0;
    lastClickTime = 0;
  }
}

async function toggleProtectedCards() {
  if (!protectedCardsLoaded) {
    await loadProtectedCards();
  } else {
    unloadProtectedCards();
  }
}

async function loadProtectedCards() {
  try {
    if (!protectedCardsData) {
      const response = await fetch('public/files.json');
      const data = await response.json();
      protectedCardsData = data.filter((item) => item.password_required);
      publicCardsData = data.filter((item) => !item.password_required);
    }

    const allCards = [...publicCardsData, ...protectedCardsData];

    renderCards(allCards);
    protectedCardsLoaded = true;
  } catch (error) {
    console.error('Error loading protected cards:', error);
  }
}

function unloadProtectedCards() {
  renderCards(publicCardsData);
  protectedCardsLoaded = false;
}

function handleKeyDown(event) {
  if (event.ctrlKey && event.shiftKey && event.altKey && event.key === 'P') {
    toggleProtectedCards();
  }
}

function showHeader(text) {
  const headers = document.querySelectorAll('h1.headers');
  headers.forEach((h1) => {
    if (h1.textContent === text) {
      h1.classList.add('visible');
    }
  });
}

async function processReadme() {
  try {
    if (typeof marked !== 'object' || typeof marked.parse !== 'function') {
      throw new Error('Marked library not properly loaded');
    }

    const response = await fetch(
      'https://raw.githubusercontent.com/violetto-rose/violetto-rose/main/README.md'
    );
    const markdown = await response.text();

    const readmeContent = document.getElementById('readme-content');
    readmeContent.style.display = 'block';
    showHeader('README');

    const baseUrl =
      'https://raw.githubusercontent.com/violetto-rose/violetto-rose/refs/heads/main/';
    const modifiedMarkdown = markdown.replace(
      /<img src="(?!http|https)(.*?)"/g,
      (_, p1) => `<img src="${baseUrl}${p1}"`
    );

    const htmlContent = marked.parse(modifiedMarkdown);
    readmeContent.innerHTML = htmlContent;

    // Check if the primary input method is touch-based
    const isTouchPrimary = window.matchMedia('(pointer: coarse)').matches;
    const hintText = isTouchPrimary
      ? '5 taps to unlock'
      : 'Ctrl ~ Shift ~ Alt ~ P';
    readmeContent.innerHTML += `<p style="font-size: 0.5rem; text-align: center; margin-bottom: 0">${hintText}</p>`;
  } catch (error) {
    console.error('Error processing README:', error);
  }
}

function getRandomTransformValues() {
  const translateX = Math.floor(Math.random() * 200) - 100; // Random between -100 and 100
  const translateY = Math.floor(Math.random() * 200) - 100; // Random between -100 and 100
  const rotate = Math.floor(Math.random() * 360); // Random between 0 and 360 degrees
  const scale = (Math.random() * (1.5 - 0.5) + 0.5).toFixed(2); // Random scale between 0.5 and 1.5

  document.documentElement.style.setProperty(
    '--translate-x',
    `${translateX}px`
  );
  document.documentElement.style.setProperty(
    '--translate-y',
    `${translateY}px`
  );
  document.documentElement.style.setProperty('--rotate', `${rotate}deg`);
  document.documentElement.style.setProperty('--scale', scale);
}

// Store current data for re-rendering on resize
let currentCardsData = null;

// Add resize handler to recalculate spans
function handleResize() {
  if (currentCardsData && currentCardsData.length > 0) {
    renderCards(currentCardsData);
  }
}

// Debounce resize events to avoid excessive recalculation
let resizeTimeout;
function debouncedResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(handleResize, 100);
}

document.addEventListener('DOMContentLoaded', () => {
  getRandomTransformValues();
  fetchCards();
  processReadme();
  document.addEventListener('touchstart', handleTouchStart);
  document.addEventListener('keydown', handleKeyDown);
  window.addEventListener('resize', debouncedResize);
});
