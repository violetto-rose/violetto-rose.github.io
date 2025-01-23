async function fetchCards() {
  try {
    const response = await fetch("public/files.json");
    const data = await response.json();
    const container = document.getElementById("card-container");

    data.forEach((item) => {
      const card = createCard(item);
      container.appendChild(card);
    });

    showHeader("Apps:");
  } catch (error) {
    console.error("Error loading JSON:", error);
  }
}

function createCard(item) {
  const card = document.createElement("a");
  card.href = item.link;
  card.className = "card";
  card.dataset.passwordRequired = item.password_required;
  card.innerHTML = `
    <i class="${item.icon}"></i>
    <h2>${item.name}</h2>
    <p>${item.description}</p>
  `;
  if (item.password_required) {
    card.style.display = "none";
  }
  return card;
}

function showHeader(text) {
  const headers = document.querySelectorAll("h1.headers");
  headers.forEach((h1) => {
    if (h1.textContent === text) {
      h1.classList.add("visible");
    }
  });
}

let clickCount = 0;
let lastClickTime = 0;
let passwordVisible = false;

function handleTouchStart() {
  const currentTime = new Date().getTime();
  const timeDiff = currentTime - lastClickTime;

  if (timeDiff < 500) {
    clickCount++;
  } else {
    clickCount = 1;
  }

  lastClickTime = currentTime;

  if (clickCount === 5) {
    togglePasswordVisibility();
    clickCount = 0;
    lastClickTime = 0;
  }
}

function togglePasswordVisibility() {
  passwordVisible = !passwordVisible;
  const cards = document.querySelectorAll(".card[data-password-required='1']");
  cards.forEach((card) => {
    card.style.display = passwordVisible ? "block" : "none";
  });
}

function handleKeyDown(event) {
  if (event.ctrlKey && event.shiftKey && event.altKey && event.key === "P") {
    togglePasswordVisibility();
  }
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
    showHeader("README:");

    const baseUrl =
      "https://raw.githubusercontent.com/violetto-rose/violetto-rose/refs/heads/main/";
    const modifiedMarkdown = markdown.replace(
      /<img src="(?!http|https)(.*?)"/g,
      (_, p1) => `<img src="${baseUrl}${p1}"`
    );

    const htmlContent = marked.parse(modifiedMarkdown);
    readmeContent.innerHTML = htmlContent;

    removeElements();
  } catch (error) {
    console.error("Error processing README:", error);
  }
}

function removeElements() {
  const headersToRemove = [
    "🌟 Social Media",
    "🛠️ Tools & Technologies",
    "📊 GitHub Stats",
  ];
  const headers = document.querySelectorAll("h2");

  headers.forEach((header) => {
    if (headersToRemove.includes(header.textContent)) {
      let nextElement = header.nextElementSibling;
      while (
        nextElement &&
        ["P", "TABLE", "HR", "DIV"].includes(nextElement.tagName)
      ) {
        const elementToRemove = nextElement;
        nextElement = nextElement.nextElementSibling;
        elementToRemove.remove();
      }
      header.remove();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchCards();
  processReadme();
  document.addEventListener("touchstart", handleTouchStart);
  document.addEventListener("keydown", handleKeyDown);
});
