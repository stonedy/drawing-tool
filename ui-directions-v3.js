document.querySelectorAll("[data-direction]").forEach((direction) => {
  direction.querySelector("[data-expand]").addEventListener("click", () => {
    direction.classList.toggle("expanded");
  });
});
