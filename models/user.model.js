const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      require: true,
    },
    fullName: {
      type: String,
      require: true,
    },
    dateOfBirth: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    nationality: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = {
  userSchema,
  User,
};
