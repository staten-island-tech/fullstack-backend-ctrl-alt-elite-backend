const express = require("express");

const router = new express.Router(); //instantiate express router
const controller = require("../Controllers/Controllers");

router.get("/", controller.homePage);
router.post("/createUser", controller.createUser);
router.post("/getProfile", controller.getProfile);
router.post("/profile", controller.updateProfile);
router.patch("/newProject", controller.createProject);
router.post("/getProjects", controller.getProjects);
router.post("/getFollowingProjects", controller.displayFollowingProjects);
router.post("/getTrendingProjects", controller.displayTrendingProjects);
router.patch("/project", controller.updateProject);
router.delete("/deleteProject", controller.deleteProject);
// router.post("/updateFollowing", controller.updateFollowing);
router.post("/getFollowing", controller.getFollowing);
router.post("/getFollowers", controller.getFollowers);
router.post("/followUser", controller.followUser);
router.post("/unFollow", controller.unFollow);
router.post("/follow", controller.follow);
router.post("/getFollowInfo", controller.getFollowInfo);
router.post("/getInfo", controller.getInfo);
router.post("/searchProjects", controller.searchProjects);
module.exports = router;
