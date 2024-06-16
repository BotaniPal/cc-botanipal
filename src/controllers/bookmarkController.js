const predictService = require("../services/predictService");
const bookmarkService = require("../services/bookmarkService");
const { successResponse, errorResponse } = require("../utils/responseUtils");

exports.createBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const { prediction, imageUrl, predictionType } = req.body;

    const bookmark = await bookmarkService.createBookmark(
      userId,
      prediction,
      imageUrl,
      predictionType
    );
    successResponse(res, 201, "Bookmark created successfully", bookmark);
  } catch (error) {
    errorResponse(res, 500, error.message || "Failed to create bookmark");
  }
};

exports.deleteBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookmarkId = req.params.bookmarkId;

    await bookmarkService.deleteBookmark(bookmarkId, userId);
    successResponse(res, 204, "Bookmark deleted successfully");
  } catch (error) {
    if (error.message === "Bookmark not found") {
      errorResponse(res, 404, error.message);
    } else if (error.message === "Unauthorized to delete bookmark") {
      errorResponse(res, 403, error.message);
    } else {
      console.error("Error deleting bookmark:", error);
      errorResponse(res, 500, "Failed to delete bookmark");
    }
  }
};

exports.getUserBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookmarks = await bookmarkService.getUserBookmarks(userId);
    successResponse(
      res,
      200,
      "User bookmarks retrieved successfully",
      bookmarks
    );
  } catch (error) {
    console.error("Error getting user bookmarks:", error);
    errorResponse(res, 500, "Failed to get user bookmarks");
  }
};
