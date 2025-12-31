// Wishlist Page - Using DataManager for wishlist management
// Handles wishlist display, filtering, sorting, and cart operations

(function () {
    'use strict';

    let currentWishlist = [];
    let currentPage = 1;
    let itemsPerPage = 12;
    let currentViewMode = 'grid';
    let currentCategory = 'all';
    let currentSort = 'newest';

    // Initialize wishlist on page load
    document.addEventListener('DOMContentLoaded', function () {
        if (window.DataManager) {
            loadWishlist();
            setupEventListeners();
        } else {
            console.error('DataManager not loaded');
        }
    });

    function setupEventListeners() {
        window.toggleMenu = function () {
            const navMenu = document.querySelector('.nav-menu');
            navMenu.classList.toggle('active');
        };
    }

    function loadWishlist() {
        currentWishlist = DataManager.getWishlistItems();
        applyFiltersAndSort();
        renderWishlist();
        updateStats();
    }

    function applyFiltersAndSort() {
        let filtered = [...currentWishlist];

        // Apply category filter
        if (currentCategory !== 'all') {
            filtered = filtered.filter(item => item.category === currentCategory);
        }

        // Apply sorting
        switch (currentSort) {
            case 'oldest':
                filtered.reverse();
                break;
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
        }

        currentWishlist = filtered;
    }

    function renderWishlist() {
        const wishlistGrid = document.getElementById('wishlistGrid');
        const emptyWishlist = document.getElementById('emptyWishlist');
        const pagination = document.getElementById('pagination');

        if (currentWishlist.length === 0) {
            wishlistGrid.style.display = 'none';
            emptyWishlist.style.display = 'flex';
            pagination.style.display = 'none';
            return;
        }

        wishlistGrid.style.display = 'grid';
        emptyWishlist.style.display = 'none';

        // Pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const itemsToShow = currentWishlist.slice(startIndex, endIndex);

        wishlistGrid.innerHTML = itemsToShow.map(item => {
            const hasRealImage = item.image && !item.image.match(/[\u{1F300}-\u{1F9FF}]/u);
            const imageHTML = hasRealImage
                ? `<img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">`
                : `<div class="product-image-placeholder" data-category="${item.category}">${item.image || '📦'}</div>`;

            const discount = item.oldPrice ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100) : 0;

            return `
                <div class="wishlist-item ${currentViewMode === 'list' ? 'list-view' : ''}">
                    <div class="item-image">
                        ${imageHTML}
                        ${item.badge ? `<div class="item-badge">${item.badge}</div>` : ''}
                    </div>
                    <div class="item-info">
                        <div class="item-category">${item.category}</div>
                        <h3 class="item-name">${item.name}</h3>
                        <p class="item-description">${item.description}</p>
                        <div class="item-rating">
                            <span class="stars">${'⭐'.repeat(Math.floor(item.rating))}</span>
                            <span class="rating-count">(${item.ratingCount})</span>
                        </div>
                        <div class="item-price">
                            <span class="current-price">$${item.price.toFixed(2)}</span>
                            ${item.oldPrice ? `<span class="old-price">$${item.oldPrice.toFixed(2)}</span>` : ''}
                            ${discount > 0 ? `<span class="discount">${discount}% OFF</span>` : ''}
                        </div>
                        <div class="item-actions">
                            <button class="add-to-cart-btn" onclick="addToCartFromWishlist(${item.id})">Add to Cart</button>
                            <button class="remove-btn" onclick="removeFromWishlist(${item.id})">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        updatePagination();
    }

    function updateStats() {
        const wishlistItems = DataManager.getWishlistItems();
        const totalItems = wishlistItems.length;
        const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);
        const onSale = wishlistItems.filter(item => item.oldPrice).length;

        document.getElementById('totalItems').textContent = totalItems;
        document.getElementById('totalValue').textContent = `$${Math.round(totalValue)}`;
        document.getElementById('onSale').textContent = onSale;
    }

    function updatePagination() {
        const totalPages = Math.ceil(currentWishlist.length / itemsPerPage);
        const pagination = document.getElementById('pagination');

        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }

        pagination.style.display = 'flex';
        pagination.innerHTML = `
            <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(-1)">« Previous</button>
            ${Array.from({ length: Math.min(totalPages, 5) }, (_, i) =>
            `<button class="page-btn ${currentPage === i + 1 ? 'active' : ''}" onclick="goToPage(${i + 1})">${i + 1}</button>`
        ).join('')}
            ${totalPages > 5 ? `<span>...</span><button class="page-btn" onclick="goToPage(${totalPages})">${totalPages}</button>` : ''}
            <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(1)">Next »</button>
        `;
    }

    window.filterByCategory = function () {
        currentCategory = document.getElementById('categoryFilter').value;
        currentPage = 1;
        loadWishlist();
    };

    window.sortWishlist = function () {
        currentSort = document.getElementById('sortFilter').value;
        currentPage = 1;
        loadWishlist();
    };

    window.setViewMode = function (mode) {
        currentViewMode = mode;
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(mode + 'ViewBtn').classList.add('active');
        renderWishlist();
    };

    window.changePage = function (direction) {
        const totalPages = Math.ceil(currentWishlist.length / itemsPerPage);
        const newPage = currentPage + direction;
        if (newPage >= 1 && newPage <= totalPages) {
            currentPage = newPage;
            renderWishlist();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    window.goToPage = function (page) {
        currentPage = page;
        renderWishlist();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addToCartFromWishlist = function (productId) {
        if (DataManager.addToCart(productId)) {
            const product = DataManager.getProductById(productId);

            if (window.NavbarSync) {
                NavbarSync.updateCartCount();
            }

            if (window.Notifications) {
                Notifications.success(`${product.name} added to cart!`);
            }
        }
    };

    window.removeFromWishlist = function (productId) {
        const product = DataManager.getProductById(productId);
        DataManager.removeFromWishlist(productId);

        if (window.NavbarSync) {
            NavbarSync.updateWishlistCount();
        }

        if (window.Notifications) {
            Notifications.info(`${product.name} removed from wishlist`);
        }

        loadWishlist();
    };

    window.addAllToCart = function () {
        const wishlistItems = DataManager.getWishlistItems();

        if (wishlistItems.length === 0) {
            if (window.Notifications) {
                Notifications.warning('Your wishlist is empty!');
            }
            return;
        }

        wishlistItems.forEach(item => {
            DataManager.addToCart(item.id);
        });

        if (window.NavbarSync) {
            NavbarSync.updateCartCount();
        }

        if (window.Notifications) {
            Notifications.success(`${wishlistItems.length} items added to cart!`);
        }
    };

    window.clearWishlist = function () {
        if (confirm('Are you sure you want to clear your entire wishlist?')) {
            DataManager.clearWishlist();

            if (window.NavbarSync) {
                NavbarSync.updateWishlistCount();
            }

            if (window.Notifications) {
                Notifications.info('Wishlist cleared');
            }

            loadWishlist();
        }
    };

    window.browseProducts = function () {
        window.location.href = '../products/products.html';
    };

    console.log('Wishlist page loaded successfully!');
})();