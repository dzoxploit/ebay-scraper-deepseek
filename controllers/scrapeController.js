const { scrapeProductDescription } = require("../utils/scraper");

const { scrapeAllPages } = require("../utils/pagination");
const {
  summarizeWithDeepseek,
  scrapeProductDetails,
} = require("../services/deepseekService");

const scrapeEbayProducts = async (req, res) => {
  try {
    const { query = "nike", pages = 1, limit = 10 } = req.query;

    // Scrape product listings
    const products = await scrapeAllPages(query, pages, limit);

    // Scrape product descriptions and summarize using Deepseek
    for (const product of products) {
      try {
        product.description = await scrapeProductDescription(product.name);
      } catch (error) {
        console.error(
          `Failed to scrape description for ${product.link}:`,
          error
        );
        product.description = error.message;
      }

      try {
        product.summary = await summarizeWithDeepseek(product.name);
      } catch (error) {
        console.error(
          `Failed to summarize description for ${product.name}:`,
          error
        );
        product.summary = error.message;
      }
    }

    res.json(products);
  } catch (error) {
    console.error("Error scraping eBay:", error);
    res.status(500).json({ error: "Failed to scrape data" });
  }
};

const scrapeShopeeProduct = async (req, res) => {
  const { url, email, password } = req.body;

  if (!url || !email || !password) {
    return res
      .status(400)
      .json({ error: "URL, email, and password are required" });
  }

  try {
    const productDetails = await scrapeProductDetails(url, email, password);
    res.status(200).json(productDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { scrapeEbayProducts, scrapeShopeeProduct };
