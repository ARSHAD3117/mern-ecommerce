const express = require("express");

const {
  addAddress,
  editAddress,
  deleteAddress,
  fetchAllAddress,
} = require("../../controlers/shop/address-controller");

const router = express.Router();

router.post("/add", addAddress);
router.put("/update/:userId/:addressId", editAddress);
router.get("/get/:userId", fetchAllAddress);
router.delete("/delete/:userId/:addressId", deleteAddress);

module.exports = router;
