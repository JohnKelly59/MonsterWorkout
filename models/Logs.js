const mongoose = require("mongoose");
// schema for user favorite cards
const LogsSchema = new mongoose.Schema({
  title: {
    type: String,
  },

  body: {
    type: String,
  },

  date: {
    type: String,
  },

  UserId: {
    type: String,
  },
});

module.exports = mongoose.model("Logs", LogsSchema);
