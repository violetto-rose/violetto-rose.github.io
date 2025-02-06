document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", function (event) {
      const url = new URL(link.href, window.location.origin);
      if (url.pathname === "/ML/public/resources/" || "") {
        event.preventDefault();
        alert("Currenty Unavailable.");
      }
    });
  });
});
