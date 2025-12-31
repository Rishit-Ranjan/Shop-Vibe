// Products Page - Using DataManager for product catalog
// Handles filtering, sorting, pagination, and cart/wishlist operations

(function () {
    'use strict';

    // Global variables
    let currentProducts = [];
    let allProducts = [];
    let currentPage = 1;
    let productsPerPage = 12;
    let currentViewMode = 'grid';
    let currentFilters = {
        category: 'all',
        minPrice: 0,
        maxPrice: 500
    };

    // Initialize page
    document.addEventListener('DOMContentLoaded', async function () {
        if (window.DataManager) {
            allProducts = await DataManager.getAllProducts();
            currentProducts = [...allProducts];
            initializePage();
        } else {
            console.error('DataManager not loaded');
        }
    });

    function initializePage() {
        renderProducts();
        setupEventListeners();
        updateProductCount();
        initQuickView();
    }

    function setupEventListeners() {
        // Mobile menu toggle
        window.toggleMenu = function () {
            const navMenu = document.querySelector('.nav-menu');
            navMenu.classList.toggle('active');
        };

        // Scroll to top functionality
        window.addEventListener('scroll', function () {
            const scrollTop = document.getElementById('scrollTop');
            if (window.pageYOffset > 300) {
                scrollTop.classList.add('visible');
            } else {
                scrollTop.classList.remove('visible');
            }
        });

        // Category filter listeners
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', function () {
                const category = this.getAttribute('data-category');
                selectCategory(category);
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (event) {
            const navMenu = document.querySelector('.nav-menu');
            const menuToggle = document.querySelector('.menu-toggle');
            const navbar = document.querySelector('.navbar');

            if (!navbar.contains(event.target)) {
                navMenu.classList.remove('active');
            }
        });
    }

    // Product rendering
    function renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        const loading = document.getElementById('loading');
        const noResults = document.getElementById('noResults');

        // Show loading
        loading.style.display = 'block';
        noResults.style.display = 'none';
        productsGrid.innerHTML = '';

        // Simulate loading delay
        setTimeout(() => {
            loading.style.display = 'none';

            if (currentProducts.length === 0) {
                noResults.style.display = 'block';
                return;
            }

            // Calculate pagination
            const startIndex = (currentPage - 1) * productsPerPage;
            const endIndex = startIndex + productsPerPage;
            const productsToShow = currentProducts.slice(startIndex, endIndex);

            // Render products
            productsToShow.forEach((product, index) => {
                const productCard = createProductCard(product);
                productCard.style.animationDelay = `${index * 0.1}s`;
                productsGrid.appendChild(productCard);
            });

            updatePagination();
            updateProductCount();
        }, 300);
    }

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = `product-card ${currentViewMode === 'list' ? 'list-view' : ''}`;
        card.setAttribute('data-product-id', product.id);

        const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
        const badgeClass = product.badge === 'Sale' ? 'sale' : product.badge === 'New' ? 'new' : '';

        // Determine if we have a real image or need placeholder
        const hasRealImage = product.image && !product.image.match(/[\u{1F300}-\u{1F9FF}]/u);
        const imageHTML = hasRealImage
            ? `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">`
            : `<div class="product-image-placeholder" data-category="${product.category}">${product.image || '📦'}</div>`;

        card.innerHTML = `
            <div class="product-image">
                ${imageHTML}
                ${product.badge ? `<div class="product-badge ${badgeClass}">${product.badge}</div>` : ''}
                <div class="product-actions">
                    <button class="action-btn" onclick="toggleWishlist(${product.id})" title="Add to Wishlist">❤️</button>
                    <button class="action-btn" onclick="quickView(${product.id})" title="Quick View">👁️</button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    <div class="stars">${generateStars(product.rating)}</div>
                    <span class="rating-count">(${product.ratingCount})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                    ${discount > 0 ? `<span class="discount">${discount}% OFF</span>` : ''}
                </div>
                <div class="product-buttons">
                    <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                    ${currentViewMode === 'list' ? '<button class="buy-now" onclick="buyNow(' + product.id + ')">Buy Now</button>' : ''}
                </div>
            </div>
        `;

        return card;
    }

    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '⭐';
        }
        if (halfStar) {
            stars += '⭐';
        }

        return stars;
    }

    // Filtering functions
    function selectCategory(category) {
        // Update UI
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
        });
        const categoryElement = document.querySelector(`[data-category="${category}"]`);
        if (categoryElement) {
            categoryElement.classList.add('active');
        }

        // Update filter
        currentFilters.category = category;
        currentPage = 1;

        // Apply filters
        applyFilters();
    }

    function applyFilters() {
        currentProducts = allProducts.filter(product => {
            // Category filter
            if (currentFilters.category !== 'all' && product.category !== currentFilters.category) {
                return false;
            }

            // Price filter
            if (product.price < currentFilters.minPrice || product.price > currentFilters.maxPrice) {
                return false;
            }

            return true;
        });

        renderProducts();
    }

    window.updatePriceRange = function () {
        const minPrice = parseInt(document.getElementById('minPrice').value);
        const maxPrice = parseInt(document.getElementById('maxPrice').value);

        // Ensure min is not greater than max
        if (minPrice > maxPrice) {
            document.getElementById('minPrice').value = maxPrice;
            currentFilters.minPrice = maxPrice;
        } else {
            currentFilters.minPrice = minPrice;
        }

        if (maxPrice < minPrice) {
            document.getElementById('maxPrice').value = minPrice;
            currentFilters.maxPrice = minPrice;
        } else {
            currentFilters.maxPrice = maxPrice;
        }

        // Update labels
        document.getElementById('minPriceLabel').textContent = `$${currentFilters.minPrice}`;
        document.getElementById('maxPriceLabel').textContent = `$${currentFilters.maxPrice}`;

        // Update input fields
        document.getElementById('minPriceInput').value = currentFilters.minPrice;
        document.getElementById('maxPriceInput').value = currentFilters.maxPrice;

        currentPage = 1;
        applyFilters();
    };

    window.updateFromInput = function () {
        const minPrice = parseInt(document.getElementById('minPriceInput').value) || 0;
        const maxPrice = parseInt(document.getElementById('maxPriceInput').value) || 500;

        document.getElementById('minPrice').value = minPrice;
        document.getElementById('maxPrice').value = maxPrice;

        updatePriceRange();
    };

    window.clearAllFilters = function () {
        // Reset category
        selectCategory('all');

        // Reset price range
        document.getElementById('minPrice').value = 0;
        document.getElementById('maxPrice').value = 500;
        document.getElementById('minPriceInput').value = 0;
        document.getElementById('maxPriceInput').value = 500;

        currentFilters = {
            category: 'all',
            minPrice: 0,
            maxPrice: 500
        };

        updatePriceRange();
    };

    // Sorting functions
    window.sortProducts = function () {
        const sortValue = document.getElementById('sortDropdown').value;

        switch (sortValue) {
            case 'price-low':
                currentProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                currentProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                currentProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'rating':
                currentProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                currentProducts.sort((a, b) => b.isNew - a.isNew);
                break;
            default:
                // Featured - reset to original order
                applyFilters();
                return;
        }

        renderProducts();
    };

    // View mode functions
    window.setViewMode = function (mode) {
        currentViewMode = mode;

        // Update buttons
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(mode + 'ViewBtn').classList.add('active');

        // Update grid class
        const productsGrid = document.getElementById('productsGrid');
        if (mode === 'list') {
            productsGrid.classList.add('list-view');
        } else {
            productsGrid.classList.remove('list-view');
        }

        renderProducts();
    };

    // Pagination functions
    function updatePagination() {
        const totalPages = Math.ceil(currentProducts.length / productsPerPage);
        const pagination = document.getElementById('pagination');

        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }

        pagination.style.display = 'flex';

        // Generate page buttons
        let paginationHTML = `<button class="page-btn ${currentPage === 1 ? 'disabled' : ''}" id="prevBtn" onclick="changePage(-1)">« Previous</button>`;

        for (let i = 1; i <= Math.min(totalPages, 5); i++) {
            paginationHTML += `<button class="page-btn ${currentPage === i ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
        }

        if (totalPages > 5) {
            paginationHTML += `<span>...</span>`;
            paginationHTML += `<button class="page-btn ${currentPage === totalPages ? 'active' : ''}" onclick="goToPage(${totalPages})">${totalPages}</button>`;
        }

        paginationHTML += `<button class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" id="nextBtn" onclick="changePage(1)">Next »</button>`;

        pagination.innerHTML = paginationHTML;
    }

    window.changePage = function (direction) {
        const totalPages = Math.ceil(currentProducts.length / productsPerPage);
        const newPage = currentPage + direction;

        if (newPage >= 1 && newPage <= totalPages) {
            currentPage = newPage;
            renderProducts();
            scrollToTop();
        }
    };

    window.goToPage = function (page) {
        currentPage = page;
        renderProducts();
        scrollToTop();
    };

    function updateProductCount() {
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = Math.min(startIndex + productsPerPage, currentProducts.length);

        document.getElementById('productsShowing').textContent = `${startIndex + 1}-${endIndex}`;
        document.getElementById('productsTotal').textContent = currentProducts.length;
    }

    // Mobile filters functions
    window.openMobileFilters = function () {
        const overlay = document.getElementById('mobileFiltersOverlay');
        const content = document.getElementById('mobileFiltersContent');
        const sidebar = document.getElementById('filtersSidebar');

        // Clone filters content to mobile
        content.innerHTML = content.querySelector('.mobile-filters-header').outerHTML + sidebar.innerHTML;

        overlay.style.display = 'block';
        content.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeMobileFilters = function () {
        const overlay = document.getElementById('mobileFiltersOverlay');
        const content = document.getElementById('mobileFiltersContent');

        overlay.style.display = 'none';
        content.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    // Product actions
    window.addToCart = async function (productId) {
        if (window.DataManager && window.Notifications) {
            const success = await DataManager.addToCart(productId);

            if (success) {
                const product = await DataManager.getProductById(productId);

                // Update cart count
                if (window.NavbarSync) {
                    NavbarSync.updateCartCount();
                }

                // Show notification
                Notifications.success(`${product.name} added to cart!`);
            } else {
                Notifications.error('Failed to add item to cart');
            }
        }
    };

    window.buyNow = function (productId) {
        addToCart(productId);
        setTimeout(() => {
            window.location.href = '../checkout/checkout.html';
        }, 500);
    };

    window.toggleWishlist = async function (productId) {
        if (window.DataManager && window.Notifications) {
            const product = await DataManager.getProductById(productId);
            const isInWishlist = await DataManager.isInWishlist(productId);

            await DataManager.toggleWishlist(productId);

            // Update wishlist count
            if (window.NavbarSync) {
                NavbarSync.updateWishlistCount();
            }

            // Show notification
            if (isInWishlist) {
                Notifications.info(`${product.name} removed from wishlist`);
            } else {
                Notifications.success(`${product.name} added to wishlist!`);
            }
        }
    };

    window.quickView = async function (productId) {
        const product = await DataManager.getProductById(productId);
        const quickViewModal = document.querySelector('.quick-view-modal');
        if (product && quickViewModal) {
            quickViewModal.querySelector('.product-image').src = product.image;
            quickViewModal.querySelector('.product-title').textContent = product.name;
            quickViewModal.querySelector('.product-description').textContent = product.description;
            quickViewModal.querySelector('.product-price').textContent = `$${product.price.toFixed(2)}`;
            quickViewModal.style.display = 'block';
        }
    };

    function initQuickView() {
        fetch('quick-view.html')
            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML('beforeend', data);
                const quickViewModal = document.querySelector('.quick-view-modal');
                const closeButton = quickViewModal.querySelector('.close-quick-view');
                closeButton.onclick = () => {
                    quickViewModal.style.display = 'none';
                };
                window.onclick = (event) => {
                    if (event.target == quickViewModal) {
                        quickViewModal.style.display = 'none';
                    }
                };
            });
    }

    console.log('Products page loaded successfully!');
})();