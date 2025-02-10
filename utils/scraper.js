const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer-extra");
const https = require("https");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

// Define HTTPS Agent to bypass certificate validation
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // Disable certificate validation
});

const scrapeProductListing = async (url) => {
  try {
    const { data } = await axios.get(url, { httpsAgent });
    const $ = cheerio.load(data);

    const products = [];

    $(".s-item").each((index, element) => {
      const product = {
        name: $(element).find(".s-item__title").text().trim(),
        price: $(element).find(".s-item__price").text().trim() || "-",
        link: $(element).find(".s-item__link").attr("href"),
      };
      products.push(product);
    });

    return products;
  } catch (error) {
    console.error("Error scraping product listings:", error);
    throw error;
  }
};

const generateDescriptionWithOllama = async (text) => {
  try {
    const response = await axios({
      method: "post",
      url: "http://127.0.0.1:11434/api/generate", // Ollama API endpoint
      data: {
        model: "deepseek-coder", // Specify the model
        prompt: `Generate a detailed and engaging product description based on the following information: ${text}`,
        max_tokens: 20, // Adjust as needed
      },
      httpsAgent, // Use HTTPS Agent
      responseType: "stream", // Handle streaming response
    });

    let description = "";

    return new Promise((resolve, reject) => {
      response.data.on("data", (chunk) => {
        try {
          // Each chunk is a JSON string, parse it
          const jsonChunk = JSON.parse(chunk.toString());
          if (jsonChunk.response) {
            description += jsonChunk.response;
          }
        } catch (error) {
          console.error("Error parsing chunk:", error);
        }
      });

      response.data.on("end", () => resolve(description.trim()));
      response.data.on("error", (error) => reject(error));
    });
  } catch (error) {
    console.error("Error generating description with Ollama:", error);
    throw error;
  }
};

const scrapeProductDescription = async (description) => {
  try {
    const enhancedDescription = await generateDescriptionWithOllama(
      description
    );
    return enhancedDescription;
  } catch (error) {
    console.error("Error scraping product description:", error);
    throw error;
  }
};

const loginWithGoogleAndScrape = async (url, email, password) => {
  const proxy = {
    host: "proxy.toolip.io",
    port: "311**",
    username:
      "8c5906b99fbd1c0bcd0f916d545c565a2cf0804c46434fc3b5d8a9f097276a746e4add659a383a27d5396fdf***",
    password: "s8vgpx30***",
  };

  const browser = await puppeteer.launch({
    headless: false, // Set headless: true for production
    args: [
      `--proxy-server=${proxy.host}:${proxy.port}`,
      `--proxy-auth=${proxy.username}:${proxy.password}`,
    ],
  });

  const page = await browser.newPage();

  // Authenticate with the proxy (if required)
  await page.authenticate({
    username: proxy.username,
    password: proxy.password,
  });

  // Buka halaman login Shopee
  await page.goto(
    "https://shopee.tw/buyer/login?next=https%3A%2F%2Fshopee.tw%2F---i.43269385.23975514969",
    { waitUntil: "networkidle2" }
  );

  // Klik tombol Login dengan Google
  await page.waitForSelector("button:has(.QtJO69.social-white-google-png)");
  await page.click("button:has(.QtJO69.social-white-google-png)");

  // Tunggu tab baru untuk login Google
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const pages = await browser.pages();
  const googlePage = pages[pages.length - 1]; // Ambil tab terakhir (Google Login)
  await googlePage.bringToFront();

  // Masukkan email
  await googlePage.waitForSelector('input[type="email"]', { visible: true });
  await googlePage.type('input[type="email"]', email);
  await googlePage.keyboard.press("Enter");

  // Masukkan password
  await googlePage.waitForSelector('input[type="password"]', { visible: true });
  await googlePage.type('input[type="password"]', password);
  await googlePage.keyboard.press("Enter");

  // Tunggu redirect ke Shopee
  await googlePage.waitForNavigation({ waitUntil: "networkidle2" });

  // Kembali ke halaman Shopee
  await page.bringToFront();
  await new Promise((resolve) => setTimeout(resolve, 7000));

  await page.waitForNavigation({ waitUntil: "networkidle2" });

  // Navigate to the product page
  const productUrl = "https://shopee.tw/---i.43269385.23975514969";
  await page.goto(productUrl, { waitUntil: "networkidle2" });

  // Wait for the product details to load
  await page.waitForSelector("h1.product-name", { visible: true });

  const productDetails = await page.evaluate(() => {
    const title = document.querySelector("h1.product-name")?.textContent.trim();
    const price = document
      .querySelector("div.product-price")
      ?.textContent.trim();
    const description = document
      .querySelector("div.product-description")
      ?.textContent.trim();
    return { title, price, description };
  });

  console.log(productDetails);

  await browser.close();
  return productDetails;
};

//async function

module.exports = {
  scrapeProductListing,
  scrapeProductDescription,
  loginWithGoogleAndScrape,
};
