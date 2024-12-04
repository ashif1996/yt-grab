const express = require("express");
const router = express.Router();

const indexControllers = require("../controllers/indexControllers");

const {
    validateYouTubeVideoSession,
    validateYouTubeShortsSession,
    validateCommunityPostSession,
} = require("../middlewares/validateContentAccess");

router.get("/", indexControllers.getHome);

router.post("/process-url", indexControllers.processUrl);

router.get("/yt-video", validateYouTubeVideoSession, indexControllers.getVideo);
router.get("/yt-shorts", validateYouTubeShortsSession, indexControllers.getShorts);

router.get("/yt-community-post", validateCommunityPostSession, indexControllers.getCommunityPost);
router.get("/download-community-post/", indexControllers.downloadCommunityPost);

router.get("/contact", indexControllers.getContact);

module.exports = router;