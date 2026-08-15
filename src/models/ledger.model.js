const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: [true, 'Account is required'],
        immutable: true,
        index: true,
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount must be a positive number'],
        immutable: true,
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: [true, 'Transaction is required'],
        immutable: true,
        index: true,
    },
    type: {
        type: String,
        enum: {
            values: ['CREDIT', 'DEBIT'],
            message: 'Invalid type value'
        },
        required: [true, 'Type is required'],
        immutable: true,
    },
}, {
    timestamps: true
});

function preventLedgerModification() {
    throw new Error('Ledger entries cannot be modified or deleted');
}

ledgerSchema.pre('findOneAndUpdate', preventLedgerModification);
ledgerSchema.pre('updateOne', preventLedgerModification);
ledgerSchema.pre('deleteOne', preventLedgerModification);
ledgerSchema.pre('findOneAndDelete', preventLedgerModification);
ledgerSchema.pre('remove', preventLedgerModification);
ledgerSchema.pre('deleteMany', preventLedgerModification);

const ledgerModel = mongoose.model('Ledger', ledgerSchema);

module.exports = ledgerModel;