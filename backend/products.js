const PRODUCTS = [
    {
        id: 1,
        name: 'Classic White T-Shirt',
        description: 'A timeless classic, this white t-shirt is made from 100% premium cotton for ultimate comfort and durability. Perfect for any occasion, it features a relaxed fit and a ribbed crew neck.',
        price: 29.99,
        oldPrice: 39.99,
        category: 'Fashion',
        image: '/frontend/assets/products/tshirt.png',
        rating: 4.8,
        ratingCount: 1250,
        badge: 'Sale',
        isNew: false,
        stock: 150
    },
    {
        id: 2,
        name: 'Bluetooth Headphones',
        description: 'Experience immersive sound with these noise-cancelling Bluetooth headphones. Featuring a 40-hour battery life, plush earcups, and a built-in microphone for calls.',
        price: 129.99,
        category: 'Electronics',
        image: '/frontend/assets/products/headphones.png',
        rating: 4.9,
        ratingCount: 2340,
        badge: 'New',
        isNew: true,
        stock: 75
    },
    {
        id: 3,
        name: 'Organic Skincare Set',
        description: 'Revitalize your skin with this all-in-one organic skincare set. Includes a cleanser, toner, serum, and moisturizer, all made with natural, cruelty-free ingredients.',
        price: 89.99,
        category: 'Beauty',
        image: '/frontend/assets/products/skincare.png',
        rating: 4.7,
        ratingCount: 890,
        badge: 'Premium',
        isNew: false,
        stock: 90
    },
    {
        id: 4,
        name: 'Smart Fitness Watch',
        description: 'Track your fitness goals with this advanced smartwatch. Monitors heart rate, steps, sleep, and GPS, with a vibrant AMOLED display and a 2-week battery life.',
        price: 199.99,
        oldPrice: 249.99,
        category: 'Electronics',
        image: '/frontend/assets/products/smartwatch.png',
        rating: 4.6,
        ratingCount: 1500,
        badge: 'Sale',
        isNew: false,
        stock: 60
    },
    {
        id: 5,
        name: 'Slim-Fit Denim Jeans',
        description: 'A modern take on a classic style. These slim-fit jeans are made with a comfortable stretch denim, perfect for everyday wear. Available in multiple washes.',
        price: 79.99,
        category: 'Fashion',
        image: '/frontend/assets/products/jeans.png',
        rating: 4.5,
        ratingCount: 980,
        badge: 'Best Seller',
        isNew: false,
        stock: 120
    },
    {
        id: 6,
        name: 'Trail Running Shoes',
        description: 'Conquer any trail with these durable and comfortable running shoes. Featuring a waterproof GORE-TEX membrane, high-traction outsole, and responsive cushioning.',
        price: 149.99,
        category: 'Sports',
        image: '/frontend/assets/products/running-shoes.png',
        rating: 4.8,
        ratingCount: 1120,
        badge: 'Featured',
        isNew: false,
        stock: 80
    }
];

export default PRODUCTS;
