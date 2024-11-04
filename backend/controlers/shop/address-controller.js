const Address = require("../../models/address");

const addAddress = async (req, res) => {
  try {
    const { userId, address, city, pincode, phone, notes } = req.body;
    console.log(userId, address, city, pincode, phone, notes);
    if (!userId || !address || !city || !pincode || !phone || !notes) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided",
      });
    }

    const newlyCreatedAddress = new Address({
      userId,
      address,
      city,
      pincode,
      phone,
      notes,
    });

    await newlyCreatedAddress.save();

    return res.status(200).json({
      success: true,
      data: newlyCreatedAddress,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }

    const addresslist = await Address.find({ userId });
    return res.status(200).json({
      success: true,
      data: addresslist,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formdata = req.body;
    console.log(formdata, "from edit");
    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User & address id's are required",
      });
    }
    const address = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      formdata,
      { new: true }
    );
    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Some Error Occured",
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User & address id's are required",
      });
    }

    const address = await Address.findOneAndDelete({ _id: addressId, userId });
    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Adderss Deleted Successfully",
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
  addAddress,
  editAddress,
  fetchAllAddress,
  deleteAddress,
};
