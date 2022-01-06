const mongoose = require("mongoose");
// schema for user favorite cards
const DailySchema = new mongoose.Schema({
  id: {
    type: String,
  },

  UserId: {
    type: String,
  },
});
DailySchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model("Daily", DailySchema);
