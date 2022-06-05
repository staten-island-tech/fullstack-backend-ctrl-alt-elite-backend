const mongoose = require("mongoose");
const slugify = require("slugify");

const code_components = new mongoose.Schema(
  {
    html: {
      type: String,
      default: "none",
    },
    css: {
      type: String,
      default: "none",
    },
    js: {
      type: String,
      default: "none",
    },
  },
  { timestamps: true }
);
const code_makerComponents = new mongoose.Schema(
  {
    project_title: {
      type: String,
      trim: true,
      required: "Please enter project title.",
    },
    description: {
      type: String,
      trim: true,
      default: "none",
    },
    project_likes: [
      {
        type: Object,
        trim: true,
      },
    ],
    dark_mode: {
      type: Boolean,
      default: true,
    },
    private: {
      type: Boolean,
      default: true,
    },
    published_code: code_components,
  },
  { timestamps: true }
);

const user_profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Please enter your name.",
    },
    user_id: {
      type: String,
      trim: true,
      rquired: "Please enter your email",
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
    following: [{ type: String, trim: true }],
    dark_mode: {
      type: Boolean,
      default: false,
    },
    projects: [code_makerComponents],
       
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

module.exports = mongoose.model("profile", user_profileSchema);
