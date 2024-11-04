const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleWare,
} = require("../../controlers/auth/auth-controler");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleWare, (req, res) => {
  const data = req.user;
  res.status(200).json({
    success: true,
    message: "User Authenticated!",
    user: data,
  });
});

module.exports = router;
