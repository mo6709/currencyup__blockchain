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
    //Validate
    // const schema = {
    //     snederId: Joi.string().min(2).required()
    // };

    // const result = Joi.validate(req.body, schema);

    // if(result.error) {
    // 	res.status(400).send(result.error.details);
    // 	result;
    // }
    

   //  const trassertan = { 
   //  	id: transactions.length + 1, 
  	//     snederId: req.body.snederId ,
  	//     reciverId: req.body.reciverId,
  	//     amount: 100 
  	// }

    // let transactionInfo = {};
    // Blockchain.createTransaction(transactionInfo);
    // const minedTran = Blockchain.miningPendingTransactions("address");
    // res.status(200).send(minedTran);
});

module.exports = router;

// router.get('/api/blocks/:id', (req, res, next) => { 
//  const id  = req.params.id;
//  const tran = transactions.find( tran => tran.id === partInt(id));
//  if(!tran) res.status(404).send("Could not find transaction");
//  res.send(tran);
// });