const Transaction = require('../transaction');
const Block = require('./block');
const globalBlock = new Block();
const globalTransaction = new Transaction();

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
        let allPendiingTransactions;
        let latestBlock;

        globalTransaction.pendingTransactions(result => allPendiingTransactions = result);
        globalBlock.getLatestBlock(result => latestBlock = result);

        const newBlock = new Block(Data.now(), allPendiingTransactions, latestBlock.hash);
        newBlock.mineBlock(this.difficulty);

        globalBlock.insertToDB(newBlock);
        //reset the pending transactions after the miner finish to mine the block
        //add new transaction to reword the miner
        const transaction = new Transaction({ 
            toAddress: miningRewardAddress, 
            total_amount: this.miningReward 
        });
        globalTransaction.resetPendingTransactions(transaction);

        return newBlock.hash;
    }
    

    createTransaction(transaction){
        globalTransaction.insertPendingTransaction(transaction);
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