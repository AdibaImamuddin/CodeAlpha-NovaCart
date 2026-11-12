
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      salesResult,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: "customer" }),
      Order.aggregate([
        {
          $match: {
            status: { $ne: "Cancelled" },
          },
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: "$totalAmount" },
          },
        },
      ]),
    ]);

    const totalSales = salesResult[0]?.totalSales || 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalSales,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch dashboard statistics.",
    });
  }
};
