const axios = require("axios");
const cheerio = require("cheerio");
const https = require("https");

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

// Function to generate or enhance product description using Ollama API
const generateDescriptionWithOllama = async (text) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:11434/api/generate", // Ollama API endpoint
      {
        model: "deepseek-coder", // Specify the model
        prompt: `Generate a detailed and engaging product description based on the following information: ${text}`,
        max_tokens: 20, // Adjust as needed
      },
      { httpsAgent } // Use HTTPS Agent
    );

    // Ollama API streams responses, so we need to concatenate them
    let description = "";
    for (const chunk of response.data) {
      description += chunk.response;
    }

    return description.trim();
  } catch (error) {
    console.error("Error generating description with Ollama:", error);
    throw error;
  }
};

const scrapeProductDescription = async (url) => {
  try {
    const { data } = await axios.get(url, { httpsAgent });
    const $ = cheerio.load(data);
    let description = $("#itemDescription").text().trim() || "-";

    // Enhance or generate description using Ollama
    if (description !== "-") {
      description = await generateDescriptionWithOllama(description);
    }

    return description;
  } catch (error) {
    console.error("Error scraping product description:", error);
    throw error;
  }
};

module.exports = { scrapeProductListing, scrapeProductDescription };
