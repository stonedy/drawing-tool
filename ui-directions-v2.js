document.querySelectorAll("[data-direction]").forEach((section) => {
  section.querySelectorAll("[data-expand]").forEach((button) => {
    button.addEventListener("click", () => {
      section.classList.toggle("expanded");
      button.textContent = section.classList.contains("expanded") ? "Restore board" : "Expand board";
    });
  });
});
