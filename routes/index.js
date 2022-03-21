const express = require("express");

const router = new express.Router(); //instantiate express router
const controller = require("../Controllers/Controllers");

router.get("/", controller.homePage);
router.post("/createUser", controller.createUser);
router.post("/getProfile", controller.getProfile);
router.patch("/profile", controller.updateProfile);
router.patch("/newProject", controller.createProject);
router.get("/getProjects", controller.getProjects);
router.patch("/project", controller.updateProject);
// router.post("/updateFollowing", controller.updateFollowing);
router.get("/getFollowing", controller.getFollowing);
router.get("/getFollowers", controller.getFollowers);
router.post("/followUser", controller.followUser);

router.post("/unFollow", controller.unFollow);
router.post("/follow", controller.follow);
router.get("/getFollowInfo", controller.getFollowInfo);
router.get("/getInfo", controller.getInfo);
module.exports = router;
