const Item = require("../models/itemModel");

// This controller function handles searching for items based on a search query parameter.
async function searchItems(req, res) {
  try {
    const { search } = req.query;

    // If there is no search term the response will be empty
    if (!search || !search.trim()) {
      return res.json([]);
    }

    // This will use the index defined in the model for text search
    const results = await Item.find(
      { $text: { $search: search.trim() } },
      {
        title: 1,
        description: 1,
        start_price: 1,
        reserve_price: 1,
        score: { $meta: "textScore" }, // relevance score
      }
    )
      .sort({ score: { $meta: "textScore" } })
      .lean();

    return res.json(results);
  } catch (err) {
    console.error("searchItems error:", err.message);
    return res
      .status(500)
      .json({ code: "SEARCH_ERROR", message: "Failed to search items" });
  }
}

module.exports = { searchItems };
