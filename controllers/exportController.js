const Product = require('../models/productModel');

// @desc    Export entire inventory product index into standard Excel-compatible CSV stream (READ)
// @route   GET /api/export/products
const exportProductsToCSV = async (req, res) => {
    try {
        // 1. Fetch live product data table with populated category names
        const products = await Product.find({}).populate('category', 'name');

        if (!products || products.length === 0) {
            return res.status(404).json({ success: false, message: 'No product inventory rows found to export' });
        }

        // 2. Define standard CSV Column Headers spreadsheet layout text matrix block lines
        let csvData = 'Product Name,SKU Barcode,Category Group,Cost Price (\$),Selling Price (\$),Available Stock Qty,Low Stock Alert Active?\n';

        // 3. Loop through database documents and format clean rows data strings strings chunk
        products.forEach(p => {
            const categoryName = p.category ? p.category.name : 'Unassigned';

            // Sanitization pipeline check text values: remove manual text commas to prevent sheet broken rows grid anomalies
            const sanitizedName = p.name.replace(/,/g, ' ');
            const sanitizedCategory = categoryName.replace(/,/g, ' ');

            csvData += `${sanitizedName},${p.sku},${sanitizedCategory},${p.costPrice},${p.sellingPrice},${p.quantity},${p.isLowStock ? 'YES' : 'NO'}\n`;
        });

        // 4. Configure master network stream response headers for instant auto-download attachment hooks file triggers
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=Inventory_Stock_Report.csv');

        // 5. Fire raw data lines down into client browser download stream pipeline
        return res.status(200).send(csvData);

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { exportProductsToCSV };
