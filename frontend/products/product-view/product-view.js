
        // Global variables
        let cartCount = 3;
        let currentQuantity = 1;
        let selectedSize = 'M';
        let selectedColor = 'red';
        let isInWishlist = false;

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            initializePage();
        });

        function initializePage() {
            setupEventListeners();
            updateCartDisplay();
            animateElements();
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

            // Quantity input validation
            document.getElementById('quantity').addEventListener('input', function() {
                let value = parseInt(this.value);
                if (isNaN(value) || value < 1) {
                    this.value = 1;
                    currentQuantity = 1;
                } else if (value > 10) {
                    this.value = 10;
                    currentQuantity = 10;
                } else {
                    currentQuantity = value;
                }
            });
        }

        // Image functionality
        function changeMainImage(emoji, thumbnail) {
            const mainImage = document.getElementById('mainImage');
            const lightboxImage = document.getElementById('lightboxImage');
            
            // Update main image
            mainImage.textContent = emoji;
            lightboxImage.textContent = emoji;
            
            // Update thumbnail active state
            document.querySelectorAll('.thumbnail').forEach(thumb => {
                thumb.classList.remove('active');
            });
            thumbnail.classList.add('active');
            
            // Add animation
            mainImage.style.animation = 'none';
            mainImage.offsetHeight; // Trigger reflow
            mainImage.style.animation = 'fadeIn 0.3s ease';
        }

        function openLightbox() {
            const lightbox = document.getElementById('lightbox');
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            const lightbox = document.getElementById('lightbox');
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        // Product options
        function selectSize(sizeElement) {
            // Remove active class from all size options
            document.querySelectorAll('.size-option').forEach(option => {
                option.classList.remove('active');
            });
            
            // Add active class to selected size
            sizeElement.classList.add('active');
            selectedSize = sizeElement.textContent;
            
            showNotification(`Size ${selectedSize} selected`, 'info');
        }

        function selectColor(colorElement) {
            // Remove active class from all color options
            document.querySelectorAll('.color-option').forEach(option => {
                option.classList.remove('active');
            });
            
            // Add active class to selected color
            colorElement.classList.add('active');
            selectedColor = colorElement.title.toLowerCase();
            
            showNotification(`${colorElement.title} color selected`, 'info');
        }

        // Quantity controls
        function changeQuantity(change) {
            const quantityInput = document.getElementById('quantity');
            let newQuantity = currentQuantity + change;
            
            if (newQuantity >= 1 && newQuantity <= 10) {
                currentQuantity = newQuantity;
                quantityInput.value = currentQuantity;
            }
        }

        function updateQuantity() {
            const quantityInput = document.getElementById('quantity');
            currentQuantity = parseInt(quantityInput.value) || 1;
        }

        // Product actions
        function addToCart() {
            cartCount += currentQuantity;
            updateCartDisplay();
            
            // Create detailed message
            const message = `Added ${currentQuantity} × Premium Cotton T-Shirt (${selectedSize}, ${selectedColor}) to cart!`;
            showNotification(message, 'success');
            
            // Add cart animation
            const cartIcon = document.getElementById('cartCount').parentElement;
            cartIcon.style.animation = 'bounce 0.6s ease';
            
            setTimeout(() => {
                cartIcon.style.animation = '';
            }, 600);
            
            // Add ripple effect to button
            addRippleEffect(event.target);
        }

        function buyNow() {
            const message = `Proceeding to checkout for ${currentQuantity} × Premium Cotton T-Shirt (${selectedSize}, ${selectedColor})`;
            showNotification(message, 'info');
            
            // Add ripple effect
            addRippleEffect(event.target);
            
            // Here you would redirect to checkout
            setTimeout(() => {
                showNotification('Redirecting to checkout...', 'info');
            }, 1000);
        }

        function toggleWishlist() {
            const wishlistBtn = document.getElementById('wishlistBtn');
            isInWishlist = !isInWishlist;
            
            if (isInWishlist) {
                wishlistBtn.textContent = '❤️';
                wishlistBtn.classList.add('active');
                showNotification('Added to wishlist!', 'success');
            } else {
                wishlistBtn.textContent = '🤍';
                wishlistBtn.classList.remove('active');
                showNotification('Removed from wishlist', 'info');
            }
            
            // Add animation
            wishlistBtn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                wishlistBtn.style.transform = 'scale(1)';
            }, 200);
        }

        // Related products
        function viewProduct(productId) {
            const products = {
                1: 'Wireless Headphones',
                2: 'Running Shoes',
                3: 'Smart Watch',
                4: 'Designer Jeans'
            };
            
            showNotification(`Viewing ${products[productId]}...`, 'info');
            
            // Here you would navigate to the product page
            setTimeout(() => {
                showNotification('Loading product details...', 'info');
            }, 500);
        }

        // Utility functions
        function updateCartDisplay() {
            document.getElementById('cartCount').textContent = cartCount;
        }

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
            
            // Auto-remove after 4 seconds
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 4000);
        }

        function addRippleEffect(button) {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        }

        function animateElements() {
            // Add loading animation to main elements
            const elements = [
                '.product-images',
                '.product-details',
                '.related-products'
            ];
            
            elements.forEach((selector, index) => {
                const element = document.querySelector(selector);
                if (element) {
                    element.classList.add('loading');
                    element.style.animationDelay = `${index * 0.2}s`;
                }
            });
        }

        // Add bounce animation styles
        const bounceStyle = document.createElement('style');
        bounceStyle.textContent = `
            @keyframes bounce {
                0%, 20%, 53%, 80%, 100% {
                    transform: translate3d(0,0,0);
                }
                40%, 43% {
                    transform: translate3d(0,-15px,0);
                }
                70% {
                    transform: translate3d(0,-7px,0);
                }
                90% {
                    transform: translate3d(0,-3px,0);
                }
            }
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(bounceStyle);

        // Smooth scroll for anchor links
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

        // Enhanced keyboard navigation
        document.addEventListener('keydown', function(e) {
            // Escape key to close lightbox
            if (e.key === 'Escape') {
                closeLightbox();
            }
            
            // Arrow keys for thumbnail navigation
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                const thumbnails = document.querySelectorAll('.thumbnail');
                const activeThumbnail = document.querySelector('.thumbnail.active');
                const currentIndex = Array.from(thumbnails).indexOf(activeThumbnail);
                
                let newIndex;
                if (e.key === 'ArrowLeft') {
                    newIndex = currentIndex > 0 ? currentIndex - 1 : thumbnails.length - 1;
                } else {
                    newIndex = currentIndex < thumbnails.length - 1 ? currentIndex + 1 : 0;
                }
                
                thumbnails[newIndex].click();
            }
            
            // Plus/minus keys for quantity
            if (e.key === '+' || e.key === '=') {
                changeQuantity(1);
            } else if (e.key === '-') {
                changeQuantity(-1);
            }
        });

        // Product image zoom on hover (desktop only)
        if (window.innerWidth > 768) {
            const mainImage = document.getElementById('mainImage');
            let isZoomed = false;
            
            mainImage.addEventListener('mouseenter', function() {
                if (!isZoomed) {
                    this.style.transform = 'scale(1.1)';
                    this.style.cursor = 'zoom-in';
                }
            });
            
            mainImage.addEventListener('mouseleave', function() {
                if (!isZoomed) {
                    this.style.transform = 'scale(1)';
                }
            });
        }

        // Performance optimization: Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe related products for scroll animations
        setTimeout(() => {
            document.querySelectorAll('.related-product').forEach(product => {
                product.style.opacity = '0';
                product.style.transform = 'translateY(30px)';
                product.style.transition = 'all 0.6s ease';
                observer.observe(product);
            });
        }, 500);

        // Auto-save viewed product (for recently viewed functionality)
        function saveToRecentlyViewed() {
            const product = {
                id: 'premium-cotton-tshirt',
                name: 'Premium Cotton T-Shirt',
                price: 24.99,
                image: '👕',
                timestamp: Date.now()
            };
            
            try {
                let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
                
                // Remove if already exists
                recentlyViewed = recentlyViewed.filter(item => item.id !== product.id);
                
                // Add to beginning
                recentlyViewed.unshift(product);
                
                // Keep only last 10 items
                recentlyViewed = recentlyViewed.slice(0, 10);
                
                localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
            } catch (e) {
                console.log('Could not save to recently viewed');
            }
        }

        // Save on page load
        setTimeout(saveToRecentlyViewed, 2000);

        // Add touch support for mobile image swiping
        let touchStartX = 0;
        let touchEndX = 0;

        document.getElementById('mainImage').addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        document.getElementById('mainImage').addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleImageSwipe();
        }, { passive: true });

        function handleImageSwipe() {
            const swipeThreshold = 50;
            const difference = touchStartX - touchEndX;
            
            if (Math.abs(difference) > swipeThreshold) {
                const thumbnails = document.querySelectorAll('.thumbnail');
                const activeThumbnail = document.querySelector('.thumbnail.active');
                const currentIndex = Array.from(thumbnails).indexOf(activeThumbnail);
                
                let newIndex;
                if (difference > 0) {
                    // Swiped left - next image
                    newIndex = currentIndex < thumbnails.length - 1 ? currentIndex + 1 : 0;
                } else {
                    // Swiped right - previous image
                    newIndex = currentIndex > 0 ? currentIndex - 1 : thumbnails.length - 1;
                }
                
                thumbnails[newIndex].click();
            }
        }

        console.log('ShopVibe Product View Page Loaded Successfully! 👕');
    