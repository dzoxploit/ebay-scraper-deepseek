const express = require("express");
const { scrapeEbayProducts } = require("../controllers/scrapeController");

const router = express.Router();

router.get("/scrape", scrapeEbayProducts);

module.exports = router;
