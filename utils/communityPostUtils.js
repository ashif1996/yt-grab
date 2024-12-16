import puppeteer from "puppeteer";

const fetchCommunityPostDetails = async (url) => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.setRequestInterception(true);
        page.on("request", (req) => {
            const resourceType = req.resourceType();
            if (["stylesheet", "font"].includes(resourceType)) {
                req.abort();
            } else {
                req.continue();
            }
        });

        await page.goto(url, { waitUntil: 'domcontentloaded' });

        await Promise.all([
            page.waitForSelector("#content-text", { timeout: 5000 }),
            page.waitForSelector("#image-container img", { timeout: 5000 }),
        ]);

        const communityPostDetails = await page.evaluate(() => {
            const caption = document.querySelector("#content-text")
                ? document.querySelector("#content-text").innerText.trim()
                : "No caption provided";
            const image = document.querySelector("#image-container img")
                ? document.querySelector("#image-container img").src
                : "No image available";
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

export default fetchCommunityPostDetails;