function fetchCards() {
  fetch("public/files.json")
    .then((response) => response.json())
    .then((data) => {
      const header = document.querySelectorAll("headers");

      const container = document.getElementById("card-container");
      data.forEach((item) => {
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
        container.appendChild(card);
      });
    })
    .catch((error) => console.error("Error loading JSON:", error));
}

let clickCount = 0;
let clickTimeout;
let lastClickTime = 0;
let passwordVisible = false;

document.addEventListener("touchstart", () => {
  const currentTime = new Date().getTime();
  const timeDiff = currentTime - lastClickTime;

  if (timeDiff < 500) {
    clickCount++;
    clearTimeout(clickTimeout);
  } else {
    clickCount = 1;
  }

  lastClickTime = currentTime;

  if (clickCount === 5) {
    passwordVisible = !passwordVisible;
    const cards = document.querySelectorAll(
      ".card[data-password-required='1']"
    );
    cards.forEach((card) => {
      card.style.display = passwordVisible ? "block" : "none";
    });
    clickCount = 0;
    lastClickTime = 0;
  } else {
    clickTimeout = setTimeout(() => {
      clickCount = 0;
      lastClickTime = 0;
    }, 1000);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.shiftKey && event.altKey && event.key === "P") {
    passwordVisible = !passwordVisible;
    const cards = document.querySelectorAll(
      ".card[data-password-required='1']"
    );
    cards.forEach((card) => {
      card.style.display = passwordVisible ? "block" : "none";
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const removeElements = () => {
    const headers = document.querySelectorAll("h2");
    headers.forEach((header) => {
      if (header.textContent === "🌟 Social Media") {
        let nextElement = header.nextElementSibling;
        while (nextElement && nextElement.tagName === "P") {
          const elementToRemove = nextElement;
          nextElement = nextElement.nextElementSibling;
          elementToRemove.remove();
        }
        header.remove();
      }

      if (header.textContent === "🛠️ Tools & Technologies") {
        let nextElement = header.nextElementSibling;
        while (
          nextElement &&
          (nextElement.tagName === "TABLE" || nextElement.tagName === "HR")
        ) {
          const elementToRemove = nextElement;
          nextElement = nextElement.nextElementSibling;
          elementToRemove.remove();
        }
        header.remove();
      }

      if (header.textContent === "📊 GitHub Stats") {
        let nextElement = header.nextElementSibling;
        while (
          nextElement &&
          (nextElement.tagName === "DIV" ||
            nextElement.tagName === "HR" ||
            nextElement.tagName === "P")
        ) {
          const elementToRemove = nextElement;
          nextElement = nextElement.nextElementSibling;
          elementToRemove.remove();
        }
        header.remove();
      }
    });
  };

  const processReadme = async () => {
    try {
      if (typeof marked !== "object" || typeof marked.parse !== "function") {
        console.error("Marked library not properly loaded");
        return;
      }

      const response = await fetch(
        "https://raw.githubusercontent.com/violetto-rose/violetto-rose/main/README.md"
      );
      const markdown = await response.text();

      const readmeContent = document.getElementById("readme-content");
      readmeContent.style.display = "block";

      const baseUrl =
        "https://raw.githubusercontent.com/violetto-rose/violetto-rose/refs/heads/main/";
      const modifiedMarkdown = markdown.replace(
        /<img src="(?!http|https)(.*?)"/g,
        (_, p1) => `<img src="${baseUrl}${p1}"`
      );

      const htmlContent = marked.parse(modifiedMarkdown);
      document.getElementById("readme-content").innerHTML = htmlContent;

      setTimeout(removeElements, 100);
    } catch (error) {
      console.error("Error processing README:", error);
    }
  };

  const header = document.querySelectorAll("h1.headers");
  header.forEach((h1) => {
    h1.classList.add("visible");
  });

  fetchCards();
  processReadme();
});
