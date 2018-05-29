const Blockchain = require('../../models/blockchain/blockchain');
const Block = require('../../models/blockchain/block');
const globalBlock = new Block();
const globalBlockchain = new Blockchain();

const express = require('express');
const router = express.Router();

router.get('/api/blocks', (req, res) => {
    globalBlock.all(result => res.status(200).send(result));
});


router.post('/api/blocks', (req, res) => {
    let transactionInfo = {};
    globalBlockchain.createTransaction(transactionInfo);
    const minedTran = globalBlockchain.miningPendingTransactions("address");
    res.status(200).send(minedTran);
});

module.exports = router;