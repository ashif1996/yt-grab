const getHome = (req, res) => {
    const locals = { title: "Home | YTGrab" };
    return res.render("home", {
        locals,
        layout: "layouts/mainLayout",
    });
};

const getShorts = (req, res) => {
    const locals = { title: "YT Shorts | YTGrab" };
    return res.render("shortsResult", {
        locals,
        layout: "layouts/mainLayout",
    });
};

const getCommunityPost = (req, res) => {
    const locals = { title: "YT Community Post | YTGrab" };
    return res.render("communityResult", {
        locals,
        layout: "layouts/mainLayout",
    });
};

const getContact = (req, res) => {
    const locals = { title: "Contact Us | YTGrab" };
    return res.render("contact", {
        locals,
        layout: "layouts/mainLayout",
    });
};

const getAbout = (req, res) => {
    const locals = { title: "About Us | YTGrab" };
    return res.render("about", {
        locals,
        layout: "layouts/mainLayout",
    });
};

module.exports = {
    getHome,
    getShorts,
    getCommunityPost,
    getContact,
    getAbout,
};