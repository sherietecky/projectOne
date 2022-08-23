let cards = document.querySelectorAll(".card");
for (let card of cards) {
  card.addEventListener("click", () => {
    card.classList.add("hover");
    setTimeout(() => {
      card.classList.remove("hover");
    }, 500);
  });
  card.addEventListener("mouseleave", () => {
    card.classList.remove("hover");
  });
}
window.addEventListener("click", (event) => {
  console.log("click", event.target);
  checkOutFocus();
});
window.addEventListener("touchstart", (event) => {
  console.log("touch", event.target);
  checkOutFocus();
});
function checkOutFocus() {
  for (let card of cards) {
    if (isInside(card, event.target)) {
      continue;
    }
    card.classList.remove("hover");
  }
}
function isInside(parent, child) {
  while (child) {
    if (parent == child) {
      return true;
    }
    child = child.parentElement;
  }
  return false;
}
