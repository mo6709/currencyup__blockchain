const Blockchain = require('../../models/blockchain/blockchain');
const Block = require('../../models/blockchain/block');

const express = require('express');
const router = express.Router();

router.get('/api/blocks', (req, res) => { 
    const block = new Block();
    const blocks = block.all();
    console.log(blocks);
    res.status(200).send(blocks);
});


router.post('/api/blocks', (req, res) => {
    const blockchain = new Blockchain();
    let transactionInfo = req.body;
    blockchain.createTransaction(transactionInfo);
    const minedTran = blockchain.miningPendingTransactions("address");
    res.status(200).send(minedTran);
});

module.exports = router;