const express = require("express");
const { scrapeEbayProducts } = require("../controllers/scrapeController");
const { scrapeShopeeProduct } = require("../controllers/scrapeController");

const router = express.Router();

router.get("/scrape", scrapeEbayProducts);
router.post("/shopee", scrapeShopeeProduct);

module.exports = router;
