const axios = require("axios");
const cheerio = require("cheerio");

const scrapeProductListing = async (url) => {
  try {
    const { data } = await axios.get(url);
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

const scrapeProductDescription = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const description = $("#itemDescription").text().trim() || "-";
    return description;
  } catch (error) {
    console.error("Error scraping product description:", error);
    throw error;
  }
};

module.exports = { scrapeProductListing, scrapeProductDescription };
