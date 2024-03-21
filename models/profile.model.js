const mongoose = require("mongoose");

const Profile =
  mongoose.models.Profile ||
  mongoose.model(
    "Profile",
    new mongoose.Schema(
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        personalSkills: [
          {
            type: String,
            required: true,
          },
        ],
        hobbies: [
          {
            type: String,
            required: true,
          },
        ],
        personalGoals: [
          {
            type: String,
            required: true,
          },
        ],
      },
      {
        timestamps: true,
      }
    )
  );

module.exports = Profile;
