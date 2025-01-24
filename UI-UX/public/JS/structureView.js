export function setupStructureView() {
  const structureToggle = document.getElementById("structure-toggle")
  const structureView = document.getElementById("structure-view")

  structureToggle.addEventListener("click", () => {
    toggleStructureView()
  })
}

function toggleStructureView() {
  const structureToggle = document.getElementById("structure-toggle")
  const structureView = document.getElementById("structure-view")

  structureToggle.classList.toggle("open")
  structureView.classList.toggle("open")

  // Move the content area only for screens wider than 768px
  const content = document.getElementById("content")
  if (window.innerWidth > 768) {
    content.classList.toggle("shifted")
  }
}

export function closeStructureView() {
  const structureToggle = document.getElementById("structure-toggle")
  const structureView = document.getElementById("structure-view")
  const content = document.getElementById("content")

  structureToggle.classList.remove("open")
  structureView.classList.remove("open")
  content.classList.remove("shifted")
}

export function generateStructureView(content) {
  const structureContent = document.getElementById("structure-content")
  // Clear previous structure
  structureContent.innerHTML = ""

  // Create headings structure
  const headings = content.querySelectorAll("h1, h2, h3")

  if (headings.length === 0) {
    structureContent.innerHTML = "<p>No structure found</p>"
    return
  }

  let currentSection = null // Track the current section for subsections

  headings.forEach((heading) => {
    const level = heading.tagName.toLowerCase()
    const text = heading.textContent

    // Handle h1 (top-level section)
    if (level === "h1") {
      const section = createStructureItem(text, heading)
      structureContent.appendChild(section)
      currentSection = null
    }

    // Handle h2 (section)
    if (level === "h2") {
      const section = createStructureSection(text, heading)
      structureContent.appendChild(section)
      currentSection = section
    }

    // Handle h3 (subsection)
    if (level === "h3" && currentSection) {
      const subsection = createStructureSubsection(text, heading)
      currentSection.appendChild(subsection)
    }
  })
}

function createStructureItem(text, heading) {
  const item = document.createElement("div")
  item.classList.add("structure-item")
  item.textContent = text.replace(/:/g, "")
  item.onclick = () => scrollToHeading(heading)
  return item
}

function createStructureSection(text, heading) {
  const section = document.createElement("div")
  section.classList.add("structure-section")
  section.textContent = text.replace(/:/g, "")
  section.onclick = () => scrollToHeading(heading)
  return section
}

function createStructureSubsection(text, heading) {
  const subsection = document.createElement("div")
  subsection.classList.add("structure-subsection")
  subsection.textContent = text.replace(/:/g, "")
  subsection.onclick = () => scrollToHeading(heading)
  return subsection
}

function scrollToHeading(heading) {
  heading.scrollIntoView({ behavior: "smooth", block: "start" })
  if (window.innerWidth <= 768) {
    closeStructureView()
  }
}

