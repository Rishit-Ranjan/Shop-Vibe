// Navbar Synchronization - Keep cart and wishlist counts updated across all pages
// Listens to localStorage changes and updates navbar badges

const NavbarSync = (function () {
    'use strict';

    // Update cart count in navbar
    async function updateCartCount() {
        const count = window.DataManager ? await window.DataManager.getCartCount() : 0;
        const cartCountElements = document.querySelectorAll('.cart-count, #cartCount');

        cartCountElements.forEach(element => {
            element.textContent = count;

            // Hide badge if count is 0
            if (count === 0) {
                element.style.display = 'none';
            } else {
                element.style.display = 'flex';
            }
        });

        return count;
    }

    // Update wishlist count in navbar
    async function updateWishlistCount() {
        const count = window.DataManager ? await window.DataManager.getWishlistCount() : 0;
        const wishlistCountElements = document.querySelectorAll('.wishlist-count, #wishlistCount');

        wishlistCountElements.forEach(element => {
            element.textContent = count;

            // Hide badge if count is 0
            if (count === 0) {
                element.style.display = 'none';
            } else {
                element.style.display = 'flex';
            }
        });

        return count;
    }

    // Update all counts
    async function updateAllCounts() {
        await updateCartCount();
        await updateWishlistCount();
    }

    // Initialize - set up listeners and update counts
    function init() {
        // Update counts on page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', updateAllCounts);
        } else {
            updateAllCounts();
        }

        // Listen for storage changes (cross-tab sync)
        window.addEventListener('storage', function (e) {
            if (e.key === 'shopvibe_cart' || e.key === 'shopvibe_wishlist' || !e.key) {
                updateAllCounts();
            }
        });

        // Listen for custom events (same-tab updates)
        window.addEventListener('cartUpdated', () => updateCartCount());
        window.addEventListener('wishlistUpdated', () => updateWishlistCount());

        // Periodic sync (fallback)
        setInterval(() => updateAllCounts(), 5000);
    }

    // Trigger update events
    function triggerCartUpdate() {
        window.dispatchEvent(new Event('cartUpdated'));
    }

    function triggerWishlistUpdate() {
        window.dispatchEvent(new Event('wishlistUpdated'));
    }

    // Public API
    return {
        init,
        updateCartCount,
        updateWishlistCount,
        updateAllCounts,
        triggerCartUpdate,
        triggerWishlistUpdate
    };
})();

// Auto-initialize
NavbarSync.init();

// Make it available globally
window.NavbarSync = NavbarSync;
