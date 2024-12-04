const httpStatusCodes = require("../utils/httpStatusCodes");

const validateYouTubeVideoSession = (req, res, next) => {
    if (!req.session.videoDetails) {
        req.flash("error", "Invalid access. Please enter a valid YouTube video URL.");
        return res.redirect(httpStatusCodes.BAD_REQUEST, "/");
    }
    next();
};

const validateYouTubeShortsSession = (req, res, next) => {
    if (!req.session.shortsDetails) {
        req.flash("error", "Invalid access. Please enter a valid YouTube Shorts URL.");
        return res.redirect(httpStatusCodes.BAD_REQUEST, "/");
    }
    next();
};

const validateCommunityPostSession = (req, res, next) => {
    if (!req.session.communityPostDetails) {
        req.flash("error", "Invalid access. Please enter a valid Community Post URL.");
        return res.redirect(httpStatusCodes.BAD_REQUEST, "/");
    }
    next();
};

module.exports = {
    validateYouTubeVideoSession,
    validateYouTubeShortsSession,
    validateCommunityPostSession,
};