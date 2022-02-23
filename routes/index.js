const express = require("express");
const router = new express.Router(); //instantiate express router
const shopController = require("../Controllers/shopControllers");

router.post("/", shopController.homePage);
router.post("/insertProfile", shopController.createUser);
router.post("/getProfile", shopController.getProfile);
router.post("/add2", shopController.createCode);
router.post("/updateFollowing", shopController.updateFollowing);
router.post("/profile", shopController.updateProfile);
module.exports = router;
