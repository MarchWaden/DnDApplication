const mongoose = require('mongoose');
const User = require('./user');

const gameSchema = new mongoose.Schema ({
    name:  {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
    },
    password: {
      type: String
    },
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    imageURL: {
      type: String
    }
})

module.exports = mongoose.model('Game', gameSchema);
