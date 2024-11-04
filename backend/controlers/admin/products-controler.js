const { ImageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/product");

const handleImgUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await ImageUploadUtil(url);

    return res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error occured",
    });
  }
};

//add a new product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;
    const newproduct = await Product.create({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    });
    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//fetch all products
const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});
    return res.status(200).json({
      success: true,
      message: "Products fetched Successfully",
      data: listOfProducts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};
//edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    const findProduct = await Product.findById(id);
    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updatedProduct = {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    };
    const options = { new: true };
    const result = await Product.findByIdAndUpdate(id, updatedProduct, options);
    return res.status(200).json({
      success: true,
      data: result,
      message: "Product Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let findProduct = await Product.findByIdAndDelete(id);
    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = {
  handleImgUpload,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
};
