const { scrapeProductListing } = require("../utils/scraper");
const config = require("../config/config");

const scrapeAllPages = async (query, totalPages = 1) => {
  const allProducts = [];

  for (let page = 1; page <= totalPages; page++) {
    const url = config.EBAY_BASE_URL.replace(
      "{query}",
      encodeURIComponent(query)
    ).replace("{page}", page);
    console.log(`Scraping page ${page}: ${url}`);

    const products = await scrapeProductListing(url);
    allProducts.push(...products);
  }

  return allProducts;
};

module.exports = { scrapeAllPages };
