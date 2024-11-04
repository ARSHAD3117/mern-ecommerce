const express = require("express");
const { searchProducts } = require("../../controlers/shop/search-controller");

const router = express.Router();

router.get("/:keyword", searchProducts);

module.exports = router;
