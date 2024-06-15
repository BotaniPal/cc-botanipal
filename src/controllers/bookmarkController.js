const predictService = require('../services/predictService');
const bookmarkService = require('../services/bookmarkService');

exports.createBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const { prediction, imageUrl, predictionType } = req.body; 

    const bookmark = await bookmarkService.createBookmark(userId, prediction, imageUrl, predictionType);
    res.status(201).json(bookmark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookmarkId = req.params.bookmarkId;

    await bookmarkService.deleteBookmark(bookmarkId, userId);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'Bookmark not found') {
      return res.status(404).json({ error: error.message });
    } else if (error.message === 'Unauthorized to delete bookmark') {
      return res.status(403).json({ error: error.message });
    } else {
      console.error('Error deleting bookmark:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

exports.getUserBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookmarks = await bookmarkService.getUserBookmarks(userId);
    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};