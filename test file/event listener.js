//需要主動透過event listener 去截取event
var Web3 = require('web3');
const contract = require('../contract/Bank.json');

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}
web3.eth.defaultAccount = web3.eth.accounts[0];

let bank = new web3.eth.Contract(contract.abi ,"0x4e8e2b60354fe7008a05142e8657d82B120F0515");
// console.log(bank);
//getpastevents 只有存款時才能讀取
bank.getPastEvents('DepositEvent',function(error, events){ 
	if(error){
		console.log(error)
	}
	else{
		console.log(events); 
		// console.log(events[0].returnValues);
		var eventresult = JSON.stringify(events[0].returnValues);
		eventresult = JSON.parse(eventresult);
		// console.log(eventresult);
		// console.log(eventresult.from);
		const MongoClient = require('mongodb').MongoClient;
		const url = "mongodb://localhost:27017/";
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
    	var dbo = db.db("runoob");
		var myobj =  [
			{   contractaddress:events[0].address,
				from: eventresult.from ,
				to: events[0].address,
			   value: eventresult.value,
			   blocknumber: events[0].blockNumber,
			   eventstate:events[0].event }
		   ];
		dbo.collection("site").insertMany(myobj, function(err, res) {
			if (err) throw err;
        console.log("成功存入資料庫 插入的文件數量: " + res.insertedCount);
        db.close();
		});
	})
}
}
  );



// bank.events.allEvents( function(error, event){ console.log(event); })
// .on('data', function(event){
//     console.log(event); // same results as the optional callback above
// })
// .on('changed', function(event){
//     // remove event from local database
// })
// .on('error', console.error);


// bank.events.DepositEvent( function(error, event){ console.log(event); })
// .on('data', function(event){
//     console.log(event); // same results as the optional callback above
// })
// .on('changed', function(event){
//     // remove event from local database
// })
// .on('error', console.error);
