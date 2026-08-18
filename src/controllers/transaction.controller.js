const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const emailService = require('../services/email.service')
const accountModel = require('../models/account.model')
const mongoose = require('mongoose');

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

    // 1. Validate request
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body
    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"FromAccount, toAccount, amount, idempotency key are required"
        })
    }

    const fromUserAccount = await accountModel.findOne({_id : fromAccount})
    const toUserAccount = await accountModel.findOne({_id: toAccount})

    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message: "Invalid to or from account"
        })
    }

    // 2. Validate Idempotency key
    const isTransactionAlreadyExists = await transactionModel.findOne({idempotencyKey: idempotencyKey});

    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status === "completed"){
            return res.status(200).json({
                message: "Transaction already processed",
                transaction: isTransactionAlreadyExists
            })
        }
        if(isTransactionAlreadyExists === "pending"){
            return res.status(200).json({
                message: "Transaction is still processing"
            })
        }
        if(isTransactionAlreadyExists.status === "failed"){
            return res.status(500).json({
                message:"Transaction processing failed, please retry"
            })
        }
        if(isTransactionAlreadyExists.status === "reversed"){
            return res.status(400).json({
                message: "Transaction was reversed, please retry"
            })
        }
    }

    // 3. Check account status
    if(fromUserAccount.status !== "Active" || toUserAccount.status !== "Active"){
        return res.status(400).json({
            message: "Both accounts must be active to process transaction"
        })
    }

    // 4. Derive sender balance from ledger
    const balance = await fromUserAccount.getBalance()

    if(balance < amount){
        return res.status(400).json({
            message: `Insufficient balance to process transaction. Available balance: ${balance}`
        })
    }

    // 5. Create Transaction (PENDING)
    const session = await transactionModel.startSession();
    session.startTransaction();
    const transaction = await transactionModel.create({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "pending"
    }, { session });
    const debitLedgerEntry = await ledgerModel.create({
        account: fromAccount,
        transactionId: transaction._id,
        amount: -amount,
        type: "debit"
    }, { session });

    const creditLedgerEntry = await ledgerModel.create({
        accountId: toAccount,
        transactionId: transaction._id,
        amount: amount,
        type: "credit"
    }, { session });
    transaction.status = "completed"
    await transaction.save({ session });
    await session.commitTransaction();
    session.endSession();

    // 10. Send email notification
    emailService.sendTransactionDebitEmail(fromUserAccount.user, fromUserAccount.name, amount, toUserAccount.name)
    emailService.sendTransactionCreditEmail(toUserAccount.user, toUserAccount.name, amount, fromUserAccount.name)

    return res.status(200).json({
        message: "Transaction processed successfully",
        transaction
    })
}

module.exports = {
    createTransaction
}