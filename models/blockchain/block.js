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

	async all(callback){
    	// MongoClient.connect(url, (err, db) => {
    	// 	console.log("first step");
	    //     if(err) throw err;
	    //     const dbo = db.db("currencyup_blockchain");
     //        const cursor = dbo.collection('blocks').find({});
     //        console.log(cursor);
     //        return cursor;
            //.then(
		   //  	async function(cursor) { 
					// console.log("second step");
				 //    await Promise.all(
				 //    	cursor.map(
				 //    		async function(block) { 
					// 	        await resultArray.push(block);
					// 	    }
					// 	) 
					// );
					// db.close(); 
			  //   };
			//);
	        // const blocks = dbo.collection('blocks').find();
	        // blocks.forEach((doc, err) => {
	        //     if(err) throw err;
	        //     resultArray.push(doc);
	        // });
	    // });
        
  //       let resultArray = [];

  //       async function getData(){
		//     const db = await MongoClient.connect(url);
		// 	try {
		// 		const dbo = db.db('currencyup_blockchain');
		// 	    const cursor = await dbo.collection('blocks').find({});
		// 	    // Do something with the result of the query
		// 	    async function iterate(){ 
		// 	    	cursor.map((doc, err) => {
		// 	            if(err) throw err;
		// 	            resultArray.push(doc);
		// 	        });
		// 	    };
		//         console.log(resultArray);
		// 	} finally {
		// 	    db.close();
		// 	};
	 //    };

  //       getData();
		// return resultArray;
        
  //       let resultArray = [];
		// const db = MongoClient.connect(url);
		// try {
  //           const dbo = db.db('currencyup_blockchain');
		// 	dbo.collection('blocks').find({})
		// 	.then(
		// 		async function(cursor) { 
		// 		    await Promise.all(
		// 		    	cursor.map(
		// 		    		async function(block) { 
		// 				        await resultArray.push(block);
		// 				    }
		// 				) 
		// 			)
		// 	    }
		// 	)
		// } finally {
		// 	db.close();
		// }
		// return resultArray;

		
        let resultArray = [];
		async function test() {
		  const db = await MongoClient.connect(url);
		  const dbo = db.db('currencyup_blockchain');
		  // Don't `await`, instead get a cursor
		  const cursor = dbo.collection('blocks').find();
		  // Use `next()` and `await` to exhaust the cursor
		  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
		    resultArray.push(doc);
		  }
		  console.log("call at the end of test");
		}

        console.log("call before test");
		await test();
		callback(resultArray);
		console.log("call after test");
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