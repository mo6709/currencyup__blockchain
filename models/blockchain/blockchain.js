const Transaction = require('../transaction');
const Block = require('./block');
const globalBlock = new Block();

class Blockchain{
    constructor(){
        this.difficulty = 2;
        this.miningReward = 100;
    }

    createGenesisBlock(){
        var newBlock = new Block(Data.now(), ["Genesis block"], "0");
        globalBlock.insertToDB(newBlock);
        return newBlock;
    }

    miningPendingTransactions(miningRewardAddress){
        let newBlock = new Block(Data.now(), Transaction.pendingTransactions(), globalBlock.getLatestBlock().hash);
        globalBlock.mineBlock(this.difficulty);

        globalBlock.insertToDb(newBlock);
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
        let balance = 0;
        let chain = [];
        globalBlock.all(result => chain = result);

        for(const block in chain){
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
        const chain = [];
        globalBlock.all(result => chain = result);

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