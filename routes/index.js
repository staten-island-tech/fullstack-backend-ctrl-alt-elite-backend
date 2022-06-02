const express = require("express");

const router = new express.Router(); //instantiate express router
const controller = require("../Controllers/Controllers");

// router.get("/", controller.authenticateToken, controller.homePage);
router.post("/createUser", controller.authenticateToken, controller.createUser);
router.post("/getProfile", controller.authenticateToken, controller.getProfile);
router.post("/profile", controller.authenticateToken, controller.updateProfile);
router.patch("/newProject", controller.authenticateToken,controller.createProject);
router.post("/getProjects",controller.authenticateToken, controller.getProjects);
router.post(
  "/getFollowingProjects",
  controller.authenticateToken,
  controller.displayFollowingProjects
);
router.get(
  "/getTrendingProjects",
  controller.authenticateToken,
  controller.displayTrendingProjects
);
router.patch(
  "/project",
  controller.authenticateToken,
  controller.updateProject
);
router.delete(
  "/deleteProject",
  controller.authenticateToken,
  controller.deleteProject
);
router.post("/addLike", controller.authenticateToken, controller.addLike);
router.post("/removeLike", controller.authenticateToken, controller.removeLike);

router.post(
  "/getFollowing",
  controller.authenticateToken,
  controller.getFollowing
);
router.post(
  "/getFollowers",
  controller.authenticateToken,
  controller.getFollowers
);
router.post("/followUser", controller.authenticateToken, controller.followUser);
router.post("/unFollow", controller.authenticateToken, controller.unFollow);
router.post("/follow", controller.authenticateToken, controller.follow);
router.post(
  "/getFollowInfo",
  controller.authenticateToken,
  controller.getFollowInfo
);
router.post("/getInfo", controller.authenticateToken, controller.getInfo);
router.post(
  "/searchProjects",
  controller.authenticateToken,
  controller.searchProjects
);
router.post("/login", controller.login);
module.exports = router;
