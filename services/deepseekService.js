const axios = require("axios");
const config = require("../config/config");

const summarizeWithDeepseek = async (text) => {
  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/summarize", // Replace with actual Deepseek API endpoint
      { text },
      { headers: { Authorization: `Bearer ${config.DEEPSEEK_API_KEY}` } }
    );
    return response.data.summary;
  } catch (error) {
    console.error("Error summarizing with Deepseek:", error);
    throw error;
  }
};

module.exports = { summarizeWithDeepseek };
