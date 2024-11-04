const express = require("express");

const {
  addToCart,
  fetchCartItems,
  updateCartItemQuantity,
  delteCartItem,
} = require("../../controlers/shop/cart-controller");

const router = express.Router();

router.post("/add", addToCart);
router.get("/get/:userId", fetchCartItems);
router.put("/update-cart", updateCartItemQuantity);
router.delete("/delete/:userId/:productId", delteCartItem);

module.exports = router;
