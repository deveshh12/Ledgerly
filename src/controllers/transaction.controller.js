const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const emailService = require('../services/email.service')

/*
    Create a new transaction
    10 steps-

        1. Validate request
        2. Validate idempotency key
        3. Check account status
        4. Derive sender balance from ledger
        5. Create Transaction (PENDING)
        6. Create debit ledger entry
        7. Create CREDIT ledger entry
        8. Mark transaction completed
        9. Commit MongoDB session
        10. Send email notification

*/
async function createTransaction(req, res){
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body
    
}

module.exports = {
    createTransaction
}