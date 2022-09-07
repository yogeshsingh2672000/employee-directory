const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

// Route 1: Creating a new user POST: /createuser
router.post(
  "/createuser",
  [
    body("name", "Please give atleast 3 character").isLength({ min: 3 }),
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 character long").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user != null) {
        return res.json({ erros: `User with ${user.email} already exist` });
      }

      // making secure password
      const salt = await bcrypt.genSalt(10);
      const securePass = await bcrypt.hash(req.body.password, salt);

      // creating new user for DB
      user = await User({
        name: req.body.name,
        email: req.body.email,
        password: securePass,
      });
      user.save();

      const data = {
        user: {
          id: user.id,
        },
      };

      // generating auth token
      // res.json(data);
      const authToken = jwt.sign(data, "" + process.env.JWT_SECRET);
      res.json({ authToken });
    } catch (error) {
      res.status(500).send("Internal server Error");
    }
  }
);

// Route 2: Login the existing user POST: /login
router.post(
  "/login",
  [
    body("email", "Please enter the valid email").isEmail(),
    body("password", "Please enter the valid password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (user == null) {
        return res.status(400).json({ error: "please use valid credential" });
      }

      // Comparing Pass
      const comparePass = await bcrypt.compare(password, user.password); // return true/false
      if (!comparePass) {
        return res.status(400).json({ error: "please use valid credential" });
      }

      // generating authToken
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, "" + process.env.JWT_SECRET);
      // console.log("hello");
      res.json({ authToken });
    } catch (error) {
      return res.status(500).send("Internal server Error");
    }
  }
);

// Route 2: Login the existing user POST: /login
router.put(
  "/resetpassword",
  [
    body("currentPass", "this cannot be empty").exists(),
    body("newPass", "this cannot be empty").exists(),
    body("confirmPass", "this cannot be empty").exists(),
  ],
  fetchuser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors) {
      return res
        .status(400)
        .json({ error: "please enter the correct Credentials" });
    }
    const { currentPass, newPass, confirmPass } = req.body;
    try {
      if (currentPass == confirmPass) {
        return res
          .status(400)
          .json({ errors: "New password cannot be the same" });
      } else if (newPass != confirmPass) {
        return res
          .status(400)
          .json({ errors: "please give same password in New and Confirm" });
      }
      const user = await User.findById(req.user.id);
      const comparePass = await bcrypt.compare(currentPass, user.password);

      if (!comparePass) {
        return res.status(400).json({ error: "Current password in wrong" });
      }

      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(newPass, salt);

      const updatedUser = await User.findByIdAndUpdate(
        user.id,
        { password: newPassword },
        { new: true }
      );
      res.json({ success: "password successfully changed" });
    } catch (error) {
      res.status(500).send("Internal server Error");
    }

    // let user = await User.findOne({});
  }
);

module.exports = router;
