// Order Confirmation Page - Display order details from DataManager
// Shows order summary, tracking info, and next steps

(function () {
    'use strict';

    // Initialize order confirmation on page load
    document.addEventListener('DOMContentLoaded', function () {
        if (window.DataManager) {
            loadOrderDetails();
        } else {
            console.error('DataManager not loaded');
        }
    });

    function loadOrderDetails() {
        // Get last order ID from sessionStorage
        const orderId = sessionStorage.getItem('lastOrderId');

        if (!orderId) {
            // No order found, redirect to home
            if (window.Notifications) {
                Notifications.warning('No order found');
            }
            setTimeout(() => {
                window.location.href = '../home page/home.html';
            }, 2000);
            return;
        }

        const order = DataManager.getOrderById(orderId);

        if (!order) {
            if (window.Notifications) {
                Notifications.error('Order not found');
            }
            setTimeout(() => {
                window.location.href = '../home page/home.html';
            }, 2000);
            return;
        }

        renderOrderConfirmation(order);
    }

    function renderOrderConfirmation(order) {
        // Update order number
        const orderNumberElements = document.querySelectorAll('.order-number, #orderNumber');
        orderNumberElements.forEach(el => {
            el.textContent = order.id;
        });

        // Update order date
        const orderDate = new Date(order.createdAt);
        const orderDateElements = document.querySelectorAll('.order-date, #orderDate');
        orderDateElements.forEach(el => {
            el.textContent = orderDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        });

        // Render order items
        const orderItemsContainer = document.getElementById('orderItems');
        if (orderItemsContainer && order.items) {
            orderItemsContainer.innerHTML = order.items.map(item => {
                const hasRealImage = item.image && !item.image.match(/[\u{1F300}-\u{1F9FF}]/u);
                const imageHTML = hasRealImage
                    ? `<img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">`
                    : `<div style="width: 60px; height: 60px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; font-size: 24px; border-radius: 8px;">${item.image || '📦'}</div>`;

                return `
                    <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: #f8f9fa; border-radius: 10px; margin-bottom: 10px;">
                        ${imageHTML}
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: #333;">${item.name}</div>
                            <div style="color: #666; font-size: 14px;">Quantity: ${item.quantity}</div>
                        </div>
                        <div style="font-weight: 600; color: #667eea;">$${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                `;
            }).join('');
        }

        // Update totals
        const subtotalEl = document.getElementById('orderSubtotal');
        const shippingEl = document.getElementById('orderShipping');
        const taxEl = document.getElementById('orderTax');
        const totalEl = document.getElementById('orderTotal');

        if (subtotalEl) subtotalEl.textContent = `$${order.subtotal.toFixed(2)}`;
        if (shippingEl) shippingEl.textContent = `$${order.shipping.toFixed(2)}`;
        if (taxEl) taxEl.textContent = `$${order.tax.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${order.total.toFixed(2)}`;

        // Update shipping address
        const shippingAddressEl = document.getElementById('shippingAddress');
        if (shippingAddressEl && order.shipping) {
            shippingAddressEl.innerHTML = `
                <strong>${order.shipping.firstName} ${order.shipping.lastName}</strong><br>
                ${order.shipping.address}<br>
                ${order.shipping.city}, ${order.shipping.state} ${order.shipping.zipCode}<br>
                ${order.shipping.country}<br>
                <br>
                <strong>Email:</strong> ${order.shipping.email}<br>
                <strong>Phone:</strong> ${order.shipping.phone}
            `;
        }

        // Update payment method
        const paymentMethodEl = document.getElementById('paymentMethod');
        if (paymentMethodEl && order.payment) {
            const paymentIcons = {
                'card': '💳',
                'paypal': '💰',
                'apple': '📱'
            };
            paymentMethodEl.textContent = `${paymentIcons[order.payment] || '💳'} ${order.payment.charAt(0).toUpperCase() + order.payment.slice(1)}`;
        }

        // Generate tracking number (mock)
        const trackingNumber = `TRK${order.id.replace('ORD-', '')}`;
        const trackingElements = document.querySelectorAll('.tracking-number, #trackingNumber');
        trackingElements.forEach(el => {
            el.textContent = trackingNumber;
        });

        // Estimated delivery (3-5 business days from now)
        const deliveryDate = new Date(orderDate);
        deliveryDate.setDate(deliveryDate.getDate() + 5);
        const deliveryElements = document.querySelectorAll('.delivery-date, #deliveryDate');
        deliveryElements.forEach(el => {
            el.textContent = deliveryDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        });
    }

    window.continueShopping = function () {
        window.location.href = '../products/products.html';
    };

    window.viewOrders = function () {
        window.location.href = '../user account/user.html';
    };

    window.printOrder = function () {
        window.print();
    };

    console.log('Order confirmation page loaded successfully!');
})();