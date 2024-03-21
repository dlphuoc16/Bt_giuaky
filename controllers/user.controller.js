const express = require("express");
const { findAllUsers, createUser } = require("../services/user.service");
const userRouter = express.Router();
userRouter.get("/", async (req, res) => {
  const users = await findAllUsers();
  res.json(users);
});

userRouter.post("/create-user", async (req, res) => {
  await createUser(req.body);
  res.json(user);
});

userRouter.put("/update-user/:id", async (req, res) => {
  const user = updateUser(req.params.id, req.body);
  res.json(user);
});

module.exports = userRouter;
