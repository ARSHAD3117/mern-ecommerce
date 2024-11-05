const paypal = require("../../helpers/paypal");
const Order = require("../../models/orders");
const Cart = require("../../models/cart");
const Product = require("../../models/product");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
    } = req.body;
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "INR",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "INR",
            total: totalAmount.toFixed(2),
          },
          description: "order payment",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async function (error, payment) {
      if (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Error while creating paypal payment",
        });
      } else {
        const newOrder = new Order({
          userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId,
          payerId,
        });
        await newOrder.save();
        const approvalURL = payment.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        return res.status(201).json({
          success: true,
          approvalURL,
          orderId: newOrder._id,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.staus(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found",
      });
    }
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    for (let cart of order.cartItems) {
      const product = await Product.findById(cart.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`,
        });
      }
      product.totalStock -= cart.quantity;
      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order Confirmed",
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

const getAllOrdersOfUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ orderDate: -1 });
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
    return res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

const getOrderDetails = async (req, res) => {
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

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersOfUser,
  getOrderDetails,
};
