const Order = require("../../models/orders");

const getAllOrdersOfAllUser = async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }
    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log(error);
    return res.staus(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No order found",
      });
    }
    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.log(error);
    return res.staus(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No order found",
      });
    }
    await Order.findByIdAndUpdate(id, { orderStatus });
    return res.status(200).json({
      success: true,
      message: "order status updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.staus(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

module.exports = {
  getAllOrdersOfAllUser,
  getOrderDetailsForAdmin,
  updateOrderStatus,
};
