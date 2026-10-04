const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a supplier name'],
      trim: true,
    },
    contactPerson: {
      type: String,
      required: [true, 'Please add a contact person name'],
    },
    email: {
      type: String,
      required: [true, 'Please add a supplier email'],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, 'Please add a supplier phone number'],
    },
    address: {
      type: String,
      required: [true, 'Please add a supplier address'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Supplier', supplierSchema);
