const SHA256 = require('crypto-js/sha256');
const Joi = require('joi');
const MongoClient = require('mongodb');
const ObjectID = require('mongodb');

const url = 'mongodb://localhost:27017/';

class Block{
	constructor(timestamp, transactions, previousHash = ''){
		this.timestamp = timestamp;
		this.transactions = transactions;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}
    
    async insertToDB(block){
        async function dbOperation() {
			const db = await MongoClient.connect(url);
			const dbo = db.db('currencyup_blockchain');
			const cursor = await dbo.collection('Blocks').insertOne(block);
			db.close();
		}

		await dbOperation();
    }

	async all(callback){
        let resultArray = [];

		async function dbOperation() {
			const db = await MongoClient.connect(url);
			const dbo = db.db('currencyup_blockchain');
			// Don't `await`, instead get a cursor
			const cursor = dbo.collection('Blocks').find();
			// Use `next()` and `await` to exhaust the cursor
			for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
			    resultArray.push(doc);
			}
			db.close();
		}

		await dbOperation();
		callback(resultArray);
	}

	getLatestBlock(callback){
		let resultArray = [];

		async function dbOperation() {
			const db = await MongoClient.connect(url);
			const dbo = db.db('currencyup_blockchain');
			// Don't `await`, instead get a cursor
			const count = dbo.collection('Blocks').count() -1;
	        const cursor = dbo.collection('Blocks').find().skip(count);
			// Use `next()` and `await` to exhaust the cursor
			for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
			    resultArray.push(doc);
			}
			db.close();
		}

		await dbOperation();
		callback(resultArray[0]);
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