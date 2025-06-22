async function fetchCards() {
  try {
    const response = await fetch("public/files.json");
    const data = await response.json();

    const publicCards = data.filter((item) => !item.password_required);
    renderCards(publicCards);

    showHeader("APPS");
  } catch (error) {
    console.error("Error loading JSON:", error);
  }
}

function calculateSpanClasses(items) {
  const totalCards = items.length;
  const remainder = totalCards % 3;

  // No special spanning needed if perfectly divisible by 3
  if (remainder === 0) return new Array(totalCards).fill("");

  const spanClasses = new Array(totalCards).fill("");

  if (remainder === 1) {
    // First card spans 3 columns
    spanClasses[0] = "span-3";
  } else if (remainder === 2) {
    spanClasses[0] = "span-2";
  }

  return spanClasses;
}

function renderCards(items) {
  const container = document.getElementById("card-container");
  container.innerHTML = "";
  container.className = "container"; // Use existing container class

  if (Array.isArray(items)) {
    const spanClasses = calculateSpanClasses(items);

    items.forEach((item, index) => {
      const card = createCard(item, spanClasses[index]);
      container.appendChild(card);
    });
  }
}

function createCard(item, spanClass) {
  const card = document.createElement("a");
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
      const response = await fetch("public/files.json");
      const data = await response.json();
      protectedCardsData = data.filter((item) => item.password_required);
      publicCardsData = data.filter((item) => !item.password_required);
    }

    const allCards = [...publicCardsData, ...protectedCardsData];

    renderCards(allCards);
    protectedCardsLoaded = true;
  } catch (error) {
    console.error("Error loading protected cards:", error);
  }
}

function unloadProtectedCards() {
  renderCards(publicCardsData);
  protectedCardsLoaded = false;
}

function handleKeyDown(event) {
  if (event.ctrlKey && event.shiftKey && event.altKey && event.key === "P") {
    toggleProtectedCards();
  }
}

function showHeader(text) {
  const headers = document.querySelectorAll("h1.headers");
  headers.forEach((h1) => {
    if (h1.textContent === text) {
      h1.classList.add("visible");
    }
  });
}

async function processReadme() {
  try {
    if (typeof marked !== "object" || typeof marked.parse !== "function") {
      throw new Error("Marked library not properly loaded");
    }

    const response = await fetch(
      "https://raw.githubusercontent.com/violetto-rose/violetto-rose/main/README.md"
    );
    const markdown = await response.text();

    const readmeContent = document.getElementById("readme-content");
    readmeContent.style.display = "block";
    showHeader("README");

    const baseUrl =
      "https://raw.githubusercontent.com/violetto-rose/violetto-rose/refs/heads/main/";
    const modifiedMarkdown = markdown.replace(
      /<img src="(?!http|https)(.*?)"/g,
      (_, p1) => `<img src="${baseUrl}${p1}"`
    );

    const htmlContent = marked.parse(modifiedMarkdown);
    readmeContent.innerHTML = htmlContent;

    // Check if the primary input method is touch-based
    const isTouchPrimary = window.matchMedia("(pointer: coarse)").matches;
    const hintText = isTouchPrimary
      ? "5 taps to unlock"
      : "Ctrl ~ Shift ~ Alt ~ P";
    readmeContent.innerHTML += `<p style="font-size: 0.5rem; text-align: center; margin-bottom: 0">${hintText}</p>`;
  } catch (error) {
    console.error("Error processing README:", error);
  }
}

function getRandomTransformValues() {
  const translateX = Math.floor(Math.random() * 200) - 100; // Random between -100 and 100
  const translateY = Math.floor(Math.random() * 200) - 100; // Random between -100 and 100
  const rotate = Math.floor(Math.random() * 360); // Random between 0 and 360 degrees
  const scale = (Math.random() * (1.5 - 0.5) + 0.5).toFixed(2); // Random scale between 0.5 and 1.5

  document.documentElement.style.setProperty(
    "--translate-x",
    `${translateX}px`
  );
  document.documentElement.style.setProperty(
    "--translate-y",
    `${translateY}px`
  );
  document.documentElement.style.setProperty("--rotate", `${rotate}deg`);
  document.documentElement.style.setProperty("--scale", scale);
}

document.addEventListener("DOMContentLoaded", () => {
  getRandomTransformValues();
  fetchCards();
  processReadme();
  document.addEventListener("touchstart", handleTouchStart);
  document.addEventListener("keydown", handleKeyDown);
});
