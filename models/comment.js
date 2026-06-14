const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  text: { type: String, required: true, maxLength: 500 },
  image: { type: Schema.Types.ObjectId, ref: "Image", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  created_at: { type: Date, default: Date.now }
}, { collection: 'comments' });

module.exports = mongoose.model("Comment", CommentSchema);