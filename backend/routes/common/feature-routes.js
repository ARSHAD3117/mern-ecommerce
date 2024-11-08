const {
  addFeatureImage,
  getFeatureImages,
} = require("../../controlers/common/feature-controller");
const express = require("express");

const router = express.Router();

router.post("/add", addFeatureImage);
router.get("/get", getFeatureImages);

module.exports = router;
