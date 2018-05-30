const Blockchain = require('../../models/blockchain/blockchain');
const Block = require('../../models/blockchain/block');
const Transaction = require('../../models/transaction');
const globalBlock = new Block();
const globalBlockchain = new Blockchain();

const express = require('express');
const router = express.Router();

router.get('/api/blocks', (req, res) => {
    globalBlock.all(result => res.status(200).send(result));
});


router.post('/api/blocks', (req, res) => {
    let transactionInfo = req.body.tran;
    const transaction = new Transaction(transactionInfo);
    globalBlockchain.createTransaction(transaction);
    //Don't forget to update the mining proccess
    const minedTranHash = globalBlockchain.miningPendingTransactions("address");
    res.status(200).send(minedTran);
});

module.exports = router;