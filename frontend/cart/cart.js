// Cart Page - Using DataManager for cart management
// Handles cart display, quantity updates, and checkout

(function () {
    'use strict';

    // Initialize cart on page load
    document.addEventListener('DOMContentLoaded', async function () {
        if (window.DataManager) {
            await renderCart();
        } else {
            console.error('DataManager not loaded');
        }
    });

    async function renderCart() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartSummary = document.getElementById('cartSummary');
        const itemCount = document.getElementById('itemCount');

        const cartItems = await DataManager.getCartItems();

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty">
                    <svg fill="currentColor" viewBox="0 0 24 24" style="width: 100px; height: 100px; color: #ccc;">
                        <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
                    </svg>
                    <h2>Your cart is empty</h2>
                    <p>Add some items to get started!</p>
                    <button onclick="window.location.href='../products/products.html'" style="margin-top: 20px; padding: 12px 24px; background: linear-gradient(45deg, #667eea, #764ba2); color: white; border: none; border-radius: 25px; cursor: pointer; font-size: 16px;">Browse Products</button>
                </div>
            `;
            cartSummary.style.display = 'none';
            itemCount.textContent = '0 items';
            return;
        }

        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        itemCount.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;

        cartItemsContainer.innerHTML = cartItems.map(item => {
            // Determine if we have a real image or need placeholder
            const hasRealImage = item.image && !item.image.match(/[\u{1F300}-\u{1F9FF}]/u);
            const imageHTML = hasRealImage
                ? `<img src="${item.image}" alt="${item.name}" class="item-image">`
                : `<div class="item-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; font-size: 40px;">${item.image || '📦'}</div>`;

            return `
                <div class="cart-item fade-in">
                    ${imageHTML}
                    <div class="item-details">
                        <h3 class="item-title">${item.name}</h3>
                        <p class="item-description">${item.description}</p>
                        <p class="item-price-single">$${item.price.toFixed(2)} each</p>
                    </div>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)" ${item.quantity <= 1 ? 'disabled' : ''}>
                            −
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">
                            +
                        </button>
                    </div>
                    <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="remove-btn" onclick="removeItem(${item.id})" title="Remove item">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                    </button>
                </div>
            `;
        }).join('');

        // Update totals
        const subtotal = await DataManager.getCartTotal();
        const shipping = cartItems.length > 0 ? 9.99 : 0;
        const tax = subtotal * 0.085;
        const total = subtotal + shipping + tax;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;

        cartSummary.style.display = 'block';
    }

    window.updateQuantity = async function (id, change) {
        const cartItems = await DataManager.getCartItems();
        const item = cartItems.find(item => item.id === id);

        if (item) {
            const newQuantity = item.quantity + change;
            if (DataManager.updateCartQuantity) {
                await DataManager.updateCartQuantity(id, newQuantity);
            }

            // Update navbar count
            if (window.NavbarSync) {
                await NavbarSync.updateCartCount();
            }

            await renderCart();
        }
    };

    window.removeItem = async function (id) {
        const product = await DataManager.getProductById(id);
        await DataManager.removeFromCart(id);

        // Update navbar count
        if (window.NavbarSync) {
            await NavbarSync.updateCartCount();
        }

        // Show notification
        if (window.Notifications && product) {
            window.Notifications.init();
            Notifications.info(`${product.name} removed from cart`);
        }

        await renderCart();
    };

    window.checkout = async function () {
        const cartItems = await DataManager.getCartItems();

        if (cartItems.length === 0) {
            if (window.Notifications) {
                window.Notifications.init();
                Notifications.warning('Your cart is empty!');
            }
            return;
        }

        // Navigate to checkout page
        window.location.href = '../checkout/checkout.html';
    };

    console.log('Cart page loaded successfully!');
})();