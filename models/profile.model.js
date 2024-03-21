const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema(
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
);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = {
    profileSchema,
    Profile,
  
};
