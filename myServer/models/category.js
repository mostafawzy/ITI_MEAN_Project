const mongoose = require("mongoose");

let categorySchema = mongoose.Schema({
  slug: String,
  name: String,
  url: String
});

module.exports = mongoose.model("Category", categorySchema);
