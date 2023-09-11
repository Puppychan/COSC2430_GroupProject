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

// Change type function
let lastActive = null;
    
    function toggleActive(el) {
        if(lastActive) {
            lastActive.classList.toggle('text-blue-600');
            lastActive.classList.toggle('text-gray-400');
        }
        
        if(lastActive !== el) {
            el.classList.toggle('text-blue-600');
            el.classList.toggle('text-gray-400');
            lastActive = el;
        } else {
            lastActive = null;
        }
    }