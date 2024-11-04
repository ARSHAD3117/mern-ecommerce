const express = require("express");
const {
  createOrder,
  capturePayment,
  getAllOrdersOfUser,
  getOrderDetails,
} = require("../../controlers/shop/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePayment);
router.get("/list/:userId", getAllOrdersOfUser);
router.get("/details/:id", getOrderDetails);

module.exports = router;
