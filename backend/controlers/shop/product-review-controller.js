const Reviews = require("../../models/review");
const Order = require("../../models/orders");
const Product = require("../../models/product");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } =
      req.body;
    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      orderStatus: "confirmed",
    });
    if (!order) {
      return res.status(200).json({
        success: false,
        message: "Please Purchase this product to review it",
      });
    }
    const checkExisitngReview = await Reviews.findOne({ productId, userId });
    console.log(checkExisitngReview, "checkExisitngReview");
    if (checkExisitngReview) {
      return res.status(200).json({
        success: false,
        message: "You already reviewed this product",
      });
    }
    const newReview = new Reviews({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });
    await newReview.save();
    const reviews = await Reviews.find({ productId });
    const totalReviews = reviews.length;
    const averageReview = (
      reviews.reduce((acc, cur) => acc + cur.reviewValue, 0) / totalReviews
    ).toFixed(1);
    await Product.findByIdAndUpdate(productId, { averageReview });
    return res.status(200).json({
      success: true,
      message: "Review Submitted Successfully",
      data: newReview,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Reviews.find({ productId });
    return res.status(201).json({
      success: true,
      message: "Reviews fetched Successfully",
      data: reviews,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

module.exports = {
  addProductReview,
  getProductReviews,
};
