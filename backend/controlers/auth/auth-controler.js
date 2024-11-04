const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

const secret = "arshad@1234";
//register

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.json({
        success: false,
        message: "User Already exists with the same email id,please try again",
      });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      userName,
      email,
      password: hashPassword,
    });
    return res.status(200).json({
      success: true,
      message: "Registration successfull",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "some error occured",
    });
  }
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const data = await User.findOne({ email });
    if (!data) {
      return res.json({
        success: false,
        message: "User doesn't exist ,please register",
      });
    }
    const checkpasswordMatch = await bcrypt.compare(password, data.password);
    if (!checkpasswordMatch) {
      return res.json({
        success: false,
        message: "Incorrect Password! Please try again",
      });
    }
    const token = jwt.sign(
      {
        id: data._id,
        role: data.role,
        email: data.email,
      },
      secret,
      { expiresIn: "60m" }
    );
    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: data.email,
        role: data.role,
        id: data._id,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "some error occured",
    });
  }
};

//logout
const logoutUser = async (req, res) => {
  return res.clearCookie("token").json({
    success: true,
    message: "Logged Out Successfully",
  });
};

//auth middleware

const authMiddleWare = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
  try {
    const data = jwt.verify(token, secret);
    req.user = data;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleWare,
};
