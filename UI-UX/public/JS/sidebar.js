import { loadTutorial, updateActiveLink } from "./utils.js";

export const tutorials = [
  { name: "Introduction to UI/UX", file: "intro.md" },
  { name: "About the course", file: "about-course.md" },
  { name: "Setting up Figma", file: "setting-up-figma.md" },
  { name: "Setting up Penpot", file: "setting-up-penpot.md" },
  { name: "Chat App Redesign", file: "chat-app-redesign.md" },
  { name: "Food App", file: "food-app.md" },
  { name: "Social Media App", file: "social-media-app.md" },
  { name: "Product Website", file: "product-website.md" },
  { name: "Travel Agency Website", file: "travel-agency-website.md" },
  { name: "UI/UX Designer Portfolio Design", file: "uiux-designer-portfolio-design.md" },
  { name: "Dashboard Design", file: "dashboard-design.md" },
];

// Single URL mapping for clean URLs - used across all files
export const urlMapping = {
  // File to URL mapping
  fileToUrl: {
    'intro.md': 'introduction',
    'about-course.md': 'about-course',
    'setting-up-figma.md': 'setting-up-figma',
    'setting-up-penpot.md': 'setting-up-penpot',
    'chat-app-redesign.md': 'chat-app-redesign',
    'food-app.md': 'food-app',
    'social-media-app.md': 'social-media-app',
    'product-website.md': 'product-website',
    'travel-agency-website.md': 'travel-agency-website',
    'uiux-designer-portfolio-design.md': 'uiux-designer-portfolio-design',
    'dashboard-design.md': 'dashboard-design'
  },
  // URL to file mapping (reverse lookup)
  urlToFile: {
    'introduction': 'intro.md',
    'about-course': 'about-course.md',
    'setting-up-figma': 'setting-up-figma.md',
    'setting-up-penpot': 'setting-up-penpot.md',
    'chat-app-redesign': 'chat-app-redesign.md',
    'food-app': 'food-app.md',
    'social-media-app': 'social-media-app.md',
    'product-website': 'product-website.md',
    'travel-agency-website': 'travel-agency-website.md',
    'uiux-designer-portfolio-design': 'uiux-designer-portfolio-design.md',
    'dashboard-design': 'dashboard-design.md'
  }
};

export function populateSidebar() {
  const tutorialList = document.getElementById("tutorial-list");
  tutorialList.innerHTML = "";
  tutorialList.classList.add("tutorial-list");
  
  tutorials.forEach((tutorial) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const urlName = urlMapping.fileToUrl[tutorial.file] || tutorial.file.replace('.md', '');
    const tutorialPath = `/UI-UX/${urlName}`;
    a.href = tutorialPath;
    a.innerHTML = `<i class="fas fa-book-open"></i>&nbsp;${tutorial.name}`;
    a.onclick = (e) => {
      e.preventDefault();
      loadTutorial(tutorial.file);
      updateActiveLink(a);
      history.pushState({ tutorial: tutorial.file }, '', tutorialPath);
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
          window.toggleSidebar();
        }
      });
    });
  }
}

export function loadTutorialFromPath() {
  const pathname = window.location.pathname;
  let tutorialFile = null;
  let tutorialName = '';
  
  // Extract tutorial name from pathname
  if (pathname.startsWith('/UI-UX/')) {
    tutorialName = pathname.replace('/UI-UX/', '').replace(/\/$/, '');
    
    if (tutorialName) {
      tutorialFile = urlMapping.urlToFile[tutorialName] || `${tutorialName}.md`;
    }
  }
  
  // Find the tutorial in our list
  const tutorial = tutorials.find((t) => t.file === tutorialFile);
  
  if (tutorial) {
    loadTutorial(tutorial.file);
    const targetLink = document.querySelector(`#tutorial-list a[href="/UI-UX/${tutorialName}"]`);
    if (targetLink) {
      updateActiveLink(targetLink);
    }
    // Set history state for proper back/forward navigation
    history.replaceState({ tutorial: tutorial.file }, '', pathname);
  } else {
    // Default to first tutorial if no match found or if we're at the base UI-UX path
    loadTutorial(tutorials[0].file);
    const firstLink = document.querySelector("#tutorial-list a");
    if (firstLink) {
      updateActiveLink(firstLink);
    }
    // Update URL to reflect the default tutorial
    const defaultPath = `/UI-UX/${urlMapping.fileToUrl[tutorials[0].file]}`;
    history.replaceState({ tutorial: tutorials[0].file }, '', defaultPath);
  }
}
