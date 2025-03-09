import { loadTutorial, updateActiveLink } from "./utils.js";

// List of tutorial markdown files
const tutorials = [
  { name: "Introduction to UI/UX", file: "intro.md" },
  { name: "About the course", file: "about-course.md" },
  { name: "Setting up Figma", file: "setting-up-figma.md" },
  { name: "Setting up Penpot", file: "setting-up-penpot.md" },
  { name: "Chat App Redesign", file: "chat-app-redesign.md" },
  { name: "Food App", file: "food-app.md" },
  { name: "Social Media App", file: "social-media-app.md"},
];

export function populateSidebar() {
  const tutorialList = document.getElementById("tutorial-list");
  tutorialList.innerHTML = "";
  tutorialList.classList.add("tutorial-list");
  tutorials.forEach((tutorial) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${tutorial.file}`;
    a.innerHTML = `<i class="fas fa-book-open"></i> &nbsp ${tutorial.name}`;
    a.onclick = (e) => {
      e.preventDefault();
      loadTutorial(tutorial.file);
      updateActiveLink(a);
    };
    li.appendChild(a);
    tutorialList.appendChild(li);
  });
  sidebarLinkListeners();
}

function sidebarLinkListeners() {
  const tutorialLinks = document.querySelectorAll("#tutorial-list a");
  const sidebar = document.getElementById("sidebar");

  if (tutorialLinks) {
    tutorialLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768 && sidebar.classList.contains("open")) {
          toggleSidebar();
        }
      });
    });
  }
}

export function loadTutorialFromHash() {
  const hash = window.location.hash.slice(1);
  const tutorial = tutorials.find((t) => t.file === hash);
  if (tutorial) {
    loadTutorial(tutorial.file);
    updateActiveLink(
      document.querySelector(`#tutorial-list a[href="#${tutorial.file}"]`)
    );
  } else {
    loadTutorial(tutorials[0].file);
    updateActiveLink(document.querySelector("#tutorial-list a"));
  }
}

// Export tutorials for use in other modules
export { tutorials };
