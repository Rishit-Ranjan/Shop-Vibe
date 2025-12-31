
// Slider functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.nav-dot');

// Set background images for slider cards
async function initSlider() {
    let slideImages = [];
    try {
        // Fetch slider configuration from API
        const response = await fetch('/api/config/slider');
        if (response.ok) {
            slideImages = await response.json();
        } else {
            throw new Error('Failed to fetch slider config');
        }
    } catch (error) {
        console.error('Error fetching slider config:', error);
    }

    slides.forEach((slide, index) => {
        if (slideImages[index]) {
            slide.style.backgroundImage = `url('${slideImages[index]}')`;
            slide.style.backgroundSize = 'cover';
            slide.style.backgroundPosition = 'center';
            slide.style.color = '#333';
        }
    });
}

initSlider();

function showSlide(index) {
    const slider = document.getElementById('slider');
    slider.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
}

function currentSlide(index) {
    currentSlideIndex = index - 1;
    showSlide(currentSlideIndex);
}

function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    showSlide(currentSlideIndex);
}

// Auto-advance slider
setInterval(nextSlide, 5000);

// Mobile menu toggle
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Scroll to top functionality
window.addEventListener('scroll', function () {
    const scrollTop = document.getElementById('scrollTop');
    if (window.pageYOffset > 300) {
        scrollTop.classList.add('visible');
    } else {
        scrollTop.classList.remove('visible');
    }
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Smooth scrolling for navigation links
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

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Cart functionality
function addToCart(productId) {
    if (window.DataManager && window.Notifications) {
        const success = DataManager.addToCart(productId);

        if (success) {
            const product = DataManager.getProductById(productId);

            // Update cart count in navbar
            if (window.NavbarSync) {
                NavbarSync.updateCartCount();
            }

            // Add visual feedback
            const cartIcon = document.querySelector('.cart-count').parentElement;
            cartIcon.style.animation = 'none';
            cartIcon.offsetHeight; // Trigger reflow
            cartIcon.style.animation = 'bounce 0.5s ease';

            // Show toast notification instead of alert
            Notifications.success(`${product.name} added to cart!`);
        } else {
            Notifications.error('Failed to add item to cart');
        }
    }
}


// Close mobile menu when clicking outside
document.addEventListener('click', function (event) {
    const navMenu = document.querySelector('.nav-menu');
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');

    if (!navbar.contains(event.target)) {
        navMenu.classList.remove('active');
    }
});

// Add loading animation to products
document.querySelectorAll('.product-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// Add hover effects to category cards
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click effects to buttons
document.querySelectorAll('.add-to-cart, .cta-btn').forEach(button => {
    button.addEventListener('click', function (e) {
        let ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);

        let x = e.clientX - e.target.offsetLeft;
        let y = e.clientY - e.target.offsetTop;

        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Lazy loading for images (if you add real images later)
const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
        }
    });
});

// Initialize tooltips for navigation icons
const tooltips = {
    '🔍': 'Search',
    '❤️': 'Wishlist',
    '🛒': 'Shopping Cart',
    '👤': 'My Account'
};

document.querySelectorAll('.nav-icon').forEach(icon => {
    const iconText = icon.textContent.trim();
    if (tooltips[iconText]) {
        icon.title = tooltips[iconText];
        icon.setAttribute('aria-label', tooltips[iconText]);
    }
});

// Add accessibility improvements
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('focus', function () {
        this.style.outline = '2px solid white';
        this.style.outlineOffset = '2px';
    });

    link.addEventListener('blur', function () {
        this.style.outline = 'none';
    });
});

// Performance optimization: Debounced scroll handler
let scrollTimeout;
let isScrolling = false;

function handleScroll() {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            // Scroll-dependent animations here
            isScrolling = false;
        });
        isScrolling = true;
    }
}

window.addEventListener('scroll', handleScroll, { passive: true });

console.log('ShopVibe E-commerce Site Loaded Successfully! 🎉');
