const express = require('express');
const dotenv = require('dotenv');
const corsMiddleware = require('cors');
require('colors');
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoutes.js');
const categoryRoutes = require('./routes/categoryRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const supplierRoutes = require('./routes/supplierRoutes.js');
const purchaseOrderRoutes = require('./routes/purchaseOrderRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const dashboardRoutes = require('./routes/dashboardRoutes.js');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(corsMiddleware());

// Mount App Service Matrix Routes Tree
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/test', (req, res) => {
  res.status(200).json({ success: true, message: 'Analytics Core Online!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server analytics pipeline processing on port ${PORT}`);
});
