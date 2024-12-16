import express from "express";
const router = express.Router();

import indexControllers from "../controllers/indexControllers.js";

import { 
    validateYouTubeVideoSession, 
    validateYouTubeShortsSession, 
    validateCommunityPostSession 
} from "../middlewares/validateContentAccess.js";

router.get("/", indexControllers.getHome);

router.post("/process-url", indexControllers.processUrl);

router.get("/yt-video", validateYouTubeVideoSession, indexControllers.getVideo);
router.get("/yt-video/thumbnail", validateYouTubeVideoSession, indexControllers.getThumbnail);
router.get("/yt-video/thumbnail/download-thumbnail", validateYouTubeVideoSession, indexControllers.downloadThumbnail);
router.get("/yt-shorts", validateYouTubeShortsSession, indexControllers.getShorts);

router.get("/yt-community-post", validateCommunityPostSession, indexControllers.getCommunityPost);
router.get("/yt-community-post/download-community-post/", validateCommunityPostSession, indexControllers.downloadCommunityPost);

router.get("/contact", indexControllers.getContact);
router.post("/contact/send-email", indexControllers.processSendMail);

export default router;