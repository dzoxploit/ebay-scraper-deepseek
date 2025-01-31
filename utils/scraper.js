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

    return new Promise((resolve, reject) => {
      response.data.on("data", (chunk) => {
        try {
          // Each chunk is a JSON string, parse it
          const jsonChunk = JSON.parse(chunk.toString());
          if (jsonChunk.response) {
            summary += jsonChunk.response;
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
    description = await generateDescriptionWithOllama(description);

    return description;
  } catch (error) {
    console.error("Error scraping product description:", error);
    throw error;
  }
};

module.exports = { scrapeProductListing, scrapeProductDescription };
