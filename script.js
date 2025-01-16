// Fetching the JSON data for the cards
fetch("files.json")
  .then((response) => response.json())
  .then((data) => {
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

// Keyboard event listener for toggling password-required cards
let passwordVisible = false;
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

// Fetching the README content
fetch(
  "https://raw.githubusercontent.com/violetto-rose/violetto-rose/main/README.md"
)
  .then((response) => response.text())
  .then((markdown) => {
    // Modify links in the Markdown
    const baseUrl =
      "https://raw.githubusercontent.com/violetto-rose/violetto-rose/refs/heads/main/";
    const modifiedMarkdown = markdown.replace(
      /<img src="(?!http|https)(.*?)"/g,
      (match, p1) => {
        return `<img src="${baseUrl}${p1}"`; // Convert relative image src attributes
      }
    );

    // Convert modified Markdown to HTML
    const htmlContent = marked(modifiedMarkdown);
    document.getElementById("readme-content").innerHTML = htmlContent;

    // Remove the specific element
    const socialMedia = document.getElementById("🌟-social-media");
    if (socialMedia) {
      const para = socialMedia.nextElementSibling;
      if (para && para.tagName === "P") {
        para.remove();
      }

      socialMedia.remove();
    }

    const tools = document.getElementById("🛠️-tools--technologies");
    if (tools) {
      const table = tools.nextElementSibling;
      if (table && table.tagName === "TABLE") {
        table.remove();
      }

      const hrElement = tools.nextElementSibling;
      if (hrElement && hrElement.tagName === "HR") {
        hrElement.remove();
      }

      tools.remove();
    }

    const statsHeader = document.getElementById("📊-github-stats");
    if (statsHeader) {
      const divWithImg = statsHeader.nextElementSibling;
      if (divWithImg && divWithImg.tagName === "DIV") {
        divWithImg.remove();
      }

      const hrElement = statsHeader.nextElementSibling;
      if (hrElement && hrElement.tagName === "HR") {
        hrElement.remove();
      }

      statsHeader.remove();
    }
  })
  .catch((error) => console.error("Error loading README:", error));
