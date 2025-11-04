const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [120, "Title must be at most 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [5, "Description must be at least 5 characters"],
      maxlength: [2000, "Description must be at most 2000 characters"],
    },
    start_price: {
      type: Number,
      required: [true, "Start price is required"],
      min: [0, "Start price cannot be negative"],
    },
    reserve_price: {
      type: Number,
      required: [true, "Reserve price is required"],
      min: [0, "Reserve price cannot be negative"],
      validate: {
        validator: function (value) {
          // Reserve should be >= start
          return typeof this.start_price === "number"
            ? value >= this.start_price
            : true;
        },
        message: "Reserve price must be greater than or equal to start price",
      },
    },
  },
  { timestamps: true }
);

// Text index for search on title + description
itemSchema.index({ title: "text", description: "text" });

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
