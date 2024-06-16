const authService = require("../services/authService");
const { successResponse, errorResponse } = require("../utils/responseUtils");

exports.registerUser = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    successResponse(res, 201, "User registered successfully", {
      uid: result.uid,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    errorResponse(res, 400, error.message || "User registration failed");
  }
};

exports.registerExpert = async (req, res) => {
  try {
    const result = await authService.registerExpert(req.body);
    successResponse(res, 201, "Expert registered successfully", {
      uid: result.uid,
    });
  } catch (error) {
    console.error("Error in registerExpert:", error);
    errorResponse(res, 400, error.message || "Expert registration failed");
  }
};

exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    successResponse(res, 200, "Login successful", {
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error("Error in login:", error);
    errorResponse(res, 401, error.message || "Invalid credentials");
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body);
    successResponse(res, 200, result.message);
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    errorResponse(res, 400, error.message || "Failed to send OTP");
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body);
    successResponse(res, 200, result.message);
  } catch (error) {
    console.error("Error in resetPassword:", error);
    errorResponse(res, 400, error.message || "Failed to reset password");
  }
};
