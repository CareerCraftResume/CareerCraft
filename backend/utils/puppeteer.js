const puppeteer = require('puppeteer');

// Function to get browser instance
async function getBrowser() {
    try {
        return await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--window-size=1920x1080'
            ],
            executablePath: process.env.CHROME_PATH || undefined // Will use system Chrome if available
        });
    } catch (error) {
        console.error('Error launching browser:', error);
        throw error;
    }
}

module.exports = {
    getBrowser
};
