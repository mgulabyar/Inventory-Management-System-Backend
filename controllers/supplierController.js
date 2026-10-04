const Supplier = require('../models/supplierModel');

// @desc    Create supplier (CREATE)
const createSupplier = async (req, res) => {
    try {
        const { name, contactPerson, email, phone, address } = req.body;
        const exists = await Supplier.findOne({ email });
        if (exists) return res.status(400).json({ success: false, message: 'Supplier with this email already exists' });

        const supplier = await Supplier.create({ name, contactPerson, email, phone, address });
        res.status(201).json({ success: true, data: supplier });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get all suppliers (READ ALL)
const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find({});
        res.status(200).json({ success: true, count: suppliers.length, data: suppliers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get single supplier (READ SINGLE)
const getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });
        res.status(200).json({ success: true, data: supplier });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update supplier (UPDATE)
const updateSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });

        Object.assign(supplier, req.body);
        const updatedSupplier = await supplier.save();
        res.status(200).json({ success: true, data: updatedSupplier });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Delete supplier (DELETE)
const deleteSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ success: false, message: 'Supplier not found' });
        await supplier.deleteOne();
        res.status(200).json({ success: true, message: 'Supplier deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { createSupplier, getSuppliers, getSupplierById, updateSupplier, deleteSupplier };
