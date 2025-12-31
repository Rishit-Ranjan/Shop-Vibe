
        let userData = {};

        function loadUserData() {
            const savedUserData = localStorage.getItem('userData');
            if (savedUserData) {
                userData = JSON.parse(savedUserData);
            } else {
                // Default data if nothing is saved
                userData = {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@email.com',
                    phone: '+1 (555) 123-4567',
                    dob: '1990-01-15',
                    gender: 'male',
                    bio: 'Tech enthusiast and avid online shopper. Love discovering new gadgets and fashion trends.',
                    language: 'en',
                    currency: 'USD'
                };
            }
        }

        // Sample orders data
        const ordersData = [
            {
                id: 'ORD-2025-001',
                date: '2025-01-15',
                status: 'delivered',
                total: 127.99,
                items: ['👕', '🎧'],
                itemCount: 3
            },
            {
                id: 'ORD-2025-002', 
                date: '2025-01-10',
                status: 'shipped',
                total: 89.99,
                items: ['👟', '⌚'],
                itemCount: 2
            },
            {
                id: 'ORD-2025-003',
                date: '2025-01-05',
                status: 'processing',
                total: 245.50,
                items: ['📱', '💄', '🏠'],
                itemCount: 4
            }
        ];

        function populateProfileForm() {
            // Populate user name in sidebar
            document.querySelector('.user-name').textContent = `${userData.firstName} ${userData.lastName}`;
            document.querySelector('.user-email').textContent = userData.email;

            // Populate form fields
            Object.keys(userData).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    element.value = userData[key];
                }
            });
        }

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            loadUserData();
            populateProfileForm();
            loadRecentOrders();
            loadOrderHistory();
            setupEventListeners();
        });

        function setupEventListeners() {
            // Mobile menu toggle
            window.toggleMenu = function() {
                const navMenu = document.querySelector('.nav-menu');
                navMenu.classList.toggle('active');
            };

            // Close mobile menu when clicking outside
            document.addEventListener('click', function(event) {
                const navMenu = document.querySelector('.nav-menu');
                const navbar = document.querySelector('.navbar');
                
                if (!navbar.contains(event.target)) {
                    navMenu.classList.remove('active');
                }
            });
        }

        // Navigation functions
        function showSection(sectionId) {
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Remove active class from all menu links
            document.querySelectorAll('.menu-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Show selected section
            document.getElementById(sectionId).classList.add('active');
            
            // Add active class to clicked menu link
            event.target.classList.add('active');
        }

        // Profile functions
        function saveProfile(event) {
            event.preventDefault();
            
            // Get form data
            userData.firstName = document.getElementById('firstName').value;
            userData.lastName = document.getElementById('lastName').value;
            userData.email = document.getElementById('email').value;
            userData.phone = document.getElementById('phone').value;
            userData.dob = document.getElementById('dob').value;
            userData.gender = document.getElementById('gender').value;
            userData.bio = document.getElementById('bio').value;
            userData.language = document.getElementById('language').value;
            userData.currency = document.getElementById('currency').value;
            
            // Save to localStorage
            localStorage.setItem('userData', JSON.stringify(userData));

            // Update user name in sidebar
            document.querySelector('.user-name').textContent = `${userData.firstName} ${userData.lastName}`;
            document.querySelector('.user-email').textContent = userData.email;
            
            showNotification('Profile updated successfully!', 'success');
        }

        function resetForm() {
            // Restore original values from userData object
            Object.keys(userData).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    element.value = userData[key];
                }
            });
            showNotification('Form reset to saved values', 'info');
        }

        function uploadAvatar() {
            showNotification('Avatar upload feature coming soon!', 'info');
        }

        // Orders functions
        function loadRecentOrders() {
            const container = document.getElementById('recentOrders');
            const recentOrders = ordersData.slice(0, 2);
            
            container.innerHTML = recentOrders.map(order => createOrderCard(order)).join('');
        }

        function loadOrderHistory() {
            const container = document.getElementById('ordersList');
            container.innerHTML = ordersData.map(order => createOrderCard(order, true)).join('');
        }

        function createOrderCard(order, showAllActions = false) {
            const statusClass = `status-${order.status}`;
            const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);
            
            return `
                <div class="order-item">
                    <div class="order-header">
                        <div class="order-number">${order.id}</div>
                        <div class="order-status ${statusClass}">${statusText}</div>
                    </div>
                    
                    <div class="order-details">
                        <div class="order-detail">
                            <div class="detail-label">Order Date</div>
                            <div class="detail-value">${formatDate(order.date)}</div>
                        </div>
                        <div class="order-detail">
                            <div class="detail-label">Items</div>
                            <div class="detail-value">${order.itemCount} items</div>
                        </div>
                        <div class="order-detail">
                            <div class="detail-label">Total</div>
                            <div class="detail-value">${order.total.toFixed(2)}</div>
                        </div>
                        <div class="order-detail">
                            <div class="detail-label">Status</div>
                            <div class="detail-value">${statusText}</div>
                        </div>
                    </div>
                    
                    <div class="order-items">
                        ${order.items.map(item => `<span class="order-product">${item}</span>`).join('')}
                    </div>
                    
                    <div class="order-actions">
                        <button class="action-btn primary" onclick="viewOrder('${order.id}')">View Details</button>
                        ${order.status === 'delivered' ? '<button class="action-btn" onclick="reorder(\'' + order.id + '\')">Reorder</button>' : ''}
                        ${order.status === 'processing' ? '<button class="action-btn" onclick="cancelOrder(\'' + order.id + '\')">Cancel</button>' : ''}
                        ${showAllActions ? '<button class="action-btn" onclick="trackOrder(\'' + order.id + '\')">Track Order</button>' : ''}
                    </div>
                </div>
            `;
        }

        function formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }

        function viewOrder(orderId) {
            showNotification(`Loading details for order ${orderId}...`, 'info');
        }

        function reorder(orderId) {
            showNotification(`Adding items from ${orderId} to cart...`, 'success');
        }

        function cancelOrder(orderId) {
            if (confirm(`Are you sure you want to cancel order ${orderId}?`)) {
                showNotification(`Order ${orderId} has been cancelled.`, 'success');
            }
        }

        function trackOrder(orderId) {
            showNotification(`Opening tracking information for ${orderId}...`, 'info');
        }

        // Address functions
        function editAddress(addressId) {
            showNotification(`Edit address ${addressId} - Feature coming soon!`, 'info');
        }

        function deleteAddress(addressId) {
            if (confirm('Are you sure you want to delete this address?')) {
                showNotification('Address deleted successfully!', 'success');
            }
        }

        function setDefault(addressId) {
            showNotification('Default address updated!', 'success');
        }

        function addNewAddress() {
            showNotification('Add new address - Feature coming soon!', 'info');
        }

        // Security functions
        function changePassword() {
            showNotification('Password change - Feature coming soon!', 'info');
        }

        function setup2FA() {
            showNotification('Two-Factor Authentication setup - Feature coming soon!', 'info');
        }

        function viewLoginActivity() {
            showNotification('Login activity viewer - Feature coming soon!', 'info');
        }

        function deactivateAccount() {
            if (confirm('Are you sure you want to deactivate your account? This action can be reversed later.')) {
                showNotification('Account deactivation - Please contact support.', 'info');
            }
        }

        // Preferences functions
        function savePreferences() {
            showNotification('Preferences saved successfully!', 'success');
        }

        function logout() {
            if (confirm('Are you sure you want to sign out?')) {
                showNotification('Signing out...', 'info');
                setTimeout(() => {
                    showNotification('You have been signed out successfully.', 'success');
                }, 1000);
            }
        }

        // Utility functions
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

        console.log('ShopVibe User Account Page Loaded Successfully! 👤');
    