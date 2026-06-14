const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GallerySchema = new Schema({
  name: { type: String, maxLength: 100 },
  description: { type: String, maxLength: 200 },
  update_time: { type: Date },
  owner: { type: Schema.Types.ObjectId, ref: "User" }
}, { collection: 'galleries' });

module.exports = mongoose.model("Gallery", GallerySchema);
