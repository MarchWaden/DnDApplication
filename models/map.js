const mongoose = require('mongoose');
const Users = require('./user')

const mapSchema = new mongoose.Schema ({
  url: {
    type: String,
    required: true
  },
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
  name:{type: String, required: true}
})

module.exports = mongoose.model('message', mapSchema)
