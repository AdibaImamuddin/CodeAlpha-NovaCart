
import User from "../models/User.js";

// GET ALL CUSTOMERS (ADMIN)
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" })
      .select("-password -otp -otpExpiry -resetPasswordToken")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: customers.length,
      customers,
    });
  } catch (error) {
    console.error("Get customers error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch customers.",
    });
  }
};

// GET SINGLE CUSTOMER (ADMIN)
export const getCustomerById = async (req, res) => {
  try {
    const customer = await User.findOne({
      _id: req.params.id,
      role: "customer",
    }).select("-password -otp -otpExpiry -resetPasswordToken");

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    return res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    console.error("Get customer error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch customer details.",
    });
  }
};
