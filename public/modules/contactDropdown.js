export function initializeContactDropdown() {
  const button = document.getElementById('contact-button');
  const dropdown = document.getElementById('contact-dropdown');

  if (!button || !dropdown) return;

  // Toggle dropdown on button click
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('active');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!button.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });

  // Close dropdown when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropdown.classList.contains('active')) {
      dropdown.classList.remove('active');
    }
  });
}
