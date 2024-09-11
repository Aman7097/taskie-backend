const express = require("express");
const { check } = require("express-validator");
const userController = require("../controllers/userController");
const { authCheck } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// All routes are protected
router.use(authCheck);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
  "/profile",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
  ],
  userController.updateProfile
);

// @route   PUT /api/users/avatar
// @desc    Update user avatar
// @access  Private
router.put("/avatar", upload.single("avatar"), userController.updateAvatar);

module.exports = router;
