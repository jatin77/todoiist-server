const User = require("../models/User");
const sendEmail = require("../utils/sendEmails");

// @desc      Register a user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    // send jwt token
    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};

// @desc      Login a user
// @route     DELETE /api/v1/auth/login
// @access    Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide an email and password",
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};

// @desc      Logged in user details
// @route     GET /api/v1/auth/me
// @access    Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Server Error",
      });
    } else {
      res.status(200).json({
        success: true,
        user,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};

// @desc      Update user password
// @route     PUT /api/v1/auth/updatePassword
// @access    Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    // Check current password
    const isCurrentMatch = await user.matchPassword(req.body.currentPassword);

    if (!isCurrentMatch) {
      return res.status(400).json({
        success: false,
        error: "Current password do not match",
      });
    }
    user.password = req.body.newPassword;
    await user.save();
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};

// @desc      Update user details
// @route     PUT /api/v1/auth/updateDetails
// @access    Private
exports.updateDetails = async (req, res, next) => {
  try {
    let fieldsToUpdate = {};

    if (req.body.name) {
      fieldsToUpdate.name = req.body.name;
    }
    if (req.body.email) {
      fieldsToUpdate.email = req.body.email;
    }
    console.log(fieldsToUpdate);
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      fieldsToUpdate,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || "Server Error",
    });
  }
};

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotPassword
// @access    Public
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "No user found",
    });
  }

  // Get our rest token
  const resetToken = user.getResetPasswordToken();
  try {
    await user.save({
      validateBeforeSave: false,
    });
  } catch (error) {
    console.log(error);
  }

  // Create reset url
  const resetURL = `http:localhost:3000/resetPassword/${resetToken}`;

  const message = `--->${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });
    res.status(200).json({ success: true, data: "Email sent" });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(400).json({
      success: false,
      error: "Password cannot be reset",
    });
  }

  res.status(200).json({
    success: true,
    user,
  });
};

// Get token and send response on [login, register, updatePassword, resetPassword]
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRE_DATE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).json({
    success: true,
    token,
  });
};
