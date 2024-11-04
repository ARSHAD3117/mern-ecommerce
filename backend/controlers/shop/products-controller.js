const Product = require("../../models/product");

const getFilteredProducts = async (req, res) => {
  try {
    const { category = [], brand = [], sortBy } = req.query;
    let filters = {};
    if (category.length) {
      filters.category = { $in: category.split(",") };
    }
    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.price = 1;
        break;
    }

    console.log(filters, sort);
    const products = await Product.find(filters).sort(sort);
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.log(error, "filterd products");
    res.status(500).json({
      success: false,
      message: "Error Occured",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }
    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.log(error, "product details");
    res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails };
