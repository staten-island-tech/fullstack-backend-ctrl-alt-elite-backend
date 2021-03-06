const res = require("express/lib/response");

const { default: mongoose } = require("mongoose");
const { Mongoose, Schema } = require("mongoose");
const User_profile = require("../Models/profiles"); // user profile model
const { rawListeners } = require("../Models/profiles");
require("dotenv").config({ path: "variables.env" });
const jwt = require("jsonwebtoken");

exports.authenticateToken = async (req, res, next) => {
  const token = req.headers["authorization"];

  //
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    next();
  });
};

exports.login = async (req, res) => {
  const username = req.body.username;
  const user = { name: username };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

  res.json(accessToken);
};
// exports.homePage = async (req, res) => {
//   //basically just displaying all the data available for that user // the frontend will basically treat this as an API and take this information and use dot method to pull stuff out
//   try {
//     const user_profile = await User_profile.find({ _id: req.body._id });
//     const code = await User_profile.aggregate([
//       { $match: { _id: mongoose.Types.ObjectId(req.body._id) } },
//       { $unwind: "$projects" },
//       { $sort: { "projects.published_code.updatedAt": -1 } },
//       { $limit: 3 },
//       { $group: { _id: "$_id", projects: { $push: "$projects" } } },
//     ]);
//     res.json({ user_profile: user_profile, most_recent_projects: code });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

exports.createUser = async (req, res) => {
  try {
    const user_profile = new User_profile();

    user_profile.name = req.body.name;
    user_profile.user_id = req.body.email;
    user_profile.given_name = req.body.given_name;
    user_profile.profile_pic = req.body.picture;
    user_profile.nickname = req.body.nickname;
    const user_profile2 = await User_profile.create(user_profile);

    res.json(user_profile2);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userProfile = await User_profile.find({ user_id: req.body.email });
    if (userProfile.length === 0) {
      const error = new Error("Error : user does not exist");
      error.code = 999;
      throw error;
    }
    // const followers = await User_profile.count({ following: req.body.email });
    res.json({
      userProfile: userProfile[0],
      // followers: followers,
    });
  } catch (error) {
    // if (error.code === 999) 
    //     ;
    // else 
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
      { $sort: { "projects.updatedAt": -1 } },
      { $limit: 100 },
      { $group: { _id: "$_id", projects: { $push: "$projects" } } },
    ]);
    res.json({ projects: code[0].projects });
  } catch (error) {
    // console.log(error);
    res.json({ projects: [] });
  }
};

exports.displayFollowingProjects = async (req, res) => {
  try {
    const user_profile = await User_profile.find({ _id: req.body._id });
    const following = [];
    const allFollowingProjects = [];
    // Gets all the people you are following
    following.push(...user_profile[0].following);
    // Gets all the projects
    const code = await User_profile.aggregate([
      { $unwind: "$projects" },
      { $sort: { "projects.updatedAt": -1 } },
      { $limit: 100 },
    ]);
    // For each individual project
    code.forEach((object) => {
      // For each user that you are following
      following.forEach((user) => {
        // If for the individual project's user_id is one of the users you're following
        if (object.user_id === user) {
          allFollowingProjects.push(object);
        }
      });
    });
    res.json(allFollowingProjects);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.displayTrendingProjects = async (req, res) => {
  try {
    ordered = [];
    const code = await User_profile.aggregate([
      { $unwind: "$projects" },
      { $sort: { "projects.updatedAt": -1 } },
      { $limit: 100 },
    ]);
    code.sort(function (a, b) {
      return b.projects.project_likes.length - a.projects.project_likes.length;
    });
    res.json(code);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
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
    res.status(500).json(error);
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

exports.addLike = async (req, res) => {
  try {
    let userProfile = await User_profile.find({ user_id: req.body.userID });
    userProfile = await User_profile.findById(userProfile[0]._id);
    userProfile.projects.forEach((project) => {
      if (project.project_title === req.body.projectTitle) {
        project.project_likes.push(req.body.followUserID);
      }
    });
    await userProfile.save();
    res.json(userProfile);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.removeLike = async (req, res) => {
  try {
    let userProfile = await User_profile.find({ user_id: req.body.userID });
    userProfile = await User_profile.findById(userProfile[0]._id);
    userProfile.projects.forEach((project) => {
      if (project.project_title === req.body.projectTitle) {
        project.project_likes.forEach((e, index) => {
          if (e === req.body.followUserID) {
            project.project_likes.splice(index);
          }
        });
      }
    });
    await userProfile.save();
    res.json(userProfile);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.unFollow = async (req, res) => {
  try {
    let userProfile = await User_profile.find({ user_id: req.body.userID });
    userProfile = await User_profile.findById(userProfile[0]._id);
    userProfile.following = userProfile.following.filter(
      (item) => item != req.body.unfollowUserID
    );
    await userProfile.save();
    res.json(userProfile);
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
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getInfo = async (req, res) => {
  try {
    const user_profile = await User_profile.find({ user_id: req.body.userID });
    const name = user_profile[0].name;
    const profilePic = user_profile[0].profile_pic;
    const userID = user_profile[0].user_id;
    const mongoID = user_profile[0]._id;
    const following =
      user_profile[0].following === "undefined"
        ? 0
        : user_profile[0].following.length;

    const projects =
      user_profile[0].projects === "undefined"
        ? 0
        : user_profile[0].projects.length;

    const followers = await User_profile.count({ following: req.body.userID });

    const info = {
      following,
      followers,
      projects,
      name,
      profilePic,
      mongoID,
      userID,
    };

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
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.searchProjects = async (req, res) => {
  try {
    const projects = await User_profile.aggregate([
      { $unwind: "$projects" },
      {
        $match: {
          "projects.project_title": {
            $regex: req.body.projectTitle,
            $options: "si",
          },
        },
      },
      { $limit: 100 },
    ]);

    res.json(projects);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
