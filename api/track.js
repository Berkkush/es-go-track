const puppeteer = require("puppeteer");

module.exports = async (req, res) => {
  const trackingNumber = req.query.number;

  if (!trackingNumber) {
    return res.status(400).json({ error: "Takip numarası girilmedi." });
  }

  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();

  await page.goto(`https://t.17track.net/en#nums=${trackingNumber}`, { waitUntil: "networkidle0" });
  await page.waitForSelector('.tracklist-status');

  const result = await page.evaluate(() => {
    const status = document.querySelector('.tracklist-status').innerText;
    return status;
  });

  await browser.close();

  res.status(200).json({ trackingNumber, status: result });
};
