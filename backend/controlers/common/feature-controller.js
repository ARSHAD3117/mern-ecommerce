const Feature = require("../../models/feature");

const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    const featureImage = new Feature({ image });

    await featureImage.save();
    return res.status(201).json({
      success: true,
      data: featureImage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({});
    return res.status(200).json({
      success: true,
      data: images,
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
  addFeatureImage,
  getFeatureImages,
};
