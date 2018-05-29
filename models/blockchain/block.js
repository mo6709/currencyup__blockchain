const SHA256 = require('crypto-js/sha256');
const Joi = require('joi');
const MongoClient = require('mongodb'); 
const ObjectID = require('mongodb');

const url = "mongodb://localhost:27017/";

class Block{
	constructor(timestamp, transactions, previousHash = ''){
		this.timestamp = timestamp;
		this.transactions = transactions;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	dbConnection(){}
    
    insertToDB(block){
        MongoClient.connect(url, (err, db) => {
            if(err) throw err;
            const dbo = db.db("currencyup_blockchain");
            dbo.collection("blocks").insertOne(block, (err, result) => {
            	if(err) throw err;
            	db.close();
            	return block;
            })
        })
    }

	all(){
		let resultArray = [];
	    MongoClient.connect(url, (err, db) => {
	        if(err) throw err;
	        const dbo = db.db("currencyup_blockchain");
	        const blocks = dbo.collection('blocks').find();
	        blocks.forEach((doc, err) => {
	            if(err) throw err;
	            resultArray.push(doc);
	        }, () => {
	            db.close();
	            console.log(resultArray);
	            return resultArray ;
	        });
	    });
	}

	getLatestBlock(){
	    MongoClient.connect(url, (err, db) => {
	        if(err) throw err;
	        const dbo = db.db("currencyup_blockchain");
	        const count = dbo.collection("blocks").count() -1;
	        const blocks = dbo.collection('blocks').find().skip(count);
	        blocks.forEach((doc, err) => {
	            if(err) throw err;
	            resultArray.push(doc);
	        }, () => {
	            db.close();
	            return resultArray ;
	        });
	    });

		return resultArray[0];
	}

	calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
	}
    
	mineBlock(difficulty){
		while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
			this.nonce++;
			this.hash = this.calculateHash();
		}
	}
}

module.exports = Block;