const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'Please add a unique SKU/Barcode'],
      unique: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please link a specific category'],
    },
    costPrice: {
      type: Number,
      required: [true, 'Please add the purchase cost price'],
      default: 0,
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Please add the customer selling price'],
      default: 0,
    },
    quantity: {
      type: Number,
      required: [true, 'Please add initial stock quantity'],
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      required: [true, 'Please set a low stock safety alert number'],
      default: 5,
    },
    isLowStock: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Mongoose pre-save trigger: Automatic low stock evaluation flag logic
productSchema.pre('save', function (next) {
  this.isLowStock = this.quantity <= this.lowStockThreshold;
//   next();
});

module.exports = mongoose.model('Product', productSchema);
