const express = require("express");

const {
  handleImgUpload,
  addProduct,
  fetchAllProducts,
  deleteProduct,
  editProduct,
} = require("../../controlers/admin/products-controler");

const { upload } = require("../../helpers/cloudinary");

const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImgUpload);
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);

module.exports = router;
