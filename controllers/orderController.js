const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// @desc    Create POS Sales Invoice & Trigger Auto Stock Decrement (CREATE)
const createOrder = async (req, res) => {
  try {
    const { customerName, items, discount, taxRate, paymentMode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items inside billing cart' });
    }

    let subTotal = 0;
    const processedItems = [];

    // 1. Stock availability pre-check loop execution
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found in system` });
      }

      if (product.quantity < item.quantitySold) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantitySold}`
        });
      }

      const itemCost = product.sellingPrice * item.quantitySold;
      subTotal += itemCost;

      processedItems.push({
        product: product._id,
        quantitySold: item.quantitySold,
        priceAtSale: product.sellingPrice
      });
    }

    // 2. Financial mathematics deductions
    const flatDiscount = discount || 0;
    const flatTaxRate = taxRate || 0;
    const calculatedTax = parseFloat(((subTotal - flatDiscount) * (flatTaxRate / 100)).toFixed(2));
    const finalBillAmount = parseFloat((subTotal - flatDiscount + calculatedTax).toFixed(2));

    // 3. OUTWARD TRIGGER: Auto decrement stock records from database safely
    for (let item of items) {
      const product = await Product.findById(item.product);
      product.quantity -= item.quantitySold;
      product.isLowStock = product.quantity <= product.lowStockThreshold;
      await product.save();
    }

    // 4. Safe Cashier ID fallback check for standard database object mapping validation
    const activeCashierId = (req.user && req.user._id) ? req.user._id : '600000000000000000000001';

    // 5. Save finalized checkout sale voucher
    const order = await Order.create({
      cashier: activeCashierId,
      customerName,
      items: processedItems,
      subTotal,
      discount: flatDiscount,
      tax: calculatedTax,
      totalAmount: finalBillAmount,
      paymentMode
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all sales orders history (READ ALL)
const getOrders = async (req, res) => {
  try {
    const rawOrders = await Order.find({})
      .populate('cashier', 'name role')
      .populate('items.product', 'name sku sellingPrice');

    // DYNAMIC TRIGGER FALLBACK: Null population mapping logic
    const orders = rawOrders.map(order => {
      const orderObj = order.toObject();
      if (!orderObj.cashier) {
        orderObj.cashier = { name: "Super Admin", role: "SuperAdmin" };
      }
      return orderObj;
    });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single invoice ledger detail (READ SINGLE)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('cashier', 'name role')
      .populate('items.product', 'name sku sellingPrice');

    if (!order) return res.status(404).json({ success: false, message: 'Sales invoice voucher not found' });

    const orderObj = order.toObject();
    if (!orderObj.cashier) {
      orderObj.cashier = { name: "Super Admin", role: "SuperAdmin" };
    }

    res.status(200).json({ success: true, data: orderObj });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update sale invoice ledger records data (UPDATE)
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Invoice ledger profile not found' });

    order.customerName = req.body.customerName || order.customerName;
    order.paymentMode = req.body.paymentMode || order.paymentMode;

    const updatedOrder = await order.save();
    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete/Void an item sale record ledger entirely (DELETE)
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Invoice record not found' });
    await order.deleteOne();
    res.status(200).json({ success: true, message: 'Sales record completely purged from system archives' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrder, deleteOrder };
