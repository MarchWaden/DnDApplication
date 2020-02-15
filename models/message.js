const mongoose = require('mongoose');
const Users = require('./user')

const messageSchema = new mongoose.Schema ({
  message: {
    type: String,
    required: true
  },
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
})

module.exports = mongoose.model('message', messageSchema)
