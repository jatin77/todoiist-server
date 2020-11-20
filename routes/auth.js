const express = require("express");
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", protect, getMe);
router.put("/updateDetails", protect, updateDetails);
router.put("/updatePassword", protect, updatePassword);
// router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:resetToken");

module.exports = router;
