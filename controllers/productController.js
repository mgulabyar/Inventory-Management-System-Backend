const Product = require('../models/productModel');

// @desc    Create product (CREATE)
const createProduct = async (req, res) => {
    try {
        const { name, sku, category, costPrice, sellingPrice, quantity, lowStockThreshold } = req.body;

        const skuExists = await Product.findOne({ sku });
        if (skuExists) return res.status(400).json({ success: false, message: 'A product with this unique SKU already exists' });

        // Controller level smooth check logic
        const initialQuantity = quantity || 0;
        const safetyLimit = lowStockThreshold || 5;
        const lowStockCheck = initialQuantity <= safetyLimit;

        const product = await Product.create({
            name,
            sku,
            category,
            costPrice,
            sellingPrice,
            quantity: initialQuantity,
            lowStockThreshold: safetyLimit,
            isLowStock: lowStockCheck // Simple direct assign calculation
        });

        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get all products (READ ALL)
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).populate('category', 'name');
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get single product (READ SINGLE)
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update product details (UPDATE)
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product profile not found' });

        product.name = req.body.name || product.name;
        product.sku = req.body.sku || product.sku;
        product.category = req.body.category || product.category;
        product.costPrice = req.body.costPrice !== undefined ? req.body.costPrice : product.costPrice;
        product.sellingPrice = req.body.sellingPrice !== undefined ? req.body.sellingPrice : product.sellingPrice;
        product.quantity = req.body.quantity !== undefined ? req.body.quantity : product.quantity;
        product.lowStockThreshold = req.body.lowStockThreshold !== undefined ? req.body.lowStockThreshold : product.lowStockThreshold;

        // Direct assignment calculation before saving data
        product.isLowStock = product.quantity <= product.lowStockThreshold;

        const updatedProduct = await product.save();
        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Delete product (DELETE)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        await product.deleteOne();
        res.status(200).json({ success: true, message: 'Product completely purged from index' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };
