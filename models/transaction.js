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

    insertPendingTransaction(transaction){
    	MongoClient.connect(url, (err, db) => {
            if(err) throw err;
            const dbo = db.db("currencyup_blockchain");
            dbo.collection("transactions").insertOne(transaction, (err, result) => {
                if(err) throw err;
                db.close();
                return transaction;
            });
    	});
    }

    resetPendingTransactions(transaction){
    	MongoClient.connect(url, (err, db) => {
            if(err) throw err;
            const dbo = db.db("currencyup_blockchain");
            dbo.collection("transactions").remove({});
            dbo.collection("transactions").insertOne(transaction);
    	});
    }

	pendingTransactions(){
		let resultArray = [];
        MongoClient.connect(url, (err, db) => {
            if(err) throw err;
            const dbo = db.db("currencyup_blockchain");
            const transactions = dbo.collection("transactions").find();
            transaction.forEach((doc, err) => {
            	if(err) throw err;
                resultArray.push(doc);
            }, () => {
            	db.close();
            	return resultArray;
            });
        });
	}
}

module.exports = Transaction;