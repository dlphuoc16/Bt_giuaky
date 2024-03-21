const { User } = require("../models/user.model");

const findAllUsers = async () => {
  const users = await User.find().lean();
  return users;
};

const createUser = async (body) => {
  const { email, fullName, dateOfBirth, address, nationality, password } = body;
  const user = await User.create({
    email,
    fullName,
    dateOfBirth,
    address,
    nationality,
    password,
  });
  return user;
};

const updateUser = async (id, body) => {
  const { email, fullName, dateOfBirth, address, nationality, password } = body;
  const user = await User.findByIdAndUpdate(
    id,
    {
      email,
      fullName,
      dateOfBirth,
      address,
      nationality,
      password,
    },
    { new: true }
  );
  return user;
};

module.exports = {
  findAllUsers,
  createUser,
  updateUser,
};
