const forecastService = require("../services/forecastService");
const { successResponse, errorResponse } = require("../utils/responseUtils");

exports.getForecast = async (req, res) => {
  try {
    const { future_date, commodity } = req.body;

    if (!future_date || !commodity) {
      return errorResponse(
        res,
        400,
        "Missing required fields: future_date, commodity"
      );
    }

    const forecastResult = await forecastService.getForecast(
      future_date,
      commodity
    );
    successResponse(
      res,
      200,
      "Forecast retrieved successfully",
      forecastResult
    );
  } catch (error) {
    console.error('Error in getForecast:', error);
    if (error.message === 'Invalid forecast response from model') {
      errorResponse(res, 400, 'Invalid request or model error');
    } else {
      errorResponse(res, 500, 'Failed to get forecast');
    }
  }
};
