import puppeteer from "puppeteer";

const fetchCommunityPostDetails = async (url) => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Block unnecessary requests (e.g., stylesheets and fonts)
        await page.setRequestInterception(true);
        page.on("request", (req) => {
            if (["stylesheet", "font"].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        // Navigate to the URL and wait for content
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        // Extract data
        const communityPostDetails = await page.evaluate(() => ({
            caption: document.querySelector("#content-text")?.innerText.trim() || "No caption provided",
            image: document.querySelector("#image-container img")?.src || "No image available",
        }));

        await browser.close();

        return { ...communityPostDetails, url };
    } catch (error) {
        console.error("Error:", error.message);
        throw new Error("Unable to fetch Community Post details.");
    }
};

export default fetchCommunityPostDetails;