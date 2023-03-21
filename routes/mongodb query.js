'use strict'
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const fs = require('fs');
const path = require('path');
const EVENT_LOG_PATH = path.join(__dirname, 'event_store.txt')

 
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("runoob");
    var query = { eventstate: 'DepositEvent',blocknumber: 9 };
    dbo.collection("site").find({}).toArray(function(err, result) {
      if (err) throw err;
      var resultjson=JSON.stringify(result);
      fs.writeFileSync(EVENT_LOG_PATH,resultjson);
      db.close();
    });
});
let resultout=fs.readFileSync(EVENT_LOG_PATH,'utf-8');//resultout 是JSON格式
let eventarr= JSON.parse(resultout);//轉換成array
console.log(eventarr);
let passevent =eventarr.reduce((accounts,event)=>{
accounts[event.from] += parseInt(event.value,10)
accounts[event.to] -= parseInt(event.value,10)
console.log(accounts);
// return accounts;
},{})
