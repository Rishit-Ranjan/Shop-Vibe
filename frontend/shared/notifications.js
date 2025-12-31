// Toast Notification System for ShopVibe
// Modern, non-intrusive notifications to replace alert()

const Notifications = (function () {
    'use strict';

    let container = null;
    let notificationCount = 0;

    // Initialize notification container
    function init() {
        if (container) return;

        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
        `;
        document.body.appendChild(container);

        // Add styles
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .toast-notification {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                    padding: 16px 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    min-width: 300px;
                    max-width: 400px;
                    animation: slideIn 0.3s ease;
                    border-left: 4px solid #667eea;
                    position: relative;
                    overflow: hidden;
                }

                .toast-notification::before {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 3px;
                    background: currentColor;
                    animation: progress var(--duration) linear;
                }

                .toast-notification.success {
                    border-left-color: #2ed573;
                    color: #2ed573;
                }

                .toast-notification.error {
                    border-left-color: #ff4757;
                    color: #ff4757;
                }

                .toast-notification.warning {
                    border-left-color: #ffa502;
                    color: #ffa502;
                }

                .toast-notification.info {
                    border-left-color: #3498db;
                    color: #3498db;
                }

                .toast-icon {
                    font-size: 24px;
                    flex-shrink: 0;
                }

                .toast-content {
                    flex: 1;
                    color: #333;
                }

                .toast-title {
                    font-weight: 600;
                    margin-bottom: 4px;
                    font-size: 14px;
                }

                .toast-message {
                    font-size: 13px;
                    color: #666;
                }

                .toast-close {
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: #999;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s;
                    flex-shrink: 0;
                }

                .toast-close:hover {
                    background: #f0f0f0;
                    color: #333;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }

                @keyframes progress {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }

                @media (max-width: 768px) {
                    #notification-container {
                        right: 10px;
                        left: 10px;
                        max-width: none;
                    }

                    .toast-notification {
                        min-width: auto;
                        max-width: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Show notification
    function show(message, type = 'info', duration = 4000) {
        init();

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        const titles = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Info'
        };

        const notification = document.createElement('div');
        notification.className = `toast-notification ${type}`;
        notification.style.setProperty('--duration', `${duration}ms`);

        notification.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-content">
                <div class="toast-title">${titles[type] || titles.info}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close">×</button>
        `;

        const closeBtn = notification.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => remove(notification));

        container.appendChild(notification);
        notificationCount++;

        // Auto remove after duration
        const timeout = setTimeout(() => {
            remove(notification);
        }, duration);

        // Store timeout so it can be cleared if manually closed
        notification.dataset.timeout = timeout;

        return notification;
    }

    // Remove notification
    function remove(notification) {
        if (!notification || !notification.parentElement) return;

        // Clear auto-remove timeout
        if (notification.dataset.timeout) {
            clearTimeout(parseInt(notification.dataset.timeout));
        }

        notification.style.animation = 'slideOut 0.3s ease';

        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
                notificationCount--;

                // Remove container if no notifications
                if (notificationCount === 0 && container) {
                    container.remove();
                    container = null;
                }
            }
        }, 300);
    }

    // Convenience methods
    function success(message, duration) {
        return show(message, 'success', duration);
    }

    function error(message, duration) {
        return show(message, 'error', duration);
    }

    function warning(message, duration) {
        return show(message, 'warning', duration);
    }

    function info(message, duration) {
        return show(message, 'info', duration);
    }

    // Public API
    return {
        init,
        show,
        success,
        error,
        warning,
        info,
        remove
    };
})();

// Make it available globally
window.Notifications = Notifications;
