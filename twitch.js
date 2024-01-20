const puppeteer = require("puppeteer");
const fs = require("fs").promises;

const SELECTORS = {
  CHANNEL: '[data-test-selector="recommended-channel"]',
  NAME: '[data-a-target="side-nav-title"]',
  TITLE: '[data-a-target="side-nav-game-title"]',
  VIEWERS: '[class="CoreText-sc-1txzju1-0 gWcDEo"]',
  IMAGE: '[class="InjectLayout-sc-1i43xsx-0 cXFDOs tw-image tw-image-avatar"]',
};

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto("https://www.twitch.tv/");

    const recomendados = await page.evaluate((selectors) => {
      const items = document.querySelectorAll(selectors.CHANNEL);
      const arr = [];

      for (let item of items) {
        const canal = {};
        canal.name = item.querySelector(selectors.NAME).innerText;
        canal.title = item.querySelector(selectors.TITLE).innerText;
        canal.viewers = item.querySelector(selectors.VIEWERS).innerText;

        const imageElement = item.querySelector(selectors.IMAGE);
        canal.image = imageElement ? imageElement.src : null;

        arr.push(canal);
      }
      return arr;
    }, SELECTORS);

    await browser.close();

    const jsonData = JSON.stringify(recomendados, null, 2);
    await fs.writeFile('recomendados.json', jsonData);
    console.log('Datos guardados en recomendados.json');
  } catch (error) {
    console.error('Error:', error);
  }
})();
