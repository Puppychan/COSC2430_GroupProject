// // Hamburger navbar function
const mobileMenu = document.querySelector("#navBarButton");
const mobileMenuContainer = document.querySelector("#mobile-menu-2");
mobileMenu?.addEventListener("click", () => {
    mobileMenuContainer.classList.toggle("hidden");
});