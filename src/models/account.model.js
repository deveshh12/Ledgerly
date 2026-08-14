const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true,
  },
  status: {
    enum:{
        values: ['Active', 'Frozen', 'Inactive'],
        message: 'Invalid status'
    }
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    default: 'INR',
  },
  
}, {
    timestamps: true
});

accountSchema.index({ user: 1, status: 1 });

const accountModel = mongoose.model('Account', accountSchema);

module.exports = accountModel;