const express = require("express");
const jwt = require("jsonwebtoken");
const { User, userSchema } = require("./models/user.model.js");
const { Profile, profileSchema } = require("./models/profile.model");
const userRouter = require("./controllers/user.controller");
const bcrypt = require("bcrypt");
const app = express();
const port = 3000;
app.use(express.json());

const mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/BT")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error:", error);
  });

app.post("/register", async (req, res) => {
  try {
    const {
      email,
      fullName,
      password,
      address,
      birthPlace,
      nationality,
      personalSkills,
      hobbies,
      personalGoals,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      fullName,
      address,
      birthPlace,
      nationality,
      password: hashedPassword,
    });
    await newUser.save();

    const newProfile = new Profile({
      userId: newUser._id,
      personalSkills,
      hobbies,
      personalGoals,
    });
    await newProfile.save();

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ userId: user._id }, "phuoc1x", {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
