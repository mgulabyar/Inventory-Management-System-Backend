const express = require('express');
const dotenv = require('dotenv');
const corsMiddleware = require('cors');
require('colors');
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoutes.js');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(corsMiddleware());

app.use('/api/auth', authRoutes);

app.get('/api/test', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Inventory System Backend Server is Running Smoothly!'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
