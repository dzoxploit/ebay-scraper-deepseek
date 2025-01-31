const { scrapeProductDescription } = require("../utils/scraper");
const { scrapeAllPages } = require("../utils/pagination");
const { summarizeWithDeepseek } = require("../services/deepseekService");

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
          `Failed to summarize description for ${product.link}:`,
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

module.exports = { scrapeEbayProducts };
