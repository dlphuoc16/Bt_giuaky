const express = require("express");
const {
  findAllUsers,
  createUser,
  updateUser,
} = require("../services/user.service");
const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  try {
    const users = await findAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.post("/create-user", async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.put("/update-user/:id", async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = userRouter;
