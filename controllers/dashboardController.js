const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const PurchaseOrder = require('../models/purchaseOrderModel');

// @desc    Get complete business intelligence metrics for active dashboard counters (READ)
// @route   GET /api/dashboard/summary
const getDashboardSummary = async (req, res) => {
    try {
        // 1. Fetch data aggregates concurrently
        const [allOrders, allProducts, allPurchaseOrders] = await Promise.all([
            Order.find({}).populate('items.product'),
            Product.find({}),
            PurchaseOrder.find({})
        ]);

        // 2. Financial Metrics Calculators Engine
        let totalRevenue = 0;
        let totalGrossProfit = 0;
        let totalItemsSold = 0;

        allOrders.forEach(order => {
            totalRevenue += order.totalAmount;

            order.items.forEach(item => {
                totalItemsSold += item.quantitySold;

                // Agar dynamic model verification context populated safe ho, to profit calculation complete chalao
                if (item.product) {
                    const itemCostPrice = item.product.costPrice || 0;
                    const singleItemProfit = item.priceAtSale - itemCostPrice;
                    const totalItemProfit = singleItemProfit * item.quantitySold;
                    totalGrossProfit += totalItemProfit;
                }
            });

            // Deduct order level flat discounts mathematically from total profit margin pool
            if (order.discount > 0) {
                totalGrossProfit -= order.discount;
            }
        });

        // 3. Purchase Expenses Calculations
        let totalExpenses = 0;
        allPurchaseOrders.forEach(po => {
            if (po.status === 'Received') {
                totalExpenses += po.totalAmount;
            }
        });

        // 4. Stock Safety Analytics Filtering Trackers
        const lowStockAlertsCount = allProducts.filter(p => p.isLowStock).length;
        const lowStockItemsList = allProducts
            .filter(p => p.isLowStock)
            .map(p => ({ id: p._id, name: p.name, remainingStock: p.quantity, sku: p.sku }));

        // 5. Fast-Moving Items Aggregation Logic matrix calculation maps
        const productSalesMap = {};
        allOrders.forEach(order => {
            order.items.forEach(item => {
                if (item.product) {
                    const pId = item.product._id.toString();
                    if (!productSalesMap[pId]) {
                        productSalesMap[pId] = {
                            name: item.product.name,
                            sku: item.product.sku,
                            totalSoldUnits: 0
                        };
                    }
                    productSalesMap[pId].totalSoldUnits += item.quantitySold;
                }
            });
        });

        const fastMovingItems = Object.values(productSalesMap)
            .sort((a, b) => b.totalSoldUnits - a.totalSoldUnits)
            .slice(0, 5); // Extract peak top 5 top tier items ranking arrays

        // 6. Master Summary response compile
        res.status(200).json({
            success: true,
            data: {
                financials: {
                    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
                    totalGrossProfit: parseFloat(totalGrossProfit.toFixed(2)),
                    totalInwardPurchaseExpenses: parseFloat(totalExpenses.toFixed(2)),
                    netSimulatedCashflow: parseFloat((totalRevenue - totalExpenses).toFixed(2))
                },
                inventorySummary: {
                    totalUniqueProductsIndexed: allProducts.length,
                    totalSalesTransactionsProcessed: allOrders.length,
                    totalIndividualItemsSoldCount: totalItemsSold,
                    lowStockAlertsActiveCount: lowStockAlertsCount
                },
                criticalAlerts: lowStockItemsList,
                topSellingPerformers: fastMovingItems
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { getDashboardSummary };
