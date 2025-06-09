// Animation functionality

document.addEventListener("DOMContentLoaded", function () {
  // Scroll animations
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  function checkIfInView() {
    const windowHeight = window.innerHeight;
    const windowTopPosition = window.scrollY;
    const windowBottomPosition = windowTopPosition + windowHeight;

    animatedElements.forEach((element) => {
      const elementHeight = element.offsetHeight;
      const elementTopPosition = element.offsetTop;
      const elementBottomPosition = elementTopPosition + elementHeight;

      // Check if element is in viewport
      if (
        elementBottomPosition >= windowTopPosition &&
        elementTopPosition <= windowBottomPosition
      ) {
        element.classList.add("animated");
      }
    });
  }

  // Run on page load
  checkIfInView();

  // Run on scroll
  window.addEventListener("scroll", checkIfInView);

  // Add animation classes to elements as they appear in viewport
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (
          entry.target.classList.contains("fade-in-left") ||
          entry.target.classList.contains("fade-in-right") ||
          entry.target.classList.contains("fade-in") ||
          entry.target.classList.contains("slide-up")
        ) {
          // Element is already animated by CSS classes
        } else {
          entry.target.classList.add("animated");
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(".gallery-item, .team-member, .fact, .care-item")
    .forEach((item) => {
      observer.observe(item);
    });
});
