const res = require("express/lib/response");
const { Mongoose, Schema } = require("mongoose");
const User_profile = require("../Models/user_profiles"); // user profile model
const Code_maker = require("../Models/code_makers");
const { rawListeners } = require("../Models/user_profiles");

exports.homePage = async (req, res) => {
  //basically just displaying all the data available for that user // the forntend will basically treat this as an API and take this information and use dot method to pull stuff out
  try {
    const user_profile = await User_profile.find({ user_id: req.body.user_id });
    console.log(req.body.user_id);
    const code_maker = await Code_maker.aggregate([
      { $match: { user_id: "req.body.user_id" } },
      { $sort: { "private_code.updatedAt": -1 } },
      { $limit: 3 },
    ]);

    res.json({ user_profile: user_profile, most_recent_projects: code_maker });
  } catch (error) {
    console.log(error);
  }
};
exports.createUser = async (req, res) => {
  try {
    // if (typeof req.body._id != "undefined") delete req.body._id;
    // if (typeof req.body.createdAt != "undefined") delete req.body.createdAt;
    // if (typeof req.body.updatedAt != "undefined") delete req.body.updatedAT;
    const user_profile = new User_profile(); //get an instance of the model and populate it with data coming from request, which is everything in document
    user_profile.user_id = req.body.email;
    user_profile.name = req.body.name;
    user_profile.given_name = req.body.given_name;
    user_profile.profile_pic = req.body.picture;
    user_profile.nickname = req.body.nickname;
    console.log("user profile is updated");
    await user_profile.save();
    res.json(user_profile);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getProfile = async (req, res) => {
  try {
    // if (typeof req.body._id != "undefined") delete req.body._id;
    // if (typeof req.body.createdAt != "undefined") delete req.body.createdAt;
    // if (typeof req.body.updatedAt != "undefined") delete req.body.updatedAT;
    const user_profile = await User_profile.find({ user_id: req.body.email });
    // const user_profile = new User_profile(); //get an instance of the model and populate it with data coming from request, which is everything in document

    res.json(user_profile);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.updateFollowing = async (req, res) => {
  try {
    const user_profile = await User_profile.findById(req.body._id); //you have to get an instance of the model, aka a document, basically one user, when you create an instance, you have data to use, we are querying data to get an instance
    user_profile.name = req.body.name; //the document for that specific user
    user_profile.following = req.body.following;
    await user_profile.save();
    res.json(user_profile);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user_profile = await User_profile.findById(req.body._id);
    user_profile.name = req.body.name;
    user_profile.user_id = req.body.user_id;
    user_profile.profile_pic = req.body.profile_pic;
    user_profile.description = req.body.description;
    user_profile.nickname = req.body.nickname;
    user_profile.given_name = req.body.given_name;
    user_profile.darkmode = req.body.darkmode;
    await user_profile.save();
    res.json(user_profile);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.createCode = async (req, res) => {
  try {
    const code_maker = new Code_maker(req.body);

    await code_maker.save();
    res.json(code_maker);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// exports.getShops = async (req, res) =>{
//     try {
//         const Shops = await Shop.find()
//         res.json(Shops)
//     } catch (error) {
//         console.log(error)

exports.updateProfile = async (req, res) => {
  try {
    const user_profile = await User_profile.findById(req.body._id);
    user_profile.name = req.body.name;
    user_profile.user_id = req.body.user_id;
    user_profile.profile_pic = req.body.profile_pic;
    user_profile.description = req.body.description;
    user_profile.darkmode = req.body.darkmode;
    user_profile;
    await user_profile.save();
    res.json(user_profile);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.createCode = async (req, res) => {
  try {
    const code_maker = new Code_maker(req.body);
    await code_maker.save();
    res.json(code_maker);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
