const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const protect = require("../middleware/authMiddleware");
const generatePassword = require("../utils/passwordUtils");
const sendEmail = require("../utils/emailService");

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= FORGOT PASSWORD =================
// ================= FORGOT PASSWORD =================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({
        message: "Please provide email or phone",
      });
    }

    const user = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ 24 Hour Restriction Check
    if (user.forgotPasswordRequestedAt) {
      const diff = Date.now() - user.forgotPasswordRequestedAt;
      const hours = diff / (1000 * 60 * 60);

      if (hours < 24) {
        return res.status(400).json({
          message:
            "You can request forgot password only 1 time in 24 hours",
        });
      }
    }

    // ✅ Generate new password (only small & capital letters)
    const newPassword = generatePassword(8);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.forgotPasswordRequestedAt = new Date(); // save request time

    await user.save();

    // ✅ SEND EMAIL
    await sendEmail(
      user.email,
      "Password Reset - New Password",
      `Hello ${user.name},

Your new password is: ${newPassword}

Please login and change your password immediately.

Note: You can request forgot password only once in 24 hours.`
    );

    res.status(200).json({
      message:
        "New password has been sent to your registered email",
    });

  } catch (error) {
    console.log("Forgot Password Error:", error);
    res.status(500).json({
      message: "Something went wrong while sending email",
    });
  }
});


module.exports = router;
