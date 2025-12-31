// Checkout Page - Using DataManager for order processing
// Handles checkout form, order summary, and order creation

(function () {
    'use strict';

    let cartItems = [];
    let orderTotals = {};

    // Initialize checkout on page load
    document.addEventListener('DOMContentLoaded', function () {
        if (window.DataManager) {
            loadOrderSummary();
            setupFormValidation();
        } else {
            console.error('DataManager not loaded');
        }
    });

    function loadOrderSummary() {
        cartItems = DataManager.getCartItems();

        if (cartItems.length === 0) {
            if (window.Notifications) {
                Notifications.warning('Your cart is empty!');
            }
            setTimeout(() => {
                window.location.href = '../products/products.html';
            }, 2000);
            return;
        }

        renderOrderItems();
        calculateTotals();
    }

    function renderOrderItems() {
        const orderItemsContainer = document.getElementById('orderItems');

        orderItemsContainer.innerHTML = cartItems.map(item => {
            const hasRealImage = item.image && !item.image.match(/[\u{1F300}-\u{1F9FF}]/u);
            const imageHTML = hasRealImage
                ? `<img src="${item.image}" alt="${item.name}" class="item-image">`
                : `<div class="item-image" style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; font-size: 30px; border-radius: 8px;">${item.image || '📦'}</div>`;

            return `
                <div class="order-item">
                    ${imageHTML}
                    <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        <div class="item-quantity">Qty: ${item.quantity}</div>
                    </div>
                    <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `;
        }).join('');
    }

    function calculateTotals() {
        const subtotal = DataManager.getCartTotal();
        const shipping = 9.99;
        const tax = subtotal * 0.085;
        const total = subtotal + shipping + tax;

        orderTotals = { subtotal, shipping, tax, total };

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;

        // Update button text
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        if (placeOrderBtn) {
            placeOrderBtn.textContent = `Place Order - $${total.toFixed(2)}`;
        }
    }

    function setupFormValidation() {
        const form = document.getElementById('checkoutForm');

        form.addEventListener('submit', function (e) {
            e.preventDefault();
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function () {
                validateField(this);
            });
        });
    }

    function validateField(field) {
        if (field.hasAttribute('required') && !field.value.trim()) {
            field.style.borderColor = '#ff4757';
            return false;
        }

        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                field.style.borderColor = '#ff4757';
                return false;
            }
        }

        if (field.type === 'tel' && field.value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(field.value)) {
                field.style.borderColor = '#ff4757';
                return false;
            }
        }

        field.style.borderColor = '#2ed573';
        return true;
    }

    function validateForm() {
        const form = document.getElementById('checkoutForm');
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    window.placeOrder = function () {
        if (!validateForm()) {
            if (window.Notifications) {
                Notifications.error('Please fill in all required fields correctly');
            }
            return;
        }

        const form = document.getElementById('checkoutForm');
        const formData = new FormData(form);

        const shippingInfo = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            zipCode: formData.get('zipCode'),
            country: formData.get('country'),
            notes: formData.get('notes')
        };

        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

        // Create order
        const order = DataManager.createOrder({
            shipping: shippingInfo,
            payment: paymentMethod
        });

        // Save order ID to sessionStorage for order confirmation page
        sessionStorage.setItem('lastOrderId', order.id);

        // Update navbar
        if (window.NavbarSync) {
            NavbarSync.updateCartCount();
        }

        // Show success message
        if (window.Notifications) {
            Notifications.success('Order placed successfully!');
        }

        // Redirect to order confirmation
        setTimeout(() => {
            window.location.href = '../order confirmation/order-confirmation.html';
        }, 1000);
    };

    // Payment method selection
    document.addEventListener('DOMContentLoaded', function () {
        const paymentMethods = document.querySelectorAll('.payment-method');

        paymentMethods.forEach(method => {
            method.addEventListener('click', function () {
                paymentMethods.forEach(m => m.classList.remove('selected'));
                this.classList.add('selected');
                this.querySelector('input[type="radio"]').checked = true;
            });
        });
    });

    console.log('Checkout page loaded successfully!');
})();