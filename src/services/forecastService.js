const axios = require("axios");

async function getForecast(future_date, commodity) {
  try {
    const response = await axios.post(process.env.FORECAST_MODEL_URL, {
      future_date,
      commodity,
    });

    console.log("Response from model:", response.data);

    if (!response.data || !response.data.hasOwnProperty("predicted_price")) {
      throw new Error("Invalid forecast response from model");
    }

    return response.data;
  } catch (error) {
    console.error("Error getting forecast:", error);
    throw error;
  }
}

module.exports = {
  getForecast,
};
