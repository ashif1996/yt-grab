import fs from "fs";
import path from "path";
import ytdl from "ytdl-core";
import axios from "axios";

import showFlashMessages from "../utils/messageUtils.js";
import httpStatusCodes from "../utils/httpStatusCodes.js";
import fetchCommunityPostDetails from "../utils/communityPostUtils.js";
import sendMail from "../utils/emailUtils.js";

const getHome = (req, res) => {
    const locals = { title: "Home | YTGrab" };
    return res.status(httpStatusCodes.OK).render("home", {
        locals,
        layout: "layouts/mainLayout",
    });
};

const processYouTubeVideo = async ({
    req,
    res,
    url,
    sessionKey,
    redirectUrl,
    successMessage,
}) => {
    try {
        const isValidUrl = ytdl.validateURL(url);
        if (!isValidUrl) {
            return showFlashMessages({
                req,
                res,
                type: "error",
                message: "Please enter a valid YouTube URL.",
                status: httpStatusCodes.BAD_REQUEST,
                redirectUrl: "/",
            });
        }

        let info;

        try {
            info = await ytdl.getBasicInfo(url);
        } catch (error) {
            if (error.statusCode === 410) {
                return showFlashMessages({
                    req,
                    res,
                    type: "error",
                    message: "The requested video is no longer available.",
                    status: httpStatusCodes.NOT_FOUND,
                    redirectUrl: "/",
                });
            }

            throw error;
        }

        const videoId = ytdl.getVideoID(url);
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

        const videoDetails = {
            videoId,
            title: info.videoDetails.title,
            author: info.videoDetails.author.name,
            lengthSeconds: info.videoDetails.lengthSeconds,
            viewCount: info.videoDetails.viewCount,
            thumbnailUrl,
        };

        req.session[sessionKey] = videoDetails;

        return showFlashMessages({
            req,
            res,
            type: "success",
            message: successMessage,
            status: httpStatusCodes.OK,
            redirectUrl: redirectUrl,
        });
    } catch (error) {
        console.error("Error fetching video details:", error);
        return showFlashMessages({
            req,
            res,
            type: "error",
            message: "Failed to retrieve video information. Please try again later.",
            status: httpStatusCodes.INTERNAL_SERVER_ERROR,
            redirectUrl: "/",
        });
    }
};

const processUrl = async (req, res) => {
    const { url } = req.body;

    try {
        const isValidVideoUrl = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=[a-zA-Z0-9_-]+(&[a-zA-Z0-9_=-]*)*|youtu\.be\/[a-zA-Z0-9_-]+(\?.*)?)$/;

        const isValidShortsUrl = /^(https?:\/\/)?(www\.)?(youtube\.com\/shorts\/[a-zA-Z0-9_-]+(\?.*)?)$/i;
        const isValidCommunityPostUrl = /^(https?:\/\/)?(www\.)?(youtube\.com\/(channel\/[a-zA-Z0-9_-]+\/community(\?.*)?)|(post\/[a-zA-Z0-9_-]+(\?.*)?))$/i;

        let urlType;

        if (isValidVideoUrl.test(url)) {
            urlType = "video";
        } else if (isValidShortsUrl.test(url)) {
            urlType = "shorts";
        } else if (isValidCommunityPostUrl.test(url)) {
            urlType = "community";
        } else {
            urlType = "invalid";
        }

        switch (urlType) {
            case "video":
                const processedYouTubeVideo = await processYouTubeVideo({
                    req,
                    res,
                    url,
                    sessionKey: "videoDetails",
                    redirectUrl: "/yt-video",
                    successMessage: "YouTube video retrieved successfully.",
                });

                return processedYouTubeVideo;

            case "shorts":
                const processedYouTubeShorts = await processYouTubeVideo({
                    req,
                    res,
                    url,
                    sessionKey: "shortsDetails",
                    redirectUrl: "/yt-shorts",
                    successMessage: "YouTube Shorts retrieved successfully.",
                });

                return processedYouTubeShorts;

            case "community":
                const communityPostDetails = await fetchCommunityPostDetails(url);
                req.session.communityPostDetails = communityPostDetails;

                return showFlashMessages({
                    req,
                    res,
                    type: "success",
                    message: "Community Post retrieved successfully.",
                    status: httpStatusCodes.OK,
                    redirectUrl: "/yt-community-post",
                });

            case "invalid":
            default:
                return showFlashMessages({
                    req,
                    res,
                    type: "error",
                    message: "Please enter a valid YouTube Shorts, Video, or Community Post URL.",
                    status: httpStatusCodes.BAD_REQUEST,
                    redirectUrl: "/",
                });
        }
    } catch (error) {
        console.error("Error occurred while processing URL:", error);
        return showFlashMessages({
            req,
            res,
            type: "error",
            message: "Failed to retrieve information. Please try again later.",
            status: httpStatusCodes.INTERNAL_SERVER_ERROR,
            redirectUrl: "/",
        });
    }
};

const getVideo = (req, res) => {
    const locals = { title: "YT Video | YTGrab" };
    const videoDetails = req.session.videoDetails;

    return res.status(httpStatusCodes.OK).render("videoResult", {
        locals,
        videoDetails,
        layout: "layouts/mainLayout",
    });
};

