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
router.get("/yt-video/thumbnail", validateYouTubeVideoSession, indexControllers.getThumbnail);
router.get("/yt-video/thumbnail/download-thumbnail", indexControllers.downloadThumbnail);
router.get("/yt-shorts", validateYouTubeShortsSession, indexControllers.getShorts);

router.get("/yt-community-post", validateCommunityPostSession, indexControllers.getCommunityPost);
router.get("/yt-community-post/download-community-post/", indexControllers.downloadCommunityPost);

router.get("/contact", indexControllers.getContact);
router.post("/contact/send-email", indexControllers.processSendMail);

module.exports = router;