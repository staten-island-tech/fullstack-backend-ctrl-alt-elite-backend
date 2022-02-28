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
      rquired:"Please enter a your email"
    },
    given_name: {
      type: String,
      trim: true,
      default: "",
    },
    family_name: {
      type: String,
      trim: true,
      default: "",
    },
    nickname: {
      type: String,
      trim: true,
      default: "",
    },
    profile_pic: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    following: [{ type: String, trim: true },],
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
