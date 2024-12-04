const puppeteer = require("puppeteer");

const fetchCommunityPostDetails = async (url) => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'domcontentloaded' });

        await page.waitForSelector('#content-text');
        await page.waitForSelector('#image-container img');

        const communityPostDetails = await page.evaluate(() => {
            const caption = document.querySelector("#content-text") ? document.querySelector("#content-text").innerText.trim() : "No caption provided";
            const image = document.querySelector('#image-container img') ? document.querySelector('#image-container img').src : "No image available";
            return { caption, image };
        });

        await browser.close();

        return {
            ...communityPostDetails,
            url,
        };
    } catch (error) {
        console.error("Error fetching Community Post details:", error);
        throw new Error("Unable to fetch Community Post details.");
    }
};

module.exports = fetchCommunityPostDetails;