const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'user', required: true }, // Who receives
  type: { type: String, required: true }, // 'like', 'comment', 'follow', etc.
  from: { type: Schema.Types.ObjectId, ref: 'user' }, // Who triggered
  post: { type: Schema.Types.ObjectId, ref: 'post' }, // Optional: related post
  read: { type: Boolean, default: false },
  message: { type: String }, // Optional: custom message
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('notification', NotificationSchema); 