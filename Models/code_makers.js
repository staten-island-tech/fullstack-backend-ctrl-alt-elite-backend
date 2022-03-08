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
const code_makerSchema = new mongoose.Schema(
  {
    project_title: {
      type: String,
      trim: true,
      required: "Please enter project title.",
    },
    user_id: {
      type: String,
      trim: true,
      default: "none",
    },
    project_likes: [
      {
        type: Array,
        trim: true,
      },
    ],
    description: {
      type: String,
      trim: true,
      default: "none",
    },
    dark_mode: {
      type: Boolean,
      default: true,
    },
    private: {
      type: Boolean,
      default: true,
    },
    published_code: {
      type: code_components,
    },
  },
  { timestamps: true }
);

code_makerSchema.pre("save", function (next) {
  next();
});

module.exports = mongoose.model("code_maker", code_makerSchema);
