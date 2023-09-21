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
    const form = document.querySelector('form');
    const searchInput = document.getElementById('searchInput');

    searchBtn.addEventListener('click', () => {
        // display search bar with animation
        if (searchBar.classList.contains('hidden')) {
            searchBar.classList.remove('hidden');
            searchBar.classList.remove('opacity-0');
            searchBar.classList.add('opacity-100');
        } else {
            // hide search bar with animation
            searchBar.classList.remove('opacity-100');
            searchBar.classList.add('opacity-0');
            setTimeout(() => searchBar.classList.add('hidden'), 300);
        }
    });

    closeSearchBtn.addEventListener('click', () => {
        searchBar.classList.remove('opacity-100');
        searchBar.classList.add('opacity-0');
        setTimeout(() => searchBar.classList.add('hidden'), 300);
    });

    // form.addEventListener('submit', (event) => {
    //     event.preventDefault();
    //     const query = searchInput.value;
    //     const data = { searchQuery: query };
    //     console.log(JSON.stringify(data));
    // });
});


// Price range slider function
let minPriceSlider = document.getElementById('min-price');
let maxPriceSlider = document.getElementById('max-price');

if (minPriceSlider && maxPriceSlider) {
    let minPriceLabel = document.getElementById('min-price-label');
    let maxPriceLabel = document.getElementById('max-price-label');

    // Set initial formatted values
    minPriceLabel.textContent = Number(minPriceSlider.value).toLocaleString('de-DE') + '₫';
    maxPriceLabel.textContent = Number(maxPriceSlider.value).toLocaleString('de-DE') + '₫';

    minPriceSlider.oninput = () => {
        if (parseInt(minPriceSlider.value) >= parseInt(maxPriceSlider.value)) {
            maxPriceSlider.value = minPriceSlider.value;
            maxPriceLabel.textContent = Number(maxPriceSlider.value).toLocaleString('de-DE') + '₫';
        }
        minPriceLabel.textContent = Number(minPriceSlider.value).toLocaleString('de-DE') + '₫';
    };

    maxPriceSlider.oninput = () => {
        if (parseInt(maxPriceSlider.value) <= parseInt(minPriceSlider.value)) {
            minPriceSlider.value = maxPriceSlider.value;
            minPriceLabel.textContent = Number(minPriceSlider.value).toLocaleString('de-DE') + '₫';
        }
        maxPriceLabel.textContent = Number(maxPriceSlider.value).toLocaleString('de-DE') + '₫';
    };

    // Reset filter function
    let resetFiltersButton = document.getElementById("reset-filters");
    let initialMinPrice = 0;
    let initialMaxPrice = 50000000;

    resetFiltersButton.onclick = () => {
        minPriceSlider.value = initialMinPrice;  // replace with your initial min price
        maxPriceSlider.value = initialMaxPrice;  // replace with your initial max price

        minPriceLabel.textContent = Number(minPriceSlider.value).toLocaleString('de-DE') + '₫';
        maxPriceLabel.textContent = Number(maxPriceSlider.value).toLocaleString('de-DE') + '₫';
    };
}

// Quantity input function
function increaseValue() {
    var value = parseInt(document.getElementById('number').value, 10);
    value = isNaN(value) ? 0 : value;
    value++;
    document.getElementById('number').value = value;
}

function decreaseValue() {
    var value = parseInt(document.getElementById('number').value, 10);
    value = isNaN(value) ? 1 : value;
    if (value > 1) {
        value--;
    }
    document.getElementById('number').value = value;
}