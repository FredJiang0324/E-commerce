document.addEventListener('DOMContentLoaded', () => {
    const productId = new URLSearchParams(window.location.search).get('productId');
    if (!productId) {
        console.error('Product ID is missing in the URL');
        return;
    }
    fetchProductDetails(productId);
    fetchRelatedProducts(productId);
});

function fetchProductDetails(productId) {
    fetch(`http://localhost:3000/products/details/${productId}`)
        .then(response => response.json())
        .then(product => {
            const detailsContainer = document.getElementById('productDetails');
            detailsContainer.innerHTML += `
            <button id="favoriteBtn">Favorite</button>
            <h2>${product.name}</h2>
                <p>${product.description}</p>    
            <img src="${product.imageUrl}" alt="${product.name}" style="width: 100%; max-width: 200px;">
                            `;
            updateFavoriteButton(productId);

        })
        .catch(error => console.error('Failed to load product details:', error));
}

function fetchRelatedProducts(productId) {
    fetch(`http://localhost:3000/products/related/${productId}`)
        .then(response => response.json())
        .then(relatedProducts => {
            const relatedContainer = document.getElementById('relatedProducts');
            relatedContainer.innerHTML = '<h3>Related Products</h3>';
            relatedProducts.forEach(product => {
                relatedContainer.innerHTML += `
                <p>${product.name}</p>  
                    <img src="${product.imageUrl}" alt="${product.name}" onclick="window.location.href='product.html?productId=${product._id}'">
                `;
            });
        })
        .catch(error => console.error('Failed to load related products:', error));
}

function updateFavoriteButton(productId) {
    fetch(`http://localhost:3000/users/favorites`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(response => response.json())
    .then(favorites => {
        const isFavorited = favorites.some(favorite => favorite._id === productId);
        const favoriteBtn = document.getElementById('favoriteBtn');
        favoriteBtn.textContent = isFavorited ? 'Unfavorite' : 'Favorite';
        favoriteBtn.onclick = () => toggleFavorite(productId, isFavorited);
    })
    .catch(error => console.error('Failed to load favorites:', error));
}

function toggleFavorite(productId, isFavorited) {
    const method = isFavorited ? 'DELETE' : 'POST';
    const endpoint = isFavorited ? `/users/favorites/remove/${productId}` : '/users/favorites/add';
    const body = isFavorited ? null : JSON.stringify({ productId });

    fetch(`http://localhost:3000${endpoint}`, {
        method: method,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: body
    })
    .then(response => {
        if (response.ok) {
            const favoriteBtn = document.getElementById('favoriteBtn');
            favoriteBtn.textContent = isFavorited ? 'Favorite' : 'Unfavorite';
            if (!isFavorited) favoriteBtn.onclick = () => toggleFavorite(productId, true);
            else favoriteBtn.onclick = () => toggleFavorite(productId, false);
        } else {
            throw new Error('Failed to toggle favorite');
        }
    })
    .catch(error => console.error('Error toggling favorite:', error));
}