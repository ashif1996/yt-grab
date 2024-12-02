const express = require("express");
const router = express.Router();

const indexControllers = require("../controllers/indexControllers");

router.get("/", indexControllers.getHome);
router.get("/yt-shorts", indexControllers.getShorts);
router.get("/yt-community-post", indexControllers.getCommunityPost);
router.get("/contact", indexControllers.getContact);
router.get("/about", indexControllers.getAbout);

module.exports = router;