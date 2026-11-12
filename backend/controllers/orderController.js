
import Order from "../models/Order.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    } = req.body;

    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !shippingAddress ||
      totalAmount === undefined ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.addressLine ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid order and shipping details.",
      });
    }

    const cleanItems = items.map((item) => ({
      productId: String(item.productId || item.id || ""),
      name: String(item.name || ""),
      price: Number(item.price),
      quantity: Number(item.quantity),
      image: String(item.image || ""),
    }));

    const invalidItem = cleanItems.some(
      (item) =>
        !item.productId ||
        !item.name ||
        !Number.isFinite(item.price) ||
        item.price < 0 ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
    );

    if (invalidItem) {
      return res.status(400).json({
        success: false,
        message: "One or more order items are invalid.",
      });
    }

    const calculatedTotal = cleanItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (
      !Number.isFinite(Number(totalAmount)) ||
      Number(totalAmount) !== calculatedTotal
    ) {
      return res.status(400).json({
        success: false,
        message: "Order total does not match the item prices.",
      });
    }

    const order = await Order.create({
      user: req.user.id,
      orderId: `NC${Date.now()}${Math.floor(Math.random() * 1000)}`,
      items: cleanItems,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        addressLine: shippingAddress.addressLine,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || "Pakistan",
      },
      paymentMethod: paymentMethod || "COD",
      totalAmount: calculatedTotal,
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get logged-in customer's orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get one order belonging to the logged-in customer
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ADMIN: Get all customer orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ADMIN: Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
