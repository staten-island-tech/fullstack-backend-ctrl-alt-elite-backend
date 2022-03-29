const res = require("express/lib/response");
const { default: mongoose } = require("mongoose");
const { Mongoose, Schema } = require("mongoose");
const User_profile = require("../Models/profiles"); // user profile model
const { rawListeners } = require("../Models/profiles");

exports.homePage = async (req, res) => {
  //basically just displaying all the data available for that user // the frontend will basically treat this as an API and take this information and use dot method to pull stuff out
  try {
    const user_profile = await User_profile.find({ _id: req.body._id });
    const code = await User_profile.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.body._id) } },
      { $unwind: "$projects" },
      { $sort: { "projects.published_code.updatedAt": -1 } },
      { $limit: 3 },
      { $group: { _id: "$_id", projects: { $push: "$projects" } } },
    ]);
    console.log(code);
    res.json({ user_profile: user_profile, most_recent_projects: code });
  } catch (error) {
    console.log(error);
  }
};

exports.createUser = async (req, res) => {
  try {
    const user_profile = new User_profile();
    user_profile.name = req.body.name;
    user_profile.user_id = req.body.email;
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
    if (userProfile.length === 0) throw "Error : user does not exist";
   // const followers = await User_profile.count({ following: req.body.email });
    res.json({
      userProfile: userProfile[0],
      // followers: followers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user_profile = await User_profile.findById(req.body._id);
     
    user_profile.name = req.body.name;
    user_profile.profile_pic = req.body.profile_pic;
    user_profile.description = req.body.description;
    user_profile.nickname = req.body.nickname;
    user_profile.given_name = req.body.given_name;
    user_profile.darkmode = req.body.darkmode;
    console.log("profile updated")
    await user_profile.save();
    res.json(user_profile);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.createProject = async (req, res) => {
  try {
    const user_profile = await User_profile.findById(req.body._id);
    user_profile.projects.push({
      project_title: req.body.project_title,
      description: req.body.description,
      published_code: {
        html: req.body.html,
        css: req.body.css,
        js: req.body.js,
      },
    });
    await user_profile.save();
    res.json(user_profile);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getProjects = async (req, res) => {
  //  modify to use parameters to limit the list to most recent
  try {
    const code = await User_profile.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.body._id) } },
      { $unwind: "$projects" },
      { $sort: { "projects.published_code.updatedAt": -1 } },
      { $limit: 3 },
      { $group: { _id: "$_id", projects: { $push: "$projects" } } },
    ]);
    res.json({ projects: code[0].projects });
  } catch (error) {
    console.log(error);
  }
};

exports.updateProject = async (req, res) => {
  try {
    const user_profile = await User_profile.findById(req.body._id).then(
      (user) => {
        const projects = user.projects.id(req.body.project_id);
        projects.project_title = req.body.new_title;
        projects.description = req.body.new_description;
        projects.published_code.html = req.body.new_html;
        projects.published_code.css = req.body.new_css;
        projects.published_code.js = req.body.new_js;
        return user.save();
      }
    );
    res.json(user_profile);
  } catch (error) {
    console.log(error);
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const user_profile = await User_profile.find({
      user_id: req.body.email,
    }).updateOne({ $pull: { projects: { _id: req.body.project_id } } });
    res.json(user_profile);
    console.log();
  } catch (error) {
    console.log(error);
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
    const name = user_profile[0].name;
    const following =
      user_profile[0].following === "undefined"
        ? 0
        : user_profile[0].following.length;

    const projects =
      user_profile[0].projects === "undefined"
        ? 0
        : user_profile[0].projects.length;

    const followers = await User_profile.count({ following: req.body.userID });
    // const projects = await Code_maker.count({ user_id: req.body.userID });

    const info = { following, followers, projects,name };
    console.log(info);
    res.json(info);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
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
