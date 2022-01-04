const mongoose = require("mongoose");
// schema for user favorite cards
const FavoriteSchema = new mongoose.Schema({
  bodyPart: {
    type: String,
  },
  equipment: {
    type: String,
  },
  id: {
    type: String,
  },
  gifUrl: {
    type: String,
  },
  name: {
    type: String,
  },
  target: {
    type: String,
  },
  UserId: {
    type: String,
  },
});

module.exports = mongoose.model("Favorite", FavoriteSchema);
