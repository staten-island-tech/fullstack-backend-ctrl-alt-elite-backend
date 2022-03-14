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

exports.getProjects = async (req, res) => {
  //  modify to use parameters to limit the list to most recent
  try {
    const codeMaker = await Code_maker.aggregate([
      { $match: { user_id: req.body.userID } },
      { $sort: { "private_code.updatedAt": -1 } },
      // { $limit: 3 },
    ]);

    res.json({ projects: codeMaker });
    console.log(codeMaker);
  } catch (error) {
    console.log(error);
  }
};

exports.createUser = async (req, res) => {
  try {
    const user_profile = new User_profile();
    user_profile.user_id = req.body.email;
    user_profile.name = req.body.name;
    user_profile.given_name = req.body.given_name;
    user_profile.profile_pic = req.body.picture;
    user_profile.nickname = req.body.nickname;

    await user_profile.save();
    res.json(user_profile);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userProfile = await User_profile.find({ user_id: req.body.email });
    if (userProfile.length === 0) throw "Error : user does not exists";

    const followers = await User_profile.count({ following: req.body.email });

    res.json({
      userProfile: userProfile[0],
      followers: followers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const following = await User_profile.find(
      { user_id: req.body.email },
      { user_id: 1, following: 1 }
    );
    const list = await User_profile.find(
      { user_id: { $in: following[0].following } },
      { name: 1, profile_pic: 1, user_id: 1 }
    );

    res.json({
      uniqueID: following[0]._id,
      user_id: following.user_id,
      list: list,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const list = await User_profile.find(
      { following: req.body.email },
      { name: 1, profile_pic: 1, user_id: 1 }
    );

    res.json({
      list: list,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// exports.updateFollowing = async (req, res) => {
//   try {
//     const user_profile = await User_profile.findById(req.body.uniqueID);  r
//     user_profile.following = req.body.list;
//     await user_profile.save();
//     res.json(user_profile);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

exports.unFollow = async (req, res) => {
  try {
    let userProfile = await User_profile.find({ user_id: req.body.userID });
    userProfile = await User_profile.findById(userProfile[0]._id);
    userProfile.following = userProfile.following.filter(
      (item) => item != req.body.unfollowUserID
    );
    await userProfile.save();
    res.json(userProfile);
    console.log(userProfile);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.follow = async (req, res) => {
  try {
    let userProfile = await User_profile.find({ user_id: req.body.userID });
    userProfile = await User_profile.findById(userProfile[0]._id);
    userProfile.following.push(req.body.followUserID);

    await userProfile.save();
    res.json(userProfile);
    console.log(userProfile);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getFollowInfo = async (req, res) => {
  try {
    const user_profile = await User_profile.find({ user_id: req.body.userID });
    const following = user_profile[0].following.includes(req.body.followUserID);
    const user_profile2 = await User_profile.find({
      user_id: req.body.followUserID,
    });
    const followedby = user_profile2[0].following.includes(req.body.userID);
    const followInfo = { following: following, followedby: followedby };

    res.json(followInfo);
    console.log(followInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getInfo = async (req, res) => {
  try {
    const user_profile = await User_profile.find({ user_id: req.body.userID });
    const following =
      user_profile[0].following === "undefined"
        ? 0
        : user_profile[0].following.length;

    const followers = await User_profile.count({ following: req.body.userID });
    const projects = await Code_maker.count({ user_id: req.body.userID });

    const info = { following, followers, projects };

    res.json(info);
    console.log(info);
  } catch (error) {
    console.log(error);
    res.status(500).json(error); //determines if two users are following eacg ither
  }
};

exports.followUser = async (req, res) => {
  try {
    const user_profile = await User_profile.findById(req.body.uniqueID);
    if (user_profile.following.includes(req.body.userID));
    else user_profile.following.push(req.body.userID);
    await user_profile.save();
    res.json(user_profile);
    console.log(req.body.userID);
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


exports.searchProjects = async (req, res) => {
  try {
     
    const code_maker = await Code_maker.find({
      project_title: { $regex: req.body.projectTitle, $options: "si" }
    });
    res.json(code_maker);
    
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }  

}