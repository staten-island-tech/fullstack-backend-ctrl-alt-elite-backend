const mongoose = require("mongoose");
const slugify = require("slugify");
const user_profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Please enter a your name.",
    },
    user_id: {
      type: String,
      trim: true,
    },
    given_name: {
      type: String,
      trim: true,
    },
    family_name: {
      type: String,
      trim: true,
    },
    nickname: {
      type: String,
      trim: true,
    },
    profile_pic: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    following: [{ type: String, trim: true }],
    dark_mode: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

user_profileSchema.pre("save", function (next) {
  if (!this.isModified("name")) {
    next();
    return;
  }
  this.slug = slugify(this.name);
  next();
});

module.exports = mongoose.model("user_profile", user_profileSchema);
