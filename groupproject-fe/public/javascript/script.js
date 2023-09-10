// Hamburger navbar function
const mobileMenu = document.querySelector("#navBarButton");
const mobileMenuContainer = document.querySelector("#mobile-menu-2");
mobileMenu.addEventListener("click", () => {
  mobileMenuContainer.classList.toggle("hidden");
});

// Search bar function
document.addEventListener('DOMContentLoaded', (event) => {
  const searchBtn = document.getElementById('searchBtn');
  const searchBar = document.getElementById('searchBar');
  const closeSearchBtn = document.getElementById('closeSearchBtn');

  searchBtn.addEventListener('click', () => {
      searchBar.classList.remove('hidden');
  });

  closeSearchBtn.addEventListener('click', () => {
      searchBar.classList.add('hidden');
  });
});