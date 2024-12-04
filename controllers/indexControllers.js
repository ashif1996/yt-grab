const fs = require("fs");
const path = require("path");
const ytdl = require("ytdl-core");
const axios = require("axios");
const httpStatusCodes = require("../utils/httpStatusCodes");
const fetchCommunityPostDetails = require("../utils/communityPostUtils");

const getHome = (req, res) => {
    const locals = { title: "Home | YTGrab" };
    return res.status(httpStatusCodes.OK).render("home", {
        locals,
        layout: "layouts/mainLayout",
    });
};

const processYouTubeVideo = async (url, sessionKey, req, res, redirectUrl, successMessage) => {
    const isValidUrl = ytdl.validateURL(url);
    if (!isValidUrl) {
        req.flash("error", "Please enter a valid YouTube URL.");
        return res.redirect(httpStatusCodes.BAD_REQUEST, "/");
    }

    const info = await ytdl.getInfo(url);
    const videoId = info.videoDetails.videoId;

    const bestQualityFormat = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });

    const videoDetails = {
        videoId,
        title: info.videoDetails.title,
        author: info.videoDetails.author.name,
        lengthSeconds: info.videoDetails.lengthSeconds,
        viewCount: info.videoDetails.viewCount,
        quality: bestQualityFormat,
    };

    req.session[sessionKey] = videoDetails;

    req.flash("success", successMessage);
    return res.redirect(redirectUrl);
};

const processUrl = async (req, res) => {
    const { url } = req.body;

    try {
        const isValidVideoUrl = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=[a-zA-Z0-9_-]+(\?.*)?)$/;
        const isValidShortsUrl = /^(https?:\/\/)?(www\.)?(youtube\.com\/shorts\/[a-zA-Z0-9_-]+(\?.*)?)$/;
        const isValidCommunityPostUrl = /^(https?:\/\/)?(www\.)?(youtube\.com\/post\/[a-zA-Z0-9_-]+(\?.*)?)$/;

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
                return await processYouTubeVideo(url, "videoDetails", req, res, "/yt-video", "YouTube video retrieved successfully.");

            case "shorts":
                return await processYouTubeVideo(url, "shortsDetails", req, res, "/yt-shorts", "YouTube Shorts retrieved successfully.");

            case "community":
                const communityPostDetails = await fetchCommunityPostDetails(url);
                req.session.communityPostDetails = communityPostDetails;

                req.flash("success", "Community Post retrieved successfully.");
                return res.redirect("/yt-community-post");

            case "invalid":
            default:
                req.flash("error", "Please enter a valid YouTube Shorts, Video, or Community Post URL.");
                return res.redirect("/");
        }
    } catch (error) {
        console.error("Error occurred while processing URL:", error);

        req.flash("error", "Failed to retrieve information. Please try again later.");
        return res.redirect(httpStatusCodes.INTERNAL_SERVER_ERROR, "/");
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
        req.flash("error", "Image URL is missing.");
        return res.redirect(httpStatusCodes.BAD_REQUEST, "/yt-community-post");
    }

    try {
        const response = await axios({
            url: imageUrl,
            method: "GET",
            responseType: "stream",
        });

        const downloadFolder = path.join(__dirname, "..", "downloads");
        if (!fs.existsSync(downloadFolder)) {
            fs.mkdirSync(downloadFolder);
        }

        const fileExtension = path.extname(imageUrl) || ".jpg";
        const filename = `community-post-image${fileExtension}`
        const filePath = path.join(__dirname, "..", "downloads", filename);

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

            req.flash("error", "Error downloading image. Please try again later.");
            return res.redirect("/yt-community-post");
        });
    } catch (error) {
        console.error("Error downloading image:", error);

        req.flash("error", "Error downloading image. Please try again later.");
        return res.redirect(httpStatusCodes.INTERNAL_SERVER_ERROR, "/yt-community-post");
    }
};

const getContact = (req, res) => {
    const locals = { title: "Contact Us | YTGrab" };
    return res.status(httpStatusCodes.OK).render("contact", {
        locals,
        layout: "layouts/mainLayout",
    });
};

module.exports = {
    getHome,
    processUrl,
    getVideo,
    getShorts,
    getCommunityPost,
    downloadCommunityPost,
    getContact,
};