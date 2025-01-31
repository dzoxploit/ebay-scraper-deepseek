const { scrapeProductListing } = require("../utils/scraper");
const config = require("../config/config");

const scrapeAllPages = async (query, totalPages = 1, limit = Infinity) => {
  const allProducts = [];

  for (let page = 1; page <= totalPages; page++) {
    if (allProducts.length >= limit) break; // Stop if limit is reached

    const url = config.EBAY_BASE_URL.replace(
      "{query}",
      encodeURIComponent(query)
    ).replace("{page}", page);
    console.log(`Scraping page ${page}: ${url}`);

    const products = await scrapeProductListing(url);

    // Push only the needed number of products
    const remainingSlots = limit - allProducts.length;
    allProducts.push(...products.slice(0, remainingSlots));
  }

  return allProducts;
};

module.exports = { scrapeAllPages };
