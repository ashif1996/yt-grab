const httpStatusCodes = require("../utils/httpStatusCodes");

const validateYouTubeVideoSession = (req, res, next) => {
    if (!req.session.videoDetails) {
        return showFlashMessages({
            req,
            res,
            type: "error",
            message: "Invalid access. Please enter a valid YouTube video URL.",
            status: httpStatusCodes.BAD_REQUEST,
            redirectUrl: "/",
        });
    }

    next();
};

const validateYouTubeShortsSession = (req, res, next) => {
    if (!req.session.shortsDetails) {
        return showFlashMessages({
            req,
            res,
            type: "error",
            message: "Invalid access. Please enter a valid YouTube Shorts URL.",
            status: httpStatusCodes.BAD_REQUEST,
            redirectUrl: "/",
        });
    }

    next();
};

const validateCommunityPostSession = (req, res, next) => {
    if (!req.session.communityPostDetails) {
        return showFlashMessages({
            req,
            res,
            type: "error",
            message: "Invalid access. Please enter a valid Community Post URL.",
            status: httpStatusCodes.BAD_REQUEST,
            redirectUrl: "/",
        });
    }
    
    next();
};

module.exports = {
    validateYouTubeVideoSession,
    validateYouTubeShortsSession,
    validateCommunityPostSession,
};