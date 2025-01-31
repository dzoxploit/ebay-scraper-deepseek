const { scrapeProductDescription } = require("../utils/scraper");
const { scrapeAllPages } = require("../utils/pagination");
const { summarizeWithDeepseek } = require("../services/deepseekService");

const scrapeEbayProducts = async (req, res) => {
  try {
    const { query = "nike", pages = 1 } = req.query;

    // Scrape product listings
    const products = await scrapeAllPages(query, pages);

    // Scrape product descriptions and summarize using Deepseek
    for (const product of products) {
      try {
        product.description = await scrapeProductDescription(product.link);
      } catch (error) {
        console.error(
          `Failed to scrape description for ${product.link}:`,
          error
        );
        product.description = null;
      }

      try {
        product.summary = product.description
          ? await summarizeWithDeepseek(product.description)
          : null;
      } catch (error) {
        console.error(
          `Failed to summarize description for ${product.link}:`,
          error
        );
        product.summary = null;
      }
    }

    res.json(products);
  } catch (error) {
    console.error("Error scraping eBay:", error);
    res.status(500).json({ error: "Failed to scrape data" });
  }
};

module.exports = { scrapeEbayProducts };
