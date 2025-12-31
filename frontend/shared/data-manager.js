// ShopVibe Data Manager - Centralized data management with API
// Handles products, cart, wishlist, and orders

const DataManager = (function () {
    'use strict';

    const API_URL = 'http://localhost:3000/api';

    // Product methods
    async function getAllProducts() {
        const response = await fetch(`${API_URL}/products`);
        return await response.json();
    }

    async function getProductById(id) {
        const response = await fetch(`${API_URL}/products/${id}`);
        return await response.json();
    }

    async function searchProducts(query) {
        const products = await getAllProducts();
        const lowerQuery = query.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery)
        );
    }

    // Cart methods
    async function getCart() {
        const response = await fetch(`${API_URL}/cart`);
        return await response.json();
    }

    async function addToCart(productId, quantity = 1) {
        const response = await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity }),
        });
        return await response.json();
    }

    async function removeFromCart(productId) {
        await fetch(`${API_URL}/cart/${productId}`, { method: 'DELETE' });
    }

    async function updateCartQuantity(productId, quantity) {
        // Since the API doesn't have an update endpoint, we remove and re-add
        await removeFromCart(productId);
        if (quantity > 0) {
            await addToCart(productId, quantity);
        }
    }

    async function getCartItems() {
        const cart = await getCart();
        const products = await Promise.all(cart.map(item => getProductById(item.product.id)));
        return cart.map((item, index) => ({
            ...products[index],
            quantity: item.quantity,
        }));
    }

    async function getCartCount() {
        const cart = await getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    }

    async function getCartTotal() {
        const items = await getCartItems();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    // Wishlist methods
    async function getWishlist() {
        const response = await fetch(`${API_URL}/wishlist`);
        return await response.json();
    }

    async function toggleWishlist(productId) {
        const wishlist = await getWishlist();
        if (wishlist.find(p => p.id === productId)) {
            await fetch(`${API_URL}/wishlist/${productId}`, { method: 'DELETE' });
        } else {
            await fetch(`${API_URL}/wishlist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId }),
            });
        }
    }

    async function isInWishlist(productId) {
        const wishlist = await getWishlist();
        return !!wishlist.find(p => p.id === productId);
    }

    async function getWishlistCount() {
        const wishlist = await getWishlist();
        return wishlist.length;
    }

    async function getWishlistItems() {
        return await getWishlist();
    }

    // Order methods
    async function createOrder(orderData) {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });
        return await response.json();
    }

    async function getOrders() {
        const response = await fetch(`${API_URL}/orders`);
        return await response.json();
    }

    // Public API
    return {
        getAllProducts,
        getProductById,
        searchProducts,
        getCart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        getCartItems,
        getCartCount,
        getCartTotal,
        getWishlist,
        toggleWishlist,
        isInWishlist,
        getWishlistCount,
        getWishlistItems,
        createOrder,
        getOrders,
    };
})();

// Make it available globally
window.DataManager = DataManager;
