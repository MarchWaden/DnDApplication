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
    state: {
      squares: [{i: Number, j: Number, Color: String, Shape: String, Name: String}],
      image: String,
      squareSize: {
        type: Number,
        default: 25
      }
    }

})

module.exports = mongoose.model('Game', gameSchema);
