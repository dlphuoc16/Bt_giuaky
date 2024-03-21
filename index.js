const express = require("express");
const jwt = require("jsonwebtoken");
const { User, userSchema } = require("./models/user.model.js");
const Profile = require("./models/profile.model.js");
const userRouter = require("./controllers/user.controller.js");
const middlewareService = require("./services/middleware.service.js");
const bcrypt = require("bcrypt");
const app = express();
const port = 3000;
app.use(express.json());
app.use((req, res, next) => {
  if (req.path === "/register" || req.path === "/login") {
    return next();
  }
  middlewareService.authMiddleware(req, res, next);
});
app.use("/users", userRouter);

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

app.put("/profiles/:id", async (req, res) => {
  try {
    const profileId = req.params.id;
    const updatedFields = req.body;
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    Object.assign(profile, updatedFields);
    await profile.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/profiles/:id", async (req, res) => {
  try {
    const userId = req.user._id;
    const profileId = req.params.id;
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    if (profile.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Profile.findByIdAndDelete(profileId);

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Delete profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
