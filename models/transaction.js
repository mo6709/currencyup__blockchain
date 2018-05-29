const Joi = require('joi');
const MongoClient = require('mongodb');
const ObjectID = require('mongodb');
const url = "mongodb://localhost:27017/";

class Transaction{
    constructor(transactionInfo = {}){
        this.fromAddress = transactionInfo.from_address;
        this.toAddress = transactionInfo.to_address;
        this.corporationID = transactionInfo.corporation_id;
        this.investorID = transactionInfo.investor_id;
        this.currencyID = transactionInfo.currency_id;
        this.totalAmount = transactionInfo.total_amount;
        this.dolarRate = transactionInfo.dolar_rate;
        this.returnRate = transactionInfo.return_rate;
        this.tType = transactionInfo.t_type;
        this.corporationInvestmentID = transactionInfo.corporation_investment_id;
    }

    async insertPendingTransaction(transaction){    
        async function dbOperation() {
            const db = await MongoClient.connect(url);
            const dbo = db.db('currencyup_blockchain');
            await dbo.collection('Transactions').insertOne(transaction);
            db.close();
        }

        await dbOperation();
    }

    async resetPendingTransactions(transaction){
        async function dbOperation() {
            const db = await MongoClient.connect(url);
            const dbo = db.db('currencyup_blockchain');
            await dbo.collection('Transactions').remove({});
            await dbo.collection('Transactions').insertOne(transaction);
            db.close();
        }

        await dbOperation();
    }

    async pendingTransactions(){
        let resultArray = [];

        async function dbOperation() {
            const db = await MongoClient.connect(url);
            const dbo = db.db('currencyup_blockchain');
            // Don't `await`, instead get a cursor
            const cursor = dbo.collection('Transactions').find();
            // Use `next()` and `await` to exhaust the cursor
            for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
                resultArray.push(doc);
            }
            db.close();
        }

        await dbOperation();
        callback(resultArray);
    }
}

module.exports = Transaction;