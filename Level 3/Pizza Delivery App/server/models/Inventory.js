const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemType: {
    type: String,
    required: true,
    enum: ['base', 'sauce', 'cheese', 'veggie'],
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim : true
  },
 quantity : {
    type : Number,
    required : true,
    default : 100
 },
 threshold : {
    type : Number,
    default : 20
 },
 price : {
    type : Number,
    required : true
 }

}, {
  timestamps: true
});


module.exports = mongoose.model('Inventory', inventorySchema);