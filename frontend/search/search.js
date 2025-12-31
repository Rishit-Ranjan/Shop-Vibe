// Search Page - Using DataManager for product search
// Handles search functionality, filtering, and sorting

(function () {
    'use strict';

    let allProducts = [];
    let currentProducts = [];
    let searchResults = [];
    let isGridView = true;

    // Initialize search page
    document.addEventListener('DOMContentLoaded', async function () {
        if (window.DataManager) {
            try {
                allProducts = await DataManager.getAllProducts();
                initializeSearch();
            } catch (error) {
                console.error('Error loading products:', error);
                initializeSearch();
            }
        } else {
            console.error('DataManager not loaded');
        }
    });

    function initializeSearch() {
        // Get search query from URL if present
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q') || '';
        const category = urlParams.get('category') || '';

        const searchInput = document.getElementById('searchInput');
        if (searchInput && query) {
            searchInput.value = query;
        }

        // Render dynamic category filters
        renderCategoryFilters(category);

        performSearch();
        setupEventListeners();
    }

    function setupEventListeners() {
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        const sortSelect = document.getElementById('sortSelect');
        const gridViewBtn = document.getElementById('gridView');
        const listViewBtn = document.getElementById('listView');
        const clearFiltersBtn = document.getElementById('clearFilters');

        if (searchBtn) {
            searchBtn.addEventListener('click', performSearch);
        }

        if (searchInput) {
            // Create and inject clear button
            const clearBtn = document.createElement('button');
            clearBtn.innerHTML = '&times;';
            clearBtn.className = 'clear-search-btn';
            clearBtn.setAttribute('aria-label', 'Clear search');
            clearBtn.style.cssText = `
                position: absolute;
                right: 60px;
                top: 50%;
                transform: translateY(-50%);
                background: transparent;
                border: none;
                font-size: 20px;
                color: #999;
                cursor: pointer;
                display: none;
                padding: 0;
                width: 24px;
                height: 24px;
                line-height: 24px;
                border-radius: 50%;
                align-items: center;
                justify-content: center;
                transition: color 0.2s;
            `;
            
            // Ensure parent is relative for positioning
            if (searchInput.parentElement && getComputedStyle(searchInput.parentElement).position === 'static') {
                searchInput.parentElement.style.position = 'relative';
            }
            searchInput.parentElement.appendChild(clearBtn);

            // Toggle visibility helper
            const toggleClearBtn = () => {
                clearBtn.style.display = searchInput.value.trim() ? 'flex' : 'none';
            };

            // Initial state
            toggleClearBtn();

            // Clear button click handler
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                toggleClearBtn();
                searchInput.focus();
                performSearch();
            });

            // Hover effect
            clearBtn.addEventListener('mouseenter', () => clearBtn.style.color = '#333');
            clearBtn.addEventListener('mouseleave', () => clearBtn.style.color = '#999');

            searchInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });

            searchInput.addEventListener('input', function () {
                toggleClearBtn();
                if (this.value.trim() === '') {
                    performSearch();
                }
            });
        }

        if (sortSelect) {
            sortSelect.addEventListener('change', sortProducts);
        }

        if (gridViewBtn) {
            gridViewBtn.addEventListener('click', () => setViewMode('grid'));
        }

        if (listViewBtn) {
            listViewBtn.addEventListener('click', () => setViewMode('list'));
        }

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', clearAllFilters);
        }

        // Filter checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', applyFilters);
        });

        // Price inputs
        const minPrice = document.getElementById('minPrice');
        const maxPrice = document.getElementById('maxPrice');

        if (minPrice) minPrice.addEventListener('input', applyFilters);
        if (maxPrice) maxPrice.addEventListener('input', applyFilters);
    }

    function performSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        
        // Check for active category filters
        const activeCategories = document.querySelectorAll('input[name="category"]:checked');
        const hasCategoryFilter = activeCategories.length > 0;

        const searchTermDisplay = document.getElementById('searchTerm');
        if (searchTermDisplay) {
            if (searchTerm) {
                searchTermDisplay.textContent = searchTerm;
            } else if (hasCategoryFilter) {
                const catNames = Array.from(activeCategories).map(cb => cb.value).join(', ');
                searchTermDisplay.textContent = catNames;
            } else {
                searchTermDisplay.textContent = 'recommended products';
            }
        }

        if (!searchTerm) {
            if (hasCategoryFilter) {
                // If filtering by category without search term, use all products as base
                searchResults = [...allProducts];
            } else {
                // Show recommended products - top rated and best sellers
                searchResults = getRecommendedProducts();
            }
            applyFilters();
        } else {
            // Use async function for search
            performAsyncSearch(searchTerm);
        }
    }

    async function performAsyncSearch(searchTerm) {
        if (window.DataManager) {
            try {
                let results = await DataManager.searchProducts(searchTerm);
                results = Array.isArray(results) ? results : [];

                if (results.length === 0) {
                    // Fallback to popular products if no results found
                    results = getRecommendedProducts().map(p => ({ ...p, isRecommendation: true }));
                    
                    const searchTermDisplay = document.getElementById('searchTerm');
                    if (searchTermDisplay) {
                        searchTermDisplay.innerHTML = `${searchTerm} <span style="font-size: 0.8rem; color: #666; font-weight: normal;">(0 results - showing popular items)</span>`;
                    }
                }

                searchResults = results;
                applyFilters();
            } catch (error) {
                console.error('Search error:', error);
                searchResults = [];
                applyFilters();
            }
        }
    }

    function getRecommendedProducts() {
        // Get top-rated and best-selling products as recommendations
        const recommended = [...allProducts]
            .filter(p => p.rating >= 4) // Products with 4+ rating
            .sort(() => Math.random() - 0.5) // Randomize to show different high-rated products
            .slice(0, 20); // Get top 20 recommended products

        return recommended.length > 0 ? recommended : allProducts.slice(0, 20);
    }

    function renderCategoryFilters(selectedCategory) {
        const container = document.getElementById('categoryFilters');
        if (!container) return;

        // Get unique categories and counts
        const categories = {};
        allProducts.forEach(p => {
            const cat = p.category;
            categories[cat] = (categories[cat] || 0) + 1;
        });

        let html = '<h3>Category</h3>';
        Object.keys(categories).sort().forEach(cat => {
            const isChecked = selectedCategory && cat.toLowerCase() === selectedCategory.toLowerCase();
            html += `
                <div class="filter-option">
                    <input type="checkbox" id="cat-${cat}" name="category" value="${cat}" ${isChecked ? 'checked' : ''}>
                    <label for="cat-${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)} (${categories[cat]})</label>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    function applyFilters() {
        let filtered = [...(searchResults || [])];

        // Category filters
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
            .map(cb => cb.value);

        if (selectedCategories.length > 0) {
            filtered = filtered.filter(product => selectedCategories.includes(product.category));
        }

        // Price range
        const minPrice = parseFloat(document.getElementById('minPrice')?.value) || 0;
        const maxPrice = parseFloat(document.getElementById('maxPrice')?.value) || 999999;

        filtered = filtered.filter(product => product.price >= minPrice && product.price <= maxPrice);

        // Price range checkboxes
        const selectedPriceRanges = Array.from(document.querySelectorAll('input[name="priceRange"]:checked'))
            .map(cb => cb.value);

        if (selectedPriceRanges.length > 0) {
            filtered = filtered.filter(product => {
                return selectedPriceRanges.some(range => {
                    switch (range) {
                        case 'under50': return product.price < 50;
                        case '50-100': return product.price >= 50 && product.price <= 100;
                        case '100-200': return product.price >= 100 && product.price <= 200;
                        case 'over200': return product.price > 200;
                        default: return true;
                    }
                });
            });
        }

        // Rating filters
        const selectedRatings = Array.from(document.querySelectorAll('input[name="rating"]:checked'))
            .map(cb => parseFloat(cb.value));

        if (selectedRatings.length > 0) {
            const minRating = Math.min(...selectedRatings);
            filtered = filtered.filter(product => product.rating >= minRating);
        }

        currentProducts = filtered;
        sortProducts();
        updateResultsCount();
    }

    function sortProducts() {
        const sortValue = document.getElementById('sortSelect')?.value;

        switch (sortValue) {
            case 'price-low':
                currentProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                currentProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                currentProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                currentProducts.sort((a, b) => b.isNew - a.isNew);
                break;
            case 'bestseller':
                currentProducts.sort((a, b) => b.ratingCount - a.ratingCount);
                break;
            default:
                // Keep current order for relevance
                break;
        }

        renderProducts();
    }

    function renderProducts() {
        const grid = document.getElementById('productsGrid');

        if (!grid) return;

        if (currentProducts.length === 0) {
            grid.innerHTML = `
                <div class="no-results" style="text-align: center; padding: 4rem; grid-column: 1 / -1;">
                    <div style="font-size: 60px; margin-bottom: 1rem;">🔍</div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #333;">No products found</h3>
                    <p style="color: #666;">Try adjusting your filters or search terms</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = currentProducts.map(product => {
            const hasRealImage = product.image && !product.image.match(/[\u{1F300}-\u{1F9FF}]/u);
            const imageHTML = hasRealImage
                ? `<img src="${product.image}" alt="${product.name}" loading="lazy">`
                : `<div class="product-image-placeholder" data-category="${product.category}">${product.image || '📦'}</div>`;

            const discount = product.oldPrice ?
                Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

            const stars = '⭐'.repeat(Math.floor(product.rating));

            return `
                <div class="product-card">
                    <div class="product-image">
                        ${imageHTML}
                        ${product.isRecommendation 
                            ? `<div class="product-badge" style="background: #667eea;">Related</div>` 
                            : (product.badge ? `<div class="product-badge ${product.badge.toLowerCase()}">${product.badge}</div>` : '')}
                        <button class="product-wishlist" onclick="toggleWishlist(${product.id})">🤍</button>
                    </div>
                    <div class="product-info">
                        <div class="product-details">
                            <h3 class="product-title">${product.name}</h3>
                            <div class="product-rating">
                                <span class="stars">${stars}</span>
                                <span class="rating-count">(${product.ratingCount})</span>
                            </div>
                            <div class="product-price">
                                <span class="current-price">$${product.price.toFixed(2)}</span>
                                ${product.oldPrice ? `<span class="original-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                                ${discount > 0 ? `<span class="discount-percent">${discount}% off</span>` : ''}
                            </div>
                            <p class="product-description">${product.description}</p>
                        </div>
                        <div class="product-actions">
                            <button class="add-to-cart" onclick="addToCart(${product.id}, this)">Add to Cart</button>
                            <button class="quick-view" onclick="quickView(${product.id})">Quick View</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function setViewMode(mode) {
        isGridView = mode === 'grid';

        const gridViewBtn = document.getElementById('gridView');
        const listViewBtn = document.getElementById('listView');
        const productsGrid = document.getElementById('productsGrid');

        if (gridViewBtn && listViewBtn && productsGrid) {
            gridViewBtn.classList.toggle('active', isGridView);
            listViewBtn.classList.toggle('active', !isGridView);
            productsGrid.classList.toggle('list-view', !isGridView);
        }
    }

    function updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = currentProducts.length;
        }
    }

    function clearAllFilters() {
        // Uncheck all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });

        // Clear price inputs
        const minPrice = document.getElementById('minPrice');
        const maxPrice = document.getElementById('maxPrice');
        if (minPrice) minPrice.value = '';
        if (maxPrice) maxPrice.value = '';

        // Clear search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
            const clearBtn = searchInput.parentElement.querySelector('.clear-search-btn');
            if (clearBtn) clearBtn.style.display = 'none';
        }

        const searchTerm = document.getElementById('searchTerm');
        if (searchTerm) searchTerm.textContent = 'all products';

        // Reset to all products
        searchResults = [...allProducts];

        // Reset sort
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) sortSelect.value = 'relevance';

        applyFilters();
    }

    // Global functions
    window.toggleWishlist = async function (productId) {
        if (window.DataManager && window.Notifications) {
            const product = await DataManager.getProductById(productId);
            const isInWishlist = await DataManager.isInWishlist(productId);

            await DataManager.toggleWishlist(productId);

            if (window.NavbarSync) {
                await NavbarSync.updateWishlistCount();
            }

            if (isInWishlist) {
                Notifications.info(`${product.name} removed from wishlist`);
            } else {
                Notifications.success(`${product.name} added to wishlist!`);
            }

            renderProducts(); // Re-render to update wishlist button
        }
    };

    window.addToCart = async function (productId, btnElement) {
        // Handle button reference if not passed
        if (!btnElement && window.event && window.event.target) {
            btnElement = window.event.target.closest('button');
        }

        const originalText = btnElement ? btnElement.innerHTML : '';
        if (btnElement) {
            btnElement.disabled = true;
            btnElement.innerHTML = 'Adding...';
            btnElement.style.cursor = 'wait';
        }

        try {
            if (window.DataManager) {
                // Initialize notifications if available
                if (window.Notifications && window.Notifications.init) {
                    window.Notifications.init();
                }

                const result = await DataManager.addToCart(productId);

                if (result && result.length >= 0) {
                    const product = await DataManager.getProductById(productId);

                    if (window.NavbarSync) {
                        await NavbarSync.updateCartCount();
                    }

                    if (window.Notifications) {
                        Notifications.success(`${product.name} added to cart!`);
                    }
                    console.log('Item added to cart:', product.name);
                } else {
                    if (window.Notifications) {
                        Notifications.error('Failed to add item to cart');
                    }
                }
            } else {
                console.error('DataManager not available');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            if (window.Notifications) {
                Notifications.error('Error adding item to cart');
            }
        } finally {
            if (btnElement) {
                btnElement.disabled = false;
                btnElement.innerHTML = originalText;
                btnElement.style.cursor = '';
            }
        }
    };

    // Quick View Modal Styles
    const modalStyle = document.createElement('style');
    modalStyle.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            backdrop-filter: blur(5px);
        }
        .modal-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        .quick-view-modal {
            background: white;
            width: 90%;
            max-width: 800px;
            border-radius: 12px;
            overflow: hidden;
            display: flex;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            transform: scale(0.9);
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .modal-overlay.active .quick-view-modal {
            transform: scale(1);
        }
        .modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: white;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            color: #333;
            z-index: 10;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-image {
            flex: 1;
            background: #f8f9fa;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
            position: relative;
        }
        .modal-image img {
            max-width: 100%;
            max-height: 300px;
            object-fit: contain;
            filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));
        }
        .modal-content {
            flex: 1;
            padding: 40px;
            display: flex;
            flex-direction: column;
        }
        .modal-category {
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #888;
            margin-bottom: 8px;
        }
        .modal-title {
            font-size: 1.8rem;
            margin-bottom: 10px;
            color: #333;
            line-height: 1.2;
        }
        .modal-price {
            font-size: 1.5rem;
            color: #667eea;
            font-weight: 700;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .modal-old-price {
            font-size: 1rem;
            color: #999;
            text-decoration: line-through;
            font-weight: normal;
        }
        .modal-description {
            color: #666;
            line-height: 1.6;
            margin-bottom: 25px;
            flex-grow: 1;
        }
        .modal-actions {
            margin-top: auto;
            display: flex;
            gap: 10px;
        }
        .modal-btn {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .modal-btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .modal-btn-secondary {
            background: #f0f0f0;
            color: #333;
        }
        .modal-btn:hover {
            transform: translateY(-2px);
        }
        @media (max-width: 768px) {
            .quick-view-modal {
                flex-direction: column;
                max-height: 90vh;
                overflow-y: auto;
            }
            .modal-image {
                padding: 20px;
                min-height: 200px;
            }
            .modal-content {
                padding: 20px;
            }
        }
    `;
    document.head.appendChild(modalStyle);

    window.quickView = async function (productId) {
        try {
            const product = await DataManager.getProductById(productId);
            
            // Remove existing modal if any
            const existingModal = document.getElementById('quickViewModal');
            if (existingModal) existingModal.remove();

            const hasRealImage = product.image && !product.image.match(/[\u{1F300}-\u{1F9FF}]/u);
            const imageHTML = hasRealImage
                ? `<img src="${product.image}" alt="${product.name}">`
                : `<div style="font-size: 80px;">${product.image || '📦'}</div>`;

            const stars = '⭐'.repeat(Math.floor(product.rating));
            
            const modalHTML = `
                <div class="modal-overlay" id="quickViewModal">
                    <div class="quick-view-modal">
                        <button class="modal-close" onclick="closeQuickView()">&times;</button>
                        <div class="modal-image">
                            ${imageHTML}
                        </div>
                        <div class="modal-content">
                            <div class="modal-category">${product.category}</div>
                            <h2 class="modal-title">${product.name}</h2>
                            <div class="product-rating" style="margin-bottom: 15px;">
                                <span class="stars">${stars}</span>
                                <span class="rating-count" style="color: #888; font-size: 0.9rem;">(${product.ratingCount} reviews)</span>
                            </div>
                            <div class="modal-price">
                                $${product.price.toFixed(2)}
                                ${product.oldPrice ? `<span class="modal-old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                            </div>
                            <p class="modal-description">${product.description}</p>
                            <div class="modal-actions">
                                <button class="modal-btn modal-btn-primary" onclick="addToCart(${product.id}, this)">Add to Cart</button>
                                <button class="modal-btn modal-btn-secondary" onclick="toggleWishlist(${product.id})">Add to Wishlist</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Trigger reflow
            const modal = document.getElementById('quickViewModal');
            modal.offsetHeight;
            modal.classList.add('active');

            // Close on click outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeQuickView();
            });

        } catch (error) {
            console.error('Error opening quick view:', error);
            if (window.Notifications) {
                Notifications.error('Could not load product details');
            }
        }
    };

    window.closeQuickView = function() {
        const modal = document.getElementById('quickViewModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    };

    console.log('Search page loaded successfully!');
})();