
        // Category data
        const categories = [
            {
                id: 'fashion',
                title: 'Fashion & Clothing',
                image: '👕',
                description: 'Discover the latest trends in fashion with our curated collection of clothing, shoes, and accessories for men, women, and kids.',
                productCount: 245,
                badge: 'Trending',
                featured: true
            },
            {
                id: 'electronics',
                title: 'Electronics & Gadgets',
                image: '📱',
                description: 'Stay ahead with cutting-edge technology. From smartphones to smart home devices, find all your electronic needs here.',
                productCount: 189,
                badge: 'New Arrivals',
                featured: true
            },
            {
                id: 'home',
                title: 'Home & Living',
                image: '🏠',
                description: 'Transform your living space with our premium home decor, furniture, and kitchen essentials for a perfect home.',
                productCount: 156,
                badge: 'Best Sellers',
                featured: false
            },
            {
                id: 'beauty',
                title: 'Beauty & Personal Care',
                image: '💄',
                description: 'Enhance your natural beauty with our extensive range of skincare, makeup, and personal care products.',
                productCount: 132,
                badge: 'Premium',
                featured: true
            },
            {
                id: 'sports',
                title: 'Sports & Fitness',
                image: '⚽',
                description: 'Achieve your fitness goals with our high-quality sports equipment, activewear, and wellness products.',
                productCount: 98,
                badge: 'Active',
                featured: false
            },
            {
                id: 'books',
                title: 'Books & Education',
                image: '📚',
                description: 'Expand your knowledge with our vast collection of books, educational materials, and learning resources.',
                productCount: 87,
                badge: 'Knowledge',
                featured: false
            },
            {
                id: 'automotive',
                title: 'Automotive & Tools',
                image: '🚗',
                description: 'Keep your vehicle running smoothly with our automotive parts, accessories, and professional-grade tools.',
                productCount: 76,
                badge: 'Professional',
                featured: false
            },
            {
                id: 'toys',
                title: 'Toys & Games',
                image: '🎮',
                description: 'Bring joy and fun with our exciting collection of toys, games, and educational play items for all ages.',
                productCount: 64,
                badge: 'Fun',
                featured: false
            }
        ];

        // Global variables
        let cartCount = 3;
        let filteredCategories = [...categories];

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            initializePage();
        });

        function initializePage() {
            renderCategories();
            setupEventListeners();
            setupScrollAnimations();
            animateHeroStats();
        }

        function setupEventListeners() {
            // Mobile menu toggle
            window.toggleMenu = function() {
                const navMenu = document.querySelector('.nav-menu');
                navMenu.classList.toggle('active');
            };

            // Scroll to top functionality
            window.addEventListener('scroll', function() {
                const scrollTop = document.getElementById('scrollTop');
                if (window.pageYOffset > 300) {
                    scrollTop.classList.add('visible');
                } else {
                    scrollTop.classList.remove('visible');
                }
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', function(event) {
                const navMenu = document.querySelector('.nav-menu');
                const menuToggle = document.querySelector('.menu-toggle');
                const navbar = document.querySelector('.navbar');
                
                if (!navbar.contains(event.target)) {
                    navMenu.classList.remove('active');
                }
            });

            // Search input focus/blur events
            const searchInput = document.querySelector('.search-input');
            const searchSuggestions = document.getElementById('searchSuggestions');

            searchInput.addEventListener('focus', function() {
                if (this.value.length > 0) {
                    searchSuggestions.style.display = 'block';
                }
            });

            searchInput.addEventListener('blur', function() {
                setTimeout(() => {
                    searchSuggestions.style.display = 'none';
                }, 200);
            });
        }

        // Render categories
        function renderCategories() {
            const grid = document.getElementById('categoriesGrid');
            grid.innerHTML = '';

            filteredCategories.forEach((category, index) => {
                const categoryCard = createCategoryCard(category, index);
                grid.appendChild(categoryCard);
            });

            // Add stagger animation
            setTimeout(() => {
                document.querySelectorAll('.category-card').forEach((card, index) => {
                    card.style.animationDelay = `${index * 0.1}s`;
                    card.classList.add('animate');
                });
            }, 100);
        }

        function createCategoryCard(category, index) {
            const card = document.createElement('div');
            card.className = 'category-card animate-on-scroll';
            card.setAttribute('data-category', category.id);
            card.style.animationDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <div class="category-image">
                    ${category.image}
                    <div class="category-overlay">
                        <div class="category-badge">${category.badge}</div>
                    </div>
                </div>
                <div class="category-content">
                    <h3 class="category-title">${category.title}</h3>
                    <p class="category-description">${category.description}</p>
                    <div class="category-stats">
                        <span class="category-count">${category.productCount} products</span>
                        <span class="category-arrow">→</span>
                    </div>
                </div>
            `;

            // Add click event
            card.addEventListener('click', () => {
                navigateToCategory(category.id);
            });

            // Add hover effect
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });

            return card;
        }

        // Navigation functions
        function navigateToCategory(categoryId) {
            const category = categories.find(cat => cat.id === categoryId);
            showNotification(`Navigating to ${category.title}...`, 'success');
            
            // Add loading effect
            const targetCard = document.querySelector(`[data-category="${categoryId}"]`);
            if (targetCard) {
                targetCard.style.opacity = '0.7';
                targetCard.style.transform = 'scale(0.98)';
                
                setTimeout(() => {
                    targetCard.style.opacity = '1';
                    targetCard.style.transform = 'scale(1)';
                }, 500);
            }
            
            trackCategoryView(categoryId);

            // Here you would navigate to the category products page
            setTimeout(() => {
                showNotification(`Loading ${category.title} products...`, 'info');
            }, 800);
        }

        function selectCategory(categoryId) {
            const searchInput = document.querySelector('.search-input');
            const category = categories.find(cat => cat.id === categoryId);
            
            if (category) {
                searchInput.value = category.title;
                navigateToCategory(categoryId);
            }
            
            hideSuggestions();
        }

        // Search functionality
        function handleSearch(query) {
            const suggestions = document.getElementById('searchSuggestions');
            
            if (query.length === 0) {
                suggestions.style.display = 'none';
                filteredCategories = [...categories];
                renderCategories();
                return;
            }

            // Filter categories based on search
            filteredCategories = categories.filter(category => 
                category.title.toLowerCase().includes(query.toLowerCase()) ||
                category.description.toLowerCase().includes(query.toLowerCase())
            );

            // Update suggestions
            updateSearchSuggestions(query);
            suggestions.style.display = 'block';

            // Re-render filtered categories
            renderCategories();

            trackSearch(query);

            // Show no results message if needed
            if (filteredCategories.length === 0) {
                showNoResults(query);
            }
        }

        function updateSearchSuggestions(query) {
            const suggestions = document.getElementById('searchSuggestions');
            const matchingCategories = categories.filter(category => 
                category.title.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 4);

            suggestions.innerHTML = matchingCategories.map(category => 
                `<div class="suggestion-item" onclick="selectCategory('${category.id}')">${category.title}</div>`
            ).join('');
        }

        function showSuggestions() {
            const input = document.querySelector('.search-input');
            const suggestions = document.getElementById('searchSuggestions');
            
            if (input.value.length > 0) {
                suggestions.style.display = 'block';
            }
        }

        function hideSuggestions() {
            const suggestions = document.getElementById('searchSuggestions');
            suggestions.style.display = 'none';
        }

        function showNoResults(query) {
            const grid = document.getElementById('categoriesGrid');
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.5;">🔍</div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #333;">No categories found</h3>
                    <p style="color: #666; font-size: 1rem;">No categories match "${query}". Try a different search term.</p>
                    <button onclick="clearSearch()" style="margin-top: 1.5rem; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 0.8rem 2rem; border-radius: 25px; cursor: pointer; font-weight: 600;">
                        Clear Search
                    </button>
                </div>
            `;
        }

        function clearSearch() {
            const searchInput = document.querySelector('.search-input');
            searchInput.value = '';
            filteredCategories = [...categories];
            renderCategories();
            hideSuggestions();
        }

        // Animation functions
        function setupScrollAnimations() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                observer.observe(el);
            });
        }

        function animateHeroStats() {
            const statNumbers = document.querySelectorAll('.stat-number');
            const targets = [8, 1000, 50];
            
            statNumbers.forEach((stat, index) => {
                animateNumber(stat, targets[index], 2000);
            });
        }

        function animateNumber(element, target, duration) {
            let start = 0;
            const increment = target / (duration / 16);
            
            function updateNumber() {
                start += increment;
                if (start < target) {
                    element.textContent = Math.floor(start) + (index === 1 ? '+' : '');
                    requestAnimationFrame(updateNumber);
                } else {
                    element.textContent = target + (target === 1000 ? '+' : target === 50 ? '+' : '');
                }
            }
            
            const index = Array.from(element.parentElement.parentElement.children).indexOf(element.parentElement);
            setTimeout(() => updateNumber(), index * 500);
        }

        // Utility functions
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        function showNotification(message, type = 'info') {
            // Remove existing notifications
            document.querySelectorAll('.notification').forEach(notif => notif.remove());
            
            // Create new notification
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <span>${message}</span>
                    <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Auto-remove after 3 seconds
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 3000);
        }

        // Featured card animations
        document.addEventListener('DOMContentLoaded', function() {
            const featuredCards = document.querySelectorAll('.featured-card');
            
            featuredCards.forEach((card, index) => {
                // Stagger animation
                card.style.animationDelay = `${index * 0.2}s`;
                
                // Add ripple effect on click
                card.addEventListener('click', function(e) {
                    const ripple = document.createElement('span');
                    const rect = this.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;
                    
                    ripple.style.cssText = `
                        position: absolute;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.3);
                        width: ${size}px;
                        height: ${size}px;
                        left: ${x}px;
                        top: ${y}px;
                        animation: ripple 0.8s linear;
                        pointer-events: none;
                    `;
                    
                    this.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 800);
                });
            });
        });

        // Add ripple animation styles
        const rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + F for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                document.querySelector('.search-input').focus();
            }
            
            // Escape key to clear search
            if (e.key === 'Escape') {
                const searchInput = document.querySelector('.search-input');
                if (searchInput.value) {
                    clearSearch();
                }
                searchInput.blur();
                hideSuggestions();
            }
        });

        // Performance optimization
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Re-calculate animations if needed
                setupScrollAnimations();
            }, 250);
        });

        // Lazy loading for category images (if using real images)
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const categoryImage = entry.target.querySelector('.category-image');
                    categoryImage.style.opacity = '1';
                    categoryImage.style.transform = 'scale(1)';
                    imageObserver.unobserve(entry.target);
                }
            });
        });

        // Enhanced mobile touch interactions
        if ('ontouchstart' in window) {
            document.querySelectorAll('.category-card').forEach(card => {
                card.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(0.98)';
                }, { passive: true });
                
                card.addEventListener('touchend', function() {
                    this.style.transform = 'scale(1)';
                }, { passive: true });
            });
        }

        // Analytics tracking (placeholder)
        function trackCategoryView(categoryId) {
            Analytics.trackEvent('Category Viewed', { categoryId: categoryId });
        }

        function trackSearch(query) {
            Analytics.trackEvent('Search Performed', { query: query });
        }

        // Auto-complete search suggestions
        const searchSuggestionsList = [
            'fashion', 'clothing', 'shoes', 'accessories',
            'electronics', 'smartphones', 'laptops', 'gadgets',
            'home', 'furniture', 'decor', 'kitchen',
            'beauty', 'skincare', 'makeup', 'personal care',
            'sports', 'fitness', 'outdoor', 'activewear',
            'books', 'education', 'learning', 'novels',
            'automotive', 'car accessories', 'tools',
            'toys', 'games', 'kids', 'children'
        ];

        // Enhanced search with fuzzy matching
        function fuzzySearch(query) {
            const results = searchSuggestionsList.filter(item => 
                item.toLowerCase().includes(query.toLowerCase()) ||
                query.toLowerCase().includes(item.toLowerCase())
            );
            return results.slice(0, 5);
        }

        // Add smooth scroll behavior for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        console.log('ShopVibe Category Page Loaded Successfully! 🛍️');
    