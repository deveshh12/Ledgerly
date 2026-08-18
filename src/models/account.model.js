const mongoose = require('mongoose');
const ledgerModel = require('./ledger.model');
const accountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true,
  },
  status: {
    type: String,
    enum:{
        values: ['Active', 'Frozen', 'Inactive'],
        message: 'Invalid status',
        
    },
    default: 'Active',
    
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

accountSchema.methods.getBalance = async function() {
  const balanceData = await ledgerModel.aggregate([
  {
    $match: {
      accountId: this._id
    }
  },
  {
    $group: {
      _id: null,

      totalDebit: {
        $sum: {
          $cond: [
            { $lt: ["$amount", 0] },
            { $abs: "$amount" },
            0
          ]
        }
      },

      totalCredit: {
        $sum: {
          $cond: [
            { $gt: ["$amount", 0] },
            "$amount",
            0
          ]
        }
      }
    }
  }
]);

  if (balanceData.length === 0) {
    return 0;
  }

  const { totalDebit, totalCredit } = balanceData[0];

  return totalCredit - totalDebit;
}

const accountModel = mongoose.model('Account', accountSchema);

module.exports = accountModel;