document.addEventListener('DOMContentLoaded', () => {
    const tutorialList = document.getElementById('tutorial-list');
    const tutorialContent = document.getElementById('tutorial-content');
  
    // List of tutorial markdown files
    const tutorials = [
      { name: 'Introduction to UI/UX', file: 'intro.md' },
      { name: 'User Research', file: 'user-research.md' },
      { name: 'Wireframing', file: 'wireframing.md' },
      { name: 'Prototyping', file: 'prototyping.md' },
      { name: 'Usability Testing', file: 'usability-testing.md' }
    ];
  
    // Populate the sidebar
    tutorials.forEach(tutorial => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = tutorial.name;
      a.onclick = (e) => {
        e.preventDefault();
        loadTutorial(tutorial.file);
      };
      li.appendChild(a);
      tutorialList.appendChild(li);
    });
  
    // Function to load tutorial content
    async function loadTutorial(filename) {
      try {
        const response = await fetch(`tutorials/${filename}`);
        if (!response.ok) {
          throw new Error('Failed to load tutorial');
        }
        const markdown = await response.text();
        tutorialContent.innerHTML = marked.parse(markdown);
      } catch (error) {
        console.error('Error:', error);
        tutorialContent.innerHTML = '<p>Error loading tutorial content.</p>';
      }
    }
  
    // Load the first tutorial by default
    loadTutorial(tutorials[0].file);
  });
  
  // For demonstration purposes, let's simulate loading a markdown file
  const simulatedMarkdown = `
  # Introduction to UI/UX
  
  User Interface (UI) and User Experience (UX) design are crucial aspects of creating successful digital products.
  
  ## What is UI Design?
  
  UI design focuses on the visual elements of a digital product, including:
  - Layout
  - Color schemes
  - Typography
  - Buttons and icons
  
  ## What is UX Design?
  
  UX design is concerned with the overall experience of using a product, including:
  - User research
  - Information architecture
  - Interaction design
  - Usability testing
  `;
  
  // Simulate fetching and parsing the markdown
  console.log('Simulated Markdown content:');
  console.log(simulatedMarkdown);
  
  console.log('\nParsed HTML:');
  console.log(marked.parse(simulatedMarkdown));