document.addEventListener('DOMContentLoaded', () => {
    const tutorialList = document.getElementById('tutorial-list');
    const tutorialContent = document.getElementById('tutorial-content');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    // List of tutorial markdown files
    const tutorials = [
        { name: 'Introduction to UI/UX', file: '../tutorials/intro.md' },
        { name: 'User Research', file: '../tutorials/about-course.md' },
        { name: 'Wireframing', file: '../tutorials/setting-up-figma.md' },
        { name: 'Prototyping', file: '../tutorials/prototyping.md' },
        { name: 'Usability Testing', file: '../tutorials/usability-testing.md' },
        { name: 'Color Theory', file: '../tutorials/color-theory.md' },
        { name: 'Typography in UI', file: '../tutorials/typography.md' },
        { name: 'Responsive Design', file: '../tutorials/responsive-design.md' },
        { name: 'Accessibility in UI/UX', file: '../tutorials/accessibility.md' },
        { name: 'UI Animation', file: '../tutorials/ui-animation.md' }
    ];

    // Populate the sidebar
    function populateSidebar() {
        tutorialList.innerHTML = '';
        tutorials.forEach(tutorial => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${tutorial.file}`;
            a.textContent = tutorial.name;
            a.onclick = (e) => {
                e.preventDefault();
                loadTutorial(tutorial.file);
                updateActiveLink(a);
            };
            li.appendChild(a);
            tutorialList.appendChild(li);
        });
    }

    // Function to load tutorial content
    async function loadTutorial(filename) {
        try {
            const response = await fetch(`tutorials/${filename}`);
            if (!response.ok) {
                throw new Error('Failed to load tutorial');
            }
            const markdown = await response.text();
            tutorialContent.innerHTML = marked.parse(markdown);
            highlightCode();
            updateURL(filename);
        } catch (error) {
            console.error('Error:', error);
            tutorialContent.innerHTML = '<p>Error loading tutorial content. Please try again later.</p>';
        }
    }

    // Function to highlight code blocks
    function highlightCode() {
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });
    }

    // Function to update URL
    function updateURL(filename) {
        history.pushState(null, '', `#${filename}`);
    }

    // Function to update active link in sidebar
    function updateActiveLink(clickedLink) {
        document.querySelectorAll('#tutorial-list a').forEach(link => {
            link.classList.remove('active');
        });
        clickedLink.classList.add('active');
    }

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTutorials = tutorials.filter(tutorial => 
            tutorial.name.toLowerCase().includes(searchTerm)
        );
        
        searchResults.innerHTML = '';
        filteredTutorials.forEach(tutorial => {
            const div = document.createElement('div');
            div.textContent = tutorial.name;
            div.onclick = () => {
                loadTutorial(tutorial.file);
                updateActiveLink(document.querySelector(`#tutorial-list a[href="#${tutorial.file}"]`));
                searchInput.value = '';
                searchResults.innerHTML = '';
            };
            searchResults.appendChild(div);
        });
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.innerHTML = '';
        }
    });

    // Load tutorial based on URL hash
    function loadTutorialFromHash() {
        const hash = window.location.hash.slice(1);
        const tutorial = tutorials.find(t => t.file === hash);
        if (tutorial) {
            loadTutorial(tutorial.file);
            updateActiveLink(document.querySelector(`#tutorial-list a[href="#${tutorial.file}"]`));
        } else {
            loadTutorial(tutorials[0].file);
            updateActiveLink(document.querySelector('#tutorial-list a'));
        }
    }

    // Initial setup
    populateSidebar();
    loadTutorialFromHash();

    // Listen for hash changes
    window.addEventListener('hashchange', loadTutorialFromHash);
});