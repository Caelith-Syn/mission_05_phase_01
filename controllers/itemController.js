const Item = require("../models/itemModel");

// This controller function handles searching items based on a search term and optional price filters.
async function searchItems(req, res) {
  try {
    const { search, min, max } = req.query;

    // This validates the search term
    if (!search || !search.trim()) {
      return res.json([]);
    }

    // This builds the text search query
    const query = { $text: { $search: search.trim() } };

    // This processes the min and max price filters
    let priceFilter = {};
    if (min !== undefined) {
      const minNum = Number(min);
      if (Number.isNaN(minNum)) {
        return res.status(400).json({
          code: "BAD_REQUEST",
          message: "min must be a number",
          details: { min },
        });
      }
      priceFilter.$gte = minNum;
    }

    if (max !== undefined) {
      const maxNum = Number(max);
      if (Number.isNaN(maxNum)) {
        return res.status(400).json({
          code: "BAD_REQUEST",
          message: "max must be a number",
          details: { max },
        });
      }
      priceFilter.$lte = maxNum;
    }

    if (
      priceFilter.$gte !== undefined &&
      priceFilter.$lte !== undefined &&
      priceFilter.$gte > priceFilter.$lte
    ) {
      return res.status(400).json({
        code: "BAD_REQUEST",
        message: "min cannot be greater than max",
        details: { min, max },
      });
    }

    if (priceFilter.$gte !== undefined || priceFilter.$lte !== undefined) {
      // This will apply the price filter to start_price
      query.start_price = priceFilter;
    }

    // This queries the database with the constructed query
    const results = await Item.find(query, {
      title: 1,
      description: 1,
      start_price: 1,
      reserve_price: 1,
      score: { $meta: "textScore" },
    })
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
