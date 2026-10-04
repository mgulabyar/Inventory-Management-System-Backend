const PurchaseOrder = require('../models/purchaseOrderModel');
const Product = require('../models/productModel');

// @desc    Create purchase order (CREATE)
const createPurchaseOrder = async (req, res) => {
    try {
        const { supplier, items, status } = req.body;

        let totalAmount = 0;
        for (let item of items) {
            totalAmount += item.quantityOrdered * item.costPriceAtPurchase;
        }

        const purchaseOrder = await PurchaseOrder.create({
            supplier,
            items,
            totalAmount,
            status: status || 'Draft'
        });

        res.status(201).json({ success: true, data: purchaseOrder });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get all purchase orders (READ ALL)
const getPurchaseOrders = async (req, res) => {
    try {
        const orders = await PurchaseOrder.find({})
            .populate('supplier', 'name email')
            .populate('items.product', 'name sku');
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get single purchase order (READ SINGLE)
const getPurchaseOrderById = async (req, res) => {
    try {
        const order = await PurchaseOrder.findById(req.params.id)
            .populate('supplier', 'name email')
            .populate('items.product', 'name sku');
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update purchase order & Controller-level Stock Trigger (UPDATE)
const updatePurchaseOrder = async (req, res) => {
    try {
        const order = await PurchaseOrder.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        if (order.status === 'Received' || order.status === 'Cancelled') {
            return res.status(400).json({ success: false, message: `Final state already set to ${order.status}` });
        }

        const newStatus = req.body.status || order.status;

        // CONTROLLER LEVEL INWARD TRIGGER: Run loop if stock arrives
        if (newStatus === 'Received' && order.status !== 'Received') {
            for (let item of order.items) {
                const product = await Product.findById(item.product);
                if (product) {
                    product.quantity += item.quantityOrdered; // Stock Increments
                    product.isLowStock = product.quantity <= product.lowStockThreshold; // Simple flag recalculation
                    await product.save();
                }
            }
        }

        order.status = newStatus;
        if (req.body.items) {
            order.items = req.body.items;
            let totalAmount = 0;
            for (let item of order.items) {
                totalAmount += item.quantityOrdered * item.costPriceAtPurchase;
            }
            order.totalAmount = totalAmount;
        }

        const updatedOrder = await order.save();
        res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Delete purchase order (DELETE)
const deletePurchaseOrder = async (req, res) => {
    try {
        const order = await PurchaseOrder.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        if (order.status === 'Received') {
            return res.status(400).json({ success: false, message: 'Cannot delete processed receipts' });
        }

        await order.deleteOne();
        res.status(200).json({ success: true, message: 'Purchase record removed' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { createPurchaseOrder, getPurchaseOrders, getPurchaseOrderById, updatePurchaseOrder, deletePurchaseOrder };
