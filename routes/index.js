const express = require("express");

const router = new express.Router(); //instantiate express router
const controller = require("../Controllers/Controllers");

router.post("/", controller.homePage);
router.post("/createUser", controller.createUser);
router.post("/createProject", controller.createProject);
router.get("/getProfile", controller.getProfile);
router.post("/add2", controller.createCode);
// router.post("/updateFollowing", controller.updateFollowing);
router.post("/profile", controller.updateProfile);
router.get("/getFollowing", controller.getFollowing);
router.get("/getFollowers", controller.getFollowers);
router.post("/followUser", controller.followUser);
router.get("/getProjects", controller.getProjects);
router.post("/unFollow", controller.unFollow);
router.post("/follow", controller.follow);
router.get("/getFollowInfo", controller.getFollowInfo);
router.get("/getInfo", controller.getInfo);
module.exports = router;
