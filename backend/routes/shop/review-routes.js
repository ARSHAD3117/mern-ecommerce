const express = require("express");
const {
  getProductReviews,
  addProductReview,
} = require("../../controlers/shop/product-review-controller");

const router = express.Router();

router.post("/add", addProductReview);
router.get("/:productId", getProductReviews);

module.exports = router;
