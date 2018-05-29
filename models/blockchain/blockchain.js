const Transaction = require('../transaction');
const Block = require('./block');

class Blockchain{
	constructor(){
        this.difficulty = 2;
        this.miningReward = 100;
	}

	createGenesisBlock(){
		var block = new Block(Data.now(), ["Genesis block"], "0");
        Block.insertToDB(block);
        return block;
	}

	miningPendingTransactions(miningRewardAddress){
        let block = new Block(Data.now(), Transaction.pendingTransactions(), Block.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        block.insertToDb(block);
        //reset the transactions array after the miner finish to mine it
        //add new transaction to reword the miner
        Transaction.resetPendingTransactions({ 
            toAddress: miningRewardAddress, 
            total_amount: this.miningReward 
        });
	}
    

    createTransaction(transaction){
        Transaction.insertPendingTransaction(transaction);
    }

    getBalanceOfAddress(address){
    	balance = 0;

    	for(const block in Block.all()){
    		for(const transaction in block.transactions){
    			if(transaction.fromAddress === address){
    				balance -= transaction.amount;
    			}

    			if(transaction.toAddress === address){
    				balance += transaction.amount;
    			}
    		}
    	}

        return balance;
    }

	isChainValid(){
        const chain = Block.all();
		for(let i = 1; i < chain.length; i++){
            const currentBlock = chain[i];
            const previousBlock = chain[i -1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
            	return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
            	return false;
            }
		}

		return true;
	}
}

module.exports = Blockchain;