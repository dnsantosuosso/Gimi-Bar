const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//Session Model: borrowed code from Sunsational Shades - nothing implemented yet
const sessionSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    login: { type: Date, required: true }, //time of login
    logout: { type: Date, required: false }, //time of logout
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('Session', sessionSchema);
