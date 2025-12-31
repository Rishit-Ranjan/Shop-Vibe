import express from 'express';
import cors from 'cors';
import PRODUCTS from './products.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Redirect root URL to the home page
app.get('/', (req, res) => {
    res.redirect('/home page/home.html');
});

// Config API
app.get('/api/config/slider', (req, res) => {
    res.json([
        '../assets/products/summer_collection_bg.png',
        '../assets/products/new_arrivals_bg.png',
        '../assets/products/premium_quality_bg.png'
    ]);
});

// Products API
app.get('/api/products', (req, res) => {
    const { search } = req.query;

    if (search) {
        const searchTerm = search.toLowerCase();
        const filteredProducts = PRODUCTS.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
        return res.json(filteredProducts);
    }

    res.json(PRODUCTS);
});

app.get('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = PRODUCTS.find(p => p.id === id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Product not found');
    }
});

// Category API
app.get('/api/categories', (req, res) => {
    const categories = [...new Set(PRODUCTS.map(p => p.category))];
    res.json(categories);
});

app.get('/api/products/category/:categoryName', (req, res) => {
    const { categoryName } = req.params;
    const productsInCategory = PRODUCTS.filter(
        p => p.category.toLowerCase() === categoryName.toLowerCase()
    );
    res.json(productsInCategory);
});

// Cart API (in-memory for demonstration)
let cart = [];

app.get('/api/cart', (req, res) => {
    res.json(cart);
});

app.post('/api/cart', (req, res) => {
    const { productId, quantity } = req.body;
    const parsedProductId = parseInt(productId);
    const parsedQuantity = parseInt(quantity) || 1;
    const product = PRODUCTS.find(p => p.id === parsedProductId);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    const existingItem = cart.find(item => item.product.id === parsedProductId);
    if (existingItem) {
        existingItem.quantity += parsedQuantity;
    } else {
        cart.push({ product, quantity: parsedQuantity });
    }

    res.status(201).json(cart);
});

app.delete('/api/cart/:id', (req, res) => {
    const id = parseInt(req.params.id);
    cart = cart.filter(item => item.product.id !== id);
    res.status(204).send();
});

// Wishlist API (in-memory for demonstration)
let wishlist = [];

app.get('/api/wishlist', (req, res) => {
    res.json(wishlist);
});

app.post('/api/wishlist', (req, res) => {
    const { productId } = req.body;
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) {
        return res.status(404).send('Product not found');
    }

    if (!wishlist.find(p => p.id === productId)) {
        wishlist.push(product);
    }

    res.status(201).json(wishlist);
});

app.delete('/api/wishlist/:id', (req, res) => {
    const id = parseInt(req.params.id);
    wishlist = wishlist.filter(p => p.id !== id);
    res.status(204).send();
});

// Orders API (in-memory for demonstration)
let orders = [];

app.get('/api/orders', (req, res) => {
    res.json(orders);
});

app.post('/api/orders', (req, res) => {
    const newOrder = req.body;
    newOrder.id = `ORD-${Date.now()}`;
    orders.push(newOrder);
    res.status(201).json(newOrder);
});

app.listen(port, () => {
    console.log(`ShopVibe backend server running on port ${port}`);
});
