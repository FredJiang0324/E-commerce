document.addEventListener('DOMContentLoaded', function() {
    loadFilterOptions('brands', 'brandFilters');
    loadFilterOptions('types', 'typeFilters');
  
    const applyFiltersBtn = document.getElementById('applyFilters');
    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener('click', applyFilters);
    } else {
      console.error('Apply Filters button not found');
    }
  
    loadProducts();
    loadFavorites();
  });
  
  function loadFilterOptions(endpoint, containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      fetch(`http://localhost:3000/products/${endpoint}`)
        .then(response => response.json())
        .then(data => {
          data.forEach(item => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = item;
            checkbox.id = item;
            checkbox.name = endpoint; // "brands" or "types"
            const label = document.createElement('label');
            label.htmlFor = item;
            label.textContent = item;
            container.appendChild(label);
            label.appendChild(checkbox);
          });
        })
        .catch(error => console.error(`Failed to load ${endpoint}:`, error));
    } else {
      console.error(`${containerId} container not found`);
    }
  }
  
  
  function applyFilters() {
    const selectedBrands = [...document.querySelectorAll('#brandFilters input:checked')].map(el => el.value);
    const selectedTypes = [...document.querySelectorAll('#typeFilters input:checked')].map(el => el.value);
    loadProducts(1, selectedBrands, selectedTypes);
  }
  
  function updatePagination(currentPage, totalPages) {
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = ''; 
    let filters = {
        brands: [],
        types: []
    };

    function updateFilters() {
        filters.brands = [...document.querySelectorAll('[name="brand"]:checked')].map(el => el.value);
        filters.types = [...document.querySelectorAll('[name="type"]:checked')].map(el => el.value);
    }
    // Previous Page Button
    const prevPageButton = document.createElement('button');
    prevPageButton.textContent = 'Previous';
    prevPageButton.disabled = currentPage === 1;
    prevPageButton.addEventListener('click', () => loadProducts(currentPage - 1, filters));
    paginationContainer.appendChild(prevPageButton);
  
    // Next Page Button
    const nextPageButton = document.createElement('button');
    nextPageButton.textContent = 'Next';
    nextPageButton.disabled = currentPage === totalPages;
    nextPageButton.addEventListener('click', () => loadProducts(currentPage + 1, filters));
    paginationContainer.appendChild(nextPageButton);
  }
  

  function loadProducts(page = 1, brands = [], types = []) {
    const query = new URLSearchParams();
    query.append('page', page);
    if (brands.length) query.append('brand', brands.join(';'));
    if (types.length) query.append('type', types.join(';'));
  
    fetch(`http://localhost:3000/products?${query}`)
      .then(response => response.json())
      .then(({ products, totalPages }) => {
        const productsContainer = document.getElementById('productGallery');
        productsContainer.innerHTML = products.length ? '' : '<p>No products found.</p>';
        products.forEach(product => {
            const productDiv = document.createElement('div');
                            productDiv.className = 'product-item';
                            
                            productDiv.innerHTML = `
                            <a href="product.html?productId=${product._id}">
                            <img src="${product.imageUrl}" alt="$0{product.name}" class="product-img">
                        </a>
                                <h3 class="product-name">${product.name}</h3>
                                <p>${product.description}</p>
                                <p class="product-price">$${product.price}</p>
                            `;
                            
                            productsContainer.appendChild(productDiv);
        });
        updatePagination(page, totalPages);
    })
      .catch(error => console.error('Failed to load products:', error));
  }
  
  function loadFavorites() {
    fetch('http://localhost:3000/users/favorites', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(favorites => {
        const favoritesList = document.getElementById('favoritesList');
        favoritesList.innerHTML = ''; // Clear the list first

        favorites.forEach(favorite => {
            const listItem = document.createElement('li');
            listItem.className = 'favorite-item';

            listItem.innerHTML = `
                <img src="${favorite.imageUrl}" alt="${favorite.name}" width="50" height="50">
                <span>${favorite.name}</span>
                <button onclick="toggleFavorite('${favorite._id}', this)">Remove</button>
            `;

            favoritesList.appendChild(listItem);
        });
    })
    .catch(error => console.error('Failed to load favorites:', error));
}

function toggleFavorite(productId, buttonElement) {
    const action = buttonElement.textContent === 'Remove' ? 'DELETE' : 'POST';

    fetch(`http://localhost:3000/users/favorites/remove/${productId}`, {
        method: action,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        if (response.ok) {
            loadFavorites();
        } else {
            console.error('Failed to toggle favorite status');
        }
    })
    .catch(error => console.error('Error toggling favorite:', error));
}