const puppeteer = require("puppeteer");
const fs = require("fs").promises; // Importa el módulo fs para trabajar con archivos con promesas

(async () => {
  try {
    // Iniciar el navegador
    const browser = await puppeteer.launch({
      headless: false, // Muestra el navegador en pantalla
      defaultViewport: null, // Usa la configuración de vista predeterminada
    });

    // Abrir una nueva página
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 }); // Puedes ajustar el ancho y alto según tus necesidades
    await page.goto("https://www.twitch.tv/");

    // Recopilar datos
    const recomendados = await page.evaluate(() => {
      const items = document.querySelectorAll('[data-test-selector="recommended-channel"]');
      const arr = [];

      for (let item of items) {
        const canal = {};
        canal.name = item.querySelector('[data-a-target="side-nav-title"]').innerText;
        canal.title = item.querySelector('[class="Layout-sc-1xcs6mc-0 eMtMuE side-nav-card__metadata"]').innerText;
        canal.viewers = item.querySelector('[class="CoreText-sc-1txzju1-0 dSWFc"]').innerText;
        canal.image = item.querySelector('[class="InjectLayout-sc-1i43xsx-0 gljEcG tw-image tw-image-avatar"]').src;
    

        arr.push(canal);
      }
      return arr;
    });

    // Cerrar el navegador
    await browser.close();

    // Guardar los datos en un archivo JSON
    const jsonData = JSON.stringify(recomendados, null, 2); // Formatea con sangría
    await fs.writeFile('recomendados.json', jsonData);
    console.log('Datos guardados en recomendados.json');
  } catch (error) {
    console.error('Error:', error);
  }
})();
