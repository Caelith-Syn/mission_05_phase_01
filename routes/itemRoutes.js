const express = require("express");
const { searchItems } = require("../controllers/itemController");

const router = express.Router();

// This route handles GET requests to /api/items with an optional search query parameter
router.get("/items", searchItems);

module.exports = router;
