const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantitySold: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
    },
    priceAtSale: {
        type: Number,
        required: true,
    }
});

const orderSchema = new mongoose.Schema(
    {
        cashier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        customerName: {
            type: String,
            default: 'Walk-in Customer',
        },
        items: [orderItemSchema],
        subTotal: {
            type: Number,
            required: true,
            default: 0,
        },
        discount: {
            type: Number,
            default: 0, // Flat discount rate amount
        },
        tax: {
            type: Number,
            default: 0, // Calculated tax amount
        },
        totalAmount: {
            type: Number,
            required: true,
            default: 0,
        },
        paymentMode: {
            type: String,
            enum: ['Cash', 'Card', 'MobileWallet'],
            default: 'Cash',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Order', orderSchema);
