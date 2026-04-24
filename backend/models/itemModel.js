const mongoose = require("mongoose");

const itemSchema = mongoose.Schema(
  {
    wishlistId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Wishlist",
    },
    name: {
      type: String,
      required: [true, "Please add an item name"],
    },
    productLink: {
      type: String,
      default: "",
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["available", "taken", "received"],
      default: "available",
    },
    reservedBy: {
      type: String,
      default: null,
    }, // Could be 'guest: John Doe' or 'user: <userId>'
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Item", itemSchema);
