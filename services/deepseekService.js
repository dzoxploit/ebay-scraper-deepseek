const axios = require("axios");
const https = require("https");
const { loginWithGoogleAndScrape } = require("../utils/scraper");

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // Disable certificate validation
});

const summarizeWithDeepseek = async (text) => {
  try {
    const response = await axios({
      method: "post",
      url: "http://127.0.0.1:11434/api/generate", // Ollama API endpoint
      data: {
        model: "deepseek-coder", // Specify the model
        prompt: `Summarize the following product description: ${text}`,
        max_tokens: 20, // Adjust as needed
      },
      httpsAgent, // Maintain connection
      responseType: "stream", // Handle streaming response
    });

    let summary = "";

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

      response.data.on("end", () => resolve(summary.trim()));
      response.data.on("error", (error) => reject(error));
    });
  } catch (error) {
    console.error("Error summarizing with Ollama:", error);
    throw error;
  }
};

const scrapeProductDetails = async (url, email, password)  => {
  try {
    const productDetails = await loginWithGoogleAndScrape(url, email, password);
    return productDetails;
  } catch (error) {
    throw new Error(`Failed to scrape product details: ${error.message}`);
  }
}
module.exports = { summarizeWithDeepseek, scrapeProductDetails };
