function successResponse(res, statusCode, message, data = null) {
  res.status(statusCode).json({
    error: null,
    message,
    data,
  });
}

function errorResponse(res, statusCode, message) {
  res.status(statusCode).json({
    error: true,
    message,
    data: null,
  });
}

module.exports = {
  successResponse,
  errorResponse,
};