const getShorts = (req, res) => {
    const locals = { title: "YT Shorts | YTGrab" };
    const shortsDetails = req.session.shortsDetails;

    return res.status(httpStatusCodes.OK).render("shortsResult", {
        locals,
        shortsDetails,
        layout: "layouts/mainLayout",
    });
};

const getThumbnail = (req, res) => {
    const locals = { title: "Thumbnails | YTGrab" };
    const thumbnailUrl = req.session.videoDetails.thumbnailUrl;

    return res.status(httpStatusCodes.OK).render("thumbnailResult", {
        locals,
        thumbnailUrl,
        successMessage: "Thumbnail retrieved successfully.",
        layout: "layouts/mainLayout",
    });
};

const downloadThumbnail = async (req, res) => {
    const { thumbnailUrl } = req.query;

    try {
        if (!thumbnailUrl) {
            return showFlashMessages({
                req,
                res,
                type: "error",
                message: "Thumbnail URL is missing.",
                status: httpStatusCodes.NOT_FOUND,
                redirectUrl: "/yt-video/thumbnail",
            });
        }

        const response = await axios({
            url: thumbnailUrl,
            method: "GET",
            responseType: "stream",
        });

        const downloadDir = path.join(__dirname, "..", "downloads", "thumbnail");
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir);
        }

        const fileExtension = path.extname(thumbnailUrl) || ".jpg";
        const filename = `thumbnail${fileExtension}`;
        const filePath = path.join(__dirname, "..", "downloads", "thumbnail", filename);

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        writer.on("finish", () => {
            console.log("File successfully downloaded.");
            res.download(filePath, filename, (err) => {
                if (err) {
                    console.error("Error sending file:", err);
                }
                fs.unlinkSync(filePath);
            });
        });

        writer.on("error", () => {
            console.error("Error writing file:", err);
            return showFlashMessages({
                req,
                res,
                type: "error",
                message: "Error downloading thumbnail. Please try again later.",
                status: httpStatusCodes.INTERNAL_SERVER_ERROR,
                redirectUrl: "/yt-video/thumbnail",
            });
        });
    } catch (error) {
        console.error("Error downloading thumbnail:", error);
        return showFlashMessages({
            req,
            res,
            type: "error",
            message: "Error downloading thumbnail. Please try again later.",
            status: httpStatusCodes.INTERNAL_SERVER_ERROR,
            redirectUrl: "/yt-video/thumbnail",
        });
    }
};

const getCommunityPost = (req, res) => {
    const locals = { title: "Community Post | YTGrab" };
    const communityPostDetails = req.session.communityPostDetails;

    return res.status(httpStatusCodes.OK).render("communityResult", {
        locals,
        communityPostDetails,
        layout: "layouts/mainLayout",
    });
};

const downloadCommunityPost = async (req, res) => {
    const { imageUrl } = req.query;

    if (!imageUrl) {
        return showFlashMessages({
            req,
            res,
            type: "error",
            message: "Image URL is missing.",
            status: httpStatusCodes.NOT_FOUND,
            redirectUrl: "/yt-community-post",
        });
    }

    try {
        const response = await axios({
            url: imageUrl,
            method: "GET",
            responseType: "stream",
        });

        const downloadDir = path.join(__dirname, "..", "downloads", "community");
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir);
        }

        const fileExtension = path.extname(imageUrl) || ".jpg";
        const filename = `community-post-image${fileExtension}`
        const filePath = path.join(__dirname, "..", "downloads","community", filename);

        // Write the image to the file system
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        writer.on("finish", () => {
            console.log("File successfully downloaded.");
            res.download(filePath, filename, (err) => {
                if (err) {
                    console.error("Error sending file:", err);
                }
                fs.unlinkSync(filePath); // Clean up after download
            });
        });

        writer.on("error", (err) => {
            console.error("Error writing file:", err);
            return showFlashMessages({
                req,
                res,
                type: "error",
                message: "Error downloading image. Please try again later.",
                status: httpStatusCodes.INTERNAL_SERVER_ERROR,
                redirectUrl: "/yt-community-post",
            });
        });
    } catch (error) {
        console.error("Error downloading image:", error);
        return showFlashMessages({
            req,
            res,
            type: "error",
            message: "Error downloading image. Please try again later.",
            status: httpStatusCodes.INTERNAL_SERVER_ERROR,
            redirectUrl: "/yt-community-post",
        });
    }
};

const getContact = (req, res) => {
    const locals = { title: "Contact Us | YTGrab" };
    return res.status(httpStatusCodes.OK).render("contact", {
        locals,
        layout: "layouts/mainLayout",
    });
};

const processSendMail = async (req, res) => {
    const { name, email, message } = req.body;

    try {
        await sendMail(name, email, message);

        return showFlashMessages({
            req,
            res,
            type: "success",
            message: "Email sent successfully.",
            status: httpStatusCodes.OK,
            isJson: true,
            success: true,
        });
    } catch (error) {
        console.error("Failed to send email:", error);
        return showFlashMessages({
            req,
            res,
            type: "error",
            message: "Failed to send email.",
            status: httpStatusCodes.INTERNAL_SERVER_ERROR,
            isJson: true,
        });
    }
};

export default {
    getHome,
    processUrl,
    getVideo,
    getShorts,
    getThumbnail,
    downloadThumbnail,
    getCommunityPost,
    downloadCommunityPost,
    getContact,
    processSendMail,
};